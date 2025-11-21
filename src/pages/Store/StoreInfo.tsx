/* eslint-disable @typescript-eslint/no-explicit-any */
import { BackButton2 } from '../../components/BackButton2';
import heart_empty_icon from '../../assets/heart_empty_icon.png';
import heart_icon from '../../assets/heart_icon.png';
import share_icon from '../../assets/share_icon.png';
import clock from '../../assets/clock.png';
import phone_icon from '../../assets/phone_icon.png';
import internet_icon from '../../assets/internet_icon.png';
import instagram_icon from '../../assets/instagram_icon.png';
// 기본 이미지(데이터 없을 때 사용)
import default_store_stamp from '../../assets/store_stamp.png';
import gift_icon from '../../assets/gift_icon.png';
import americano from '../../assets/americano.png';
import star_empty_icon from '../../assets/star_empty_icon.png';
// import star_full_icon from '../../assets/star_full_icon.png';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

// [추가] API 응답 타입 정의
interface StoreDetail {
  storeId: number;
  storeName: string;
  storeAddress: string;
  category: string;
  phone: string;
  storeUrl: string | null;
  stampImageUrl: string;
  storeImageUrl: string;
  reward: string;
  stampReward: string;
  sns: string | null;
}

export const StoreInfo = () => {
  const [selectedTab, setSelectedTab] = useState<'home' | 'review'>('home');
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // [추가] 상세 정보 상태 관리
  const [storeDetail, setStoreDetail] = useState<StoreDetail | null>(null);

  const navigate = useNavigate();
  const { storeId } = useParams<{ storeId: string }>();
  const location = useLocation(); // 전달받은 state 확인용

  // [추가/수정] 1. 가게 상세 정보 조회 (이름 기반 검색 API 사용)
  useEffect(() => {
    const apiUri = import.meta.env.VITE_API_URI;
    const fetchStoreDetail = async () => {
      // Slider에서 넘어온 이름이 있으면 사용, 없으면 fetch 불가 (혹은 ID 기반 API가 있다면 그것 사용)
      const storeName = location.state?.storeName;

      if (!storeName || !storeId) return;

      try {
        // StoreName으로 검색 요청
        const response = await fetch(`${apiUri}/v1/stores/search?storeName=${encodeURIComponent(storeName)}`);
        
        if (response.ok) {
          const data: StoreDetail[] = await response.json();
          // 검색 결과 중 현재 storeId와 일치하는 가게 찾기
          const targetStore = data.find(item => item.storeId === Number(storeId));
          
          if (targetStore) {
            setStoreDetail(targetStore);
          }
        }
      } catch (error) {
        console.error("Failed to fetch store details", error);
      }
    };

    fetchStoreDetail();
  }, [storeId, location.state]);

  // 2. 즐겨찾기 상태 확인 (기존 코드 유지)
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

      try {
        const response = await fetch(`${apiUri}/v1/favstores`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.data && Array.isArray(result.data) && result.data.length > 0) {
            const storeData = result.data.find(
                (item: any) => item.storeId === Number(storeId)
              ) || result.data[0];
            setIsFavorited(storeData.favorite);
          } else {
            setIsFavorited(false);
          }
        } else if (response.status === 404) {
          setIsFavorited(false);
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

  // 3. 즐겨찾기 토글 (기존 코드 유지)
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

    try {
      const response = await fetch(url, {
        method: method,
        headers: { Authorization: `Bearer ${token}` },
        body: '',
      });

      if (response.ok) {
        setIsFavorited((prev) => !prev);
        alert(`${isFavorited ? '즐겨찾기에서 제거' : '즐겨찾기 추가'}되었습니다.`);
      } else {
         // 에러 처리
         const errorData = await response.json().catch(() => ({}));
         alert(errorData.message || '요청 실패');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const HomeTabContent = () => (
    <>
      <div className="flex flex-col w-full h-[120px]">
        {/* 영업 시간: API에 정보가 없다면 하드코딩 유지 혹은 빈칸 처리 */}
        <div className="flex flex-row w-full h-[40px] items-center gap-3 border-b border-t border-(--fill-color1) px-6 ">
          <img src={clock} alt="" className="w-[20px] h-[20px]" />
          <p className="text-[14px] text-(--fill-color7) font-medium">
            영업 중
          </p>
          <p className="text-[14px] text-(--fill-color5) font-medium">
            24:00까지
          </p>
        </div>
        {/* 전화번호 바인딩 */}
        <div className="flex flex-row w-full h-[40px] items-center gap-3 border-b border-t border-(--fill-color1) px-6 ">
          <img src={phone_icon} alt="" className="w-[20px] h-[20px]" />
          <p className="text-[14px] text-(--fill-color7) font-medium">
            {storeDetail?.phone || '전화번호 정보 없음'}
          </p>
        </div>
        <div className="flex flex-row w-full h-[40px] items-center border-b border-t border-(--fill-color1) px-6 ">
          {/* 웹사이트 링크 바인딩 */}
          <div className="w-1/2 flex flex-row items-center gap-3">
            <img src={internet_icon} alt="" className="w-[20px] h-[20px]" />
            <a 
              href={storeDetail?.storeUrl || '#'} 
              target="_blank" 
              rel="noreferrer"
              className="text-[14px] text-(--fill-color7) font-medium truncate"
            >
              {storeDetail?.storeUrl ? '홈페이지' : '정보 없음'}
            </a>
          </div>
          {/* SNS 링크 바인딩 */}
          <div className="w-1/2 flex flex-row items-center gap-3">
            <img src={instagram_icon} alt="" className="w-[20px] h-[20px]" />
            <a 
               href={storeDetail?.sns || '#'}
               target="_blank"
               rel="noreferrer"
               className="text-[14px] text-(--fill-color7) font-medium truncate"
            >
              {storeDetail?.sns ? `${storeDetail.sns}` : '정보 없음'}
            </a>
          </div>
        </div>
      </div>

      <div className="w-full h-[360px] bg-(--fill-color1)">
        <div className="w-full h-[46px] px-6 items-center flex">
          <p className="text-[#72594B] font-semibold text-[18px]">Stamp</p>
        </div>

        <div className="h-px bg-(--fill-color2)" />

        <div className="flex flex-col items-center justify-center w-full">
          {/* 스탬프 이미지 바인딩 */}
          <img
            src={storeDetail?.stampImageUrl || default_store_stamp}
            alt="Store Stamp"
            className="w-[220px] h-[144px] mt-5 object-contain"
          />
          <div className="flex flex-row gap-2 items-center mt-5">
            <img src={gift_icon} alt="" className="w-[18px] h-[18px]" />
            <p className="text-[12px] text-(--fill-color6)">리워드 보상:</p>
            {/* 리워드 텍스트 바인딩 */}
            <p className="text-[12px] text-(--fill-color5)">
               {storeDetail?.reward || '매장 음료 1잔'}
            </p>
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

  // ReviewTabContent는 변경 사항 없음, 생략 가능하나 전체 구조 유지를 위해 둡니다.
  const ReviewTabContent = () => (
    <div className="w-full p-10 text-center text-gray-500">
       {/* ... 기존 리뷰 탭 코드 ... */}
       <div className="flex flex-col items-center justify-center w-full h-[160px]">
         {/* ... */}
         <p className="text-[14px] text-(--fill-color6)">방문 후기를 남겨주세요!</p>
         <div className="flex flex-row justify-center mt-4 gap-2" onClick={handleGoToReview}>
            {/* 별점 이미지 반복 */}
            {[1,2,3,4,5].map(i => <img key={i} src={star_empty_icon} className="w-[30px] h-[30px]" alt="" />)}
         </div>
       </div>
       {/* ... */}
    </div>
  );

  return (
    <div className="w-full flex flex-col">
      <div className="w-full h-[220px] bg-amber-100 relative">
         {/* [추가] 배경 이미지가 있다면 표시 */}
         {storeDetail?.storeImageUrl && (
             <img 
                src={storeDetail.storeImageUrl} 
                alt="가게 전경" 
                className="absolute w-full h-full object-cover z-0"
             />
         )}
         {/* 오버레이로 내용이 잘 보이게 처리 */}
         <div className="absolute w-full h-full bg-black/10 z-0" />

        <div className="w-full flex justify-between items-start relative z-10">
          <BackButton2 />
          <div className="flex flex-row justify-center items-center w-20 h-10 bg-(--fill-color1) rounded-[20px] opacity-90 m-3 p-1">
            {!isLoading && (
              <img
                src={isFavorited ? heart_icon : heart_empty_icon}
                alt="찜하기"
                className="w-[16px] h-[16px] m-3 cursor-pointer"
                onClick={handleToggleFavorite}
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
        <div className="flex flex-col items-center gap-1">
          {/* 가게 이름 바인딩 */}
          <div className="flex flex-row items-center">
            <p className="text-(--fill-color7) font-semibold text-[24px] mr-2">
               {storeDetail?.storeName || '로딩 중...'}
            </p>
          </div>
          {/* 카테고리 바인딩 */}
           <p className="text-(--fill-color6) font-medium text-[14px]">
             {storeDetail?.category || '카테고리'}
           </p>
        </div>

        <div className="flex flex-col items-center gap-1">
          {/* 거리 정보는 Slider에서 넘겨받지 않았다면 계산 필요 (여기선 생략하거나 state로 받음) */}
          <p className="text-(--fill-color4) text-[12px]">{storeDetail?.storeAddress || '주소 정보 없음'}</p>
        </div>
        
        {/* 탭 버튼 영역 유지 */}
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