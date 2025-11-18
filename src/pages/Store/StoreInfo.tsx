/* eslint-disable @typescript-eslint/no-explicit-any */
import { BackButton2 } from '../../components/BackButton2';
import heart_empty_icon from '../../assets/heart_empty_icon.png';
import heart_icon from '../../assets/heart_icon.png';
import share_icon from '../../assets/share_icon.png';
import clock from '../../assets/clock.png';
import phone_icon from '../../assets/phone_icon.png';
import internet_icon from '../../assets/internet_icon.png';
import instagram_icon from '../../assets/instagram_icon.png';
import store_stamp from '../../assets/store_stamp.png';
import gift_icon from '../../assets/gift_icon.png';
import americano from '../../assets/americano.png';
import star_empty_icon from '../../assets/star_empty_icon.png';
import star_full_icon from '../../assets/star_full_icon.png';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const StoreInfo = () => {
  const [selectedTab, setSelectedTab] = useState<'home' | 'review'>('home');
  const [isFavorited, setIsFavorited] = useState(false); // <--- '좋아요' 상태 추가
  const [isLoading, setIsLoading] = useState(true); // <--- 로딩 상태 추가

  const navigate = useNavigate();
  const { storeid } = useParams<{ storeid: string }>();

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!storeid) {
        setIsLoading(false);
        return; // storeid가 없으면 실행 중지
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoading(false);
        // 로그인하지 않았으므로 '좋아요' 상태일 수 없음
        return;
      }

      try {
        const response = await fetch(`/api/v1/favstores/${storeid}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsFavorited(true); // 이미 '좋아요' 한 상태
        } else if (response.status === 404) {
          setIsFavorited(false); // '좋아요' 하지 않은 상태
        } else {
          // 기타 서버 오류
          console.error('Failed to check favorite status:', response.statusText);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFavoriteStatus();
  }, [storeid]); // storeid가 변경될 때마다 다시 실행

  const handleGoToReview = () => {
    navigate('/store/review');
  };

  // <--- NEW: '좋아요' 토글 핸들러
  const handleToggleFavorite = async () => {
    if (!storeid) {
      alert('가게 ID를 찾을 수 없습니다.');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/'); // 필요시 로그인 페이지로 이동
      return;
    }

    const url = `/api/v1/favstores/${storeid}`;
    const method = isFavorited ? 'DELETE' : 'POST'; // 상태에 따라 메소드 변경

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // 성공 시, 로컬 상태를 반전
        setIsFavorited((prev) => !prev);
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `'좋아요' ${isFavorited ? '취소' : '추가'}에 실패했습니다.`
        );
      }
    } catch (error: any) {
      console.error('Favorite toggle error:', error);
      alert(error.message);
    }
  };

  const HomeTabContent = () => (
    <>
      <div className="flex flex-col w-full h-[120px]">
        <div className="flex flex-row w-full h-[40px] items-center gap-3 border-b border-t border-(--fill-color1) px-6 ">
          <img src={clock} alt="" className="w-[20px] h-[20px]" />
          <p className="text-[14px] text-(--fill-color7) font-medium">
            영업 중
          </p>
          <p className="text-[14px] text-(--fill-color5) font-medium">
            24:00까지
          </p>
        </div>
        <div className="flex flex-row w-full h-[40px] items-center gap-3 border-b border-t border-(--fill-color1) px-6 ">
          <img src={phone_icon} alt="" className="w-[20px] h-[20px]" />
          <p className="text-[14px] text-(--fill-color7) font-medium">
            010-0000-0000
          </p>
        </div>
        <div className="flex flex-row w-full h-[40px] items-center border-b border-t border-(--fill-color1) px-6 ">
          <div className="w-1/2 flex flex-row items-center gap-3">
            <img src={internet_icon} alt="" className="w-[20px] h-[20px]" />
            <p className="text-[14px] text-(--fill-color7) font-medium">
              http:www.com
            </p>
          </div>
          <div className="w-1/2 flex flex-row items-center gap-3">
            <img src={instagram_icon} alt="" className="w-[20px] h-[20px]" />
            <p className="text-[14px] text-(--fill-color7) font-medium">
              @instagramid{' '}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-[360px] bg-(--fill-color1)">
        <div className="w-full h-[46px] px-6 items-center flex">
          {' '}
          <p className="text-[#72594B] font-semibold text-[18px]">Stamp</p>
        </div>

        {/* 구분선 */}
        <div className="h-px bg-(--fill-color1)" />

        <div className="flex flex-col items-center justify-center w-full">
          <img
            src={store_stamp}
            alt="Store Stamp"
            className="w-[220px] h-[144px] mt-5"
          />
          <div className="flex flex-row gap-2 items-center mt-5">
            <img src={gift_icon} alt="" className="w-[18px] h-[18px]" />
            <p className="text-[12px] text-(--fill-color6)">리워드 보상:</p>
            <p className="text-[12px] text-(--fill-color5)">매장 음료 1잔</p>
          </div>
          <button className="w-[292px] h-[52px] bg-(--main-color) text-(--fill-color1) text-[16px] font-semibold rounded-[30px] mt-6">
            스탬프 등록하기
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="w-full h-[54px] flex items-center px-6">
          <p className="text-(--main-color2) font-semibold text-[18px]">
            Signature Menu
          </p>
        </div>

        {/* 구분선 */}
        <div className="h-px bg-(--fill-color2)" />

        <div className="w-full h-[160px] justify-center items-center flex">
          <div className="flex flex-row items-center w-[350px] h-[120px]">
            <img src={americano} alt="" className="w-[120px] h-[120px]" />
            <div className="w-[212px] h-[100px] flex flex-col justify-center ml-5">
              <p className="text-(--main-color2) font-semibold text-[16px]">
                Americano
              </p>
              <p className="text-(--fill-color5) text-[14px]">
                원두와 물 그리고 얼음
              </p>
              <p className="text-(--fill-color7) text-[14px] mt-9">4,500원</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const ReviewTabContent = () => (
    <div className="w-full text-center text-gray-500">
      {/* 구분선 */}
      <div className="h-px bg-(--fill-color1)" />

      {/* 리뷰 탭 내용 */}
      <div className="flex flex-col items-center justify-center w-full h-[160px]">
        <div className="flex flex-row w-full justify-center">
          <p className="text-[14px] text-(--fill-color7)">2025년 01월 01일</p>
          <p className="text-[14px] text-(--fill-color6)">
            에 해당 가게 스탬프를 완료했어요.
          </p>
        </div>
        <p className="text-[14px] text-(--fill-color6)">
          방문 후기를 남겨주세요!
        </p>

        {/* 별점 */}
        <div
          className="flex flex-row justify-center mt-4 gap-2"
          onClick={handleGoToReview}
        >
          <img
            src={star_empty_icon}
            alt="별점 1"
            className="w-[30px] h-[30px]"
          />
          <img
            src={star_empty_icon}
            alt="별점 2"
            className="w-[30px] h-[30px]"
          />
          <img
            src={star_empty_icon}
            alt="별점 3"
            className="w-[30px] h-[30px]"
          />
          <img
            src={star_empty_icon}
            alt="별점 4"
            className="w-[30px] h-[30px]"
          />
          <img
            src={star_empty_icon}
            alt="별점 5"
            className="w-[30px] h-[30px]"
          />
        </div>
      </div>
      {/* 구분선 */}
      <div className="h-px bg-(--fill-color1)" />

      <div className="w-full px-6">
        <div className="w-full flex flex-col items-start mt-3">
          <div className="flex flex-row items-center gap-1">
            <p className="text-(--main-color2) font-semibold text-[18px]">
              Review
            </p>
            <p className="text-(--main-color2)">(${6})</p>
          </div>
          <div className="flex flex-row w-full h-[100px] items-center border-b border-(--fill-color1) mt-3">
            <img src={star_full_icon} alt="" className="w-[40px] h-[40px]" />
            <p className="text-[30px] text-(--main-color) font-extrabold ml-3">
              4.8
            </p>
            <p className="text-[18px] text-(--fill-color6) ml-3 align-text-bottom">
              {' '}
              /5.0
            </p>
          </div>
        </div>
      </div>

      <div className="flex h-[44px] items-center justify-center bg-(--fill-color1) rounded-[50px] text-(--fill-color5) text-[13px] mx-6">
        해당 가게의 스탬프를 완성한 유저만
        <br />
        리뷰를 작성할 수 있어요!
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col">
      <div className="w-full h-[220px] bg-amber-100">
        <div className="w-full flex justify-between items-start">
          <BackButton2 />
          <div className="flex flex-row justify-center items-center w-20 h-10 bg-(--fill-color1) rounded-[20px] opacity-90 m-3 p-1">
            {!isLoading && ( // 로딩이 끝난 후에만 아이콘 표시
              <img
                src={isFavorited ? heart_icon : heart_empty_icon}
                alt={isFavorited ? '채워진 하트' : '빈 하트'}
                className="w-[16px] h-[16px] m-3 cursor-pointer"
                onClick={handleToggleFavorite} // 핸들러 연결
              />
            )}
            <img src={share_icon} alt="공유하기" className="w-[16px] h-[16px] m-3 cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="w-full h-[180px] flex flex-col items-center justify-around px-6">
        <div className="flex flex-row items-center">
          <p className="text-(--fill-color7) font-semibold text-[24px] mr-5">
            카페나무
          </p>
          <p className="text-(--fill-color6) font-medium text-[14px]">
            커피 전문
          </p>
        </div>
        <div className="flex flex-row items-center gap-5">
          <p className="text-(--fill-color4) text-[12px]">8.3km</p>
          <p className="text-(--fill-color4) text-[12px]">
            서울 마포구 와우산로 94 홍문관 1층 (상수동)
          </p>
        </div>
        <div className="flex flex-row justify-center items-center w-full h-[54px] bg-(--fill-color1) rounded-[50px]">
          <div className="flex w-1/2 justify-center items-center">
            <button
              className={`w-[calc(100%-20px)] transition-all ${
                selectedTab === 'home'
                  ? 'bg-white h-[40px] rounded-[30px]'
                  : 'h-[40px] text-gray-500'
              }`}
              onClick={() => setSelectedTab('home')}
            >
              홈
            </button>
          </div>
          <div className="flex w-1/2 justify-center items-center">
            <button
              className={`w-[calc(100%-20px)] transition-all ${
                selectedTab === 'review'
                  ? 'bg-white h-[40px] rounded-[30px]'
                  : 'h-[40px] text-gray-500'
              }`}
              onClick={() => setSelectedTab('review')}
            >
              리뷰
            </button>
          </div>
        </div>
      </div>

      {selectedTab === 'home' ? <HomeTabContent /> : <ReviewTabContent />}
    </div>
  );
};
