/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // useLocation은 이제 필요 없을 수도 있습니다
import { BackButton2 } from '../../components/BackButton2';

// 컴포넌트 & 타입 import
import { StoreInfoHome } from './StoreInfoHome';
import { StoreInfoReview } from './StoreInfoReview';
import { type StoreDetail } from '../../type/Store'; // 타입 경로 확인

// 이미지 import
import heart_empty_icon from '../../assets/heart_empty_icon.png';
import heart_icon from '../../assets/heart_icon.png';
import share_icon from '../../assets/share_icon.png';

export const StoreInfo = () => {
  const [selectedTab, setSelectedTab] = useState<'home' | 'review'>('home');
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 가게 상세 정보 State
  const [storeDetail, setStoreDetail] = useState<StoreDetail | null>(null);

  const { storeId } = useParams<{ storeId: string }>();
  const apiUri = import.meta.env.VITE_API_URI;

  // 1. 가게 상세 정보 조회 (위치 기반)
  useEffect(() => {
    if (!storeId) return;

    // 실제 API 호출 함수 (위도, 경도를 인자로 받음)
    const fetchStoreDetail = async (lat: number, lng: number) => {
      const token = localStorage.getItem('accessToken');
      
      try {
        const response = await fetch(
          `${apiUri}/v1/stores/${storeId}?latitude=${lat}&longitude=${lng}`, 
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // reviewAvailable 확인을 위해 토큰이 있다면 같이 보내줍니다.
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        if (response.ok) {
          const data: StoreDetail = await response.json();
          setStoreDetail(data);
        } else {
          console.error('Store Info fetch failed:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch store details', error);
      } finally {
        setIsLoading(false);
      }
    };

    // 2. 위치 정보 가져오기 로직
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 위치 허용 시: 현재 위치 좌표로 API 호출
          const { latitude, longitude } = position.coords;
          fetchStoreDetail(latitude, longitude);
        },
        (error) => {
          console.warn('Location access denied/error:', error);
          // 위치 차단/에러 시: 기본값 (0.0, 0.0)으로 API 호출
          fetchStoreDetail(0.0, 0.0);
        }
      );
    } else {
      // 브라우저가 위치 기능을 지원하지 않을 때
      fetchStoreDetail(0.0, 0.0);
    }
  }, [storeId, apiUri]);

  // 2. 즐겨찾기 상태 확인 (기존 로직 유지)
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!storeId) {
        setIsLoading(false);
        return;
      }
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoading(false); // 로딩 해제는 여기서도 필요할 수 있음
        return;
      }
      try {
        const response = await fetch(`${apiUri}/v1/favstores`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const result = await response.json();
          if (result.data && Array.isArray(result.data)) {
            const storeData = result.data.find((item: any) => item.storeId === Number(storeId));
            setIsFavorited(storeData ? storeData.favorite : false);
          }
        }
      } catch (error) {
        console.error('Error checking favorite:', error);
      }
    };
    checkFavoriteStatus();
  }, [storeId, apiUri]);

  // 즐겨찾기 토글 핸들러
  const handleToggleFavorite = async () => {
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
      });
      if (response.ok) {
        setIsFavorited((prev) => !prev);
        alert(isFavorited ? '즐겨찾기에서 해제되었습니다.' : '즐겨찾기에 추가되었습니다.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-white">
      {/* 상단 이미지 및 헤더 */}
      <div className="w-full h-[220px] bg-amber-100 relative shrink-0">
        {storeDetail?.storeImageUrl && (
          <img src={storeDetail.storeImageUrl} alt="가게 전경" className="absolute w-full h-full object-cover z-0" />
        )}
        <div className="absolute w-full h-full bg-black/10 z-0" />
        <div className="w-full flex justify-between items-start relative z-10 p-4">
          <BackButton2 />
          <div className="flex flex-row justify-center items-center w-20 h-10 bg-[var(--fill-color1)] rounded-[20px] opacity-90 p-1">
            <img
              src={isFavorited ? heart_icon : heart_empty_icon}
              alt="찜하기"
              className="w-[16px] h-[16px] m-3 cursor-pointer"
              onClick={handleToggleFavorite}
            />
            <img src={share_icon} alt="공유하기" className="w-[16px] h-[16px] m-3 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* 가게 정보 요약 및 탭 버튼 */}
      <div className="w-full h-[180px] flex flex-col items-center justify-around px-6 shrink-0">
        <div className="flex flex-col items-center gap-1">
          <p className="text-[var(--fill-color7)] font-semibold text-[24px]">
            {storeDetail?.name || '로딩 중...'}
          </p>
          <p className="text-[var(--fill-color6)] font-medium text-[14px]">
            {storeDetail?.category || '카테고리'}
          </p>
        </div>
        <p className="text-[var(--fill-color4)] text-[12px]">{storeDetail?.address || '주소 정보 없음'}</p>

        <div className="flex flex-row justify-center items-center w-full h-[54px] bg-[var(--fill-color1)] rounded-[50px]">
          <div className="flex w-1/2 justify-center items-center">
            <button
              className={`w-[calc(100%-20px)] transition-all ${
                selectedTab === 'home' ? 'bg-white h-[40px] rounded-[30px] shadow-sm' : 'h-[40px] text-gray-400'
              }`}
              onClick={() => setSelectedTab('home')}
            >
              홈
            </button>
          </div>
          <div className="flex w-1/2 justify-center items-center">
            <button
              className={`w-[calc(100%-20px)] transition-all ${
                selectedTab === 'review' ? 'bg-white h-[40px] rounded-[30px] shadow-sm' : 'h-[40px] text-gray-400'
              }`}
              onClick={() => setSelectedTab('review')}
            >
              리뷰
            </button>
          </div>
        </div>
      </div>

      {/* 탭 내용 */}
      {selectedTab === 'home' ? (
        <StoreInfoHome storeDetail={storeDetail} />
      ) : (
        storeId && (
          <StoreInfoReview 
            storeId={storeId}
            // API 응답의 reviewAvailable 값을 자식 컴포넌트에 전달
            reviewAvailable={storeDetail?.reviewAvailable || false} 
          />
        )
      )}
    </div>
  );
};