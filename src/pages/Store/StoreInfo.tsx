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
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { storeId } = useParams<{ storeId: string }>();

  // 1. 초기 즐겨찾기 상태 확인 (GET)
  useEffect(() => {
    const apiUri = import.meta.env.VITE_API_URI;
    const checkFavoriteStatus = async () => {
      if (!storeId) {
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      console.log(token);
      
      try {
        // [수정] GET 요청
        const response = await fetch(`${apiUri}/v1/favstores`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          // [수정 핵심] 응답 Body를 파싱하여 실제 favorite 값을 확인해야 함
          const result = await response.json();
          console.log('[Favorite Check] Response:', result);

          // API 응답 구조: { data: [ { favorite: true, ... } ] }
          if (result.data && Array.isArray(result.data) && result.data.length > 0) {
            // 배열의 첫 번째 요소 혹은 현재 storeId와 일치하는 요소의 favorite 값 사용
            const storeData = result.data.find((item: any) => item.storeId === Number(storeId)) || result.data[0];
            setIsFavorited(storeData.favorite);
          } else {
            // 데이터가 없으면 즐겨찾기 안 된 상태로 간주
            setIsFavorited(false);
          }
        } else if (response.status === 404) {
          setIsFavorited(false);
        } else {
          console.error('Failed to check favorite status:', response.statusText);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFavoriteStatus();
  }, [storeId]);

  const handleGoToReview = () => {
    navigate(`/store/${storeId}/review`);
  };

  // 2. 즐겨찾기 토글 (POST / DELETE)
  const handleToggleFavorite = async () => {
    const apiUri = import.meta.env.VITE_API_URI;
    if (!storeId) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    const url = `${apiUri}/v1/favstores/${storeId}`;
    
    const method = isFavorited ? 'DELETE' : 'POST';

    console.log(`[Favorite Toggle] ${method} Request to: ${url}`);

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          // 빈 Body를 보낼 때는 Content-Type을 생략하는 것이 안전함 (400 에러 방지)
        },
        body: '', // 빈 문자열 전송 (curl -d '' 와 동일)
      });

      if (response.ok) {
        setIsFavorited((prev) => !prev);
        console.log(`[Favorite Toggle] Success! New State: ${!isFavorited}`);
      } else {
        // 에러 로그 강화
        console.error(`[Favorite Toggle Error] Status: ${response.status}`);
        if (response.status === 405) {
          alert('서버 오류: 이 기능(DELETE)은 현재 지원되지 않습니다. (405 Method Not Allowed)');
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || '요청 실패');
        }
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
        <div className="h-px bg-(--fill-color2)" />

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
    <div className="w-full p-10 text-center text-gray-500">
      <div className="flex flex-col items-center justify-center w-full h-[160px]">
        <div className="flex flex-row justify-center items-center">
          <p className="text-[14px] text-(--fill-color7)">2025년 01월 01일</p>
          <p>
            에 해당 가게 스탬프를 완료했어요. <br />
            방문 후기를 남겨주세요!
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
            <img
              src={share_icon}
              alt="공유하기"
              className="w-[16px] h-[16px] m-3 cursor-pointer"
            />
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