/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react';
import searchIcon from '../assets/searchIcon.png'; // 경로 확인 필요
import { UserBottomBar } from '../components/UserBottomBar';
import { StoreSlider, type Store } from '../components/StoreSlider';
import { SearchModal, type SearchApiResponse } from '../components/SearchModal'; // 위에서 만든 모달 import

// --- 헬퍼 컴포넌트: 필터 탭 ---
type StoreListMode = 'nearby' | 'ai' | 'favorites';

const RadioTab: React.FC<{
  label: string;
  value: StoreListMode;
  currentValue: StoreListMode;
  onClick: () => void;
}> = ({ label, value, currentValue, onClick }) => {
  const isSelected = value === currentValue;
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
      ${
        isSelected
          ? 'bg-white text-black border border-black'
          : 'bg-white text-black hover:bg-gray-300'
      }`}
    >
      {label}
    </button>
  );
};

// --- MapPage 본문 ---
export const MapPage: React.FC = () => {
  const mapRef = useRef<any | null>(null);
  const geocoderRef = useRef<any | null>(null);

  // 상태 관리
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [sliderStores, setSliderStores] = useState<Store[]>([]);
  const [mode, setMode] = useState<StoreListMode>('nearby');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false); // 모달 Open 상태
  
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 37.5665,
    lng: 126.978,
  });

  // --- [1] 유틸 함수: 주소 -> 좌표 변환 ---
  const getCoordsFromAddress = (address: string): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!geocoderRef.current) {
        resolve(null);
        return;
      }
      geocoderRef.current.addressSearch(address, (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          resolve({ lat: Number(result[0].y), lng: Number(result[0].x) });
        } else {
          resolve(null);
        }
      });
    });
  };

  // --- [2] 검색 모달 결과 처리 ---
  const handleSelectSearchResult = async (searchData: SearchApiResponse) => {
    // 1. 모달 닫기
    setIsSearchModalOpen(false);

    // 2. 좌표 변환
    const coords = await getCoordsFromAddress(searchData.storeAddress);

    if (!coords) {
      alert('매장의 위치 정보를 찾을 수 없습니다.');
      return;
    }

    // 3. Store 객체 생성 (Slider 호환용)
    const newStore: Store = {
      id: searchData.storeId,
      name: searchData.storeName,
      category: searchData.category,
      address: searchData.storeAddress,
      lat: coords.lat,
      lng: coords.lng,
      image: searchData.storeImageUrl || undefined,
      rating: 0, // API 정보 없음 -> 0 처리
      reviewCount: 0,
      description: searchData.reward || '진행중인 이벤트 정보 없음',
      distance: 0,
    };

    // 4. 지도 이동 및 마커 표시
    updateMapWithStore(newStore);
  };

  // --- [3] AI 추천 API 호출 ---
  const fetchAiRecommendations = async () => {
    try {
      // 실제 유저 ID 사용 필요 (현재 하드코딩: 2)
      const currentUserId = 2; 
      const response = await fetch('/api/v1/ai/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUserId,
          location: { latitude: center.lat, longitude: center.lng },
          event_stores: [], new_stores: [], popular_stores: [], visit_statics: []
        }),
      });

      if (!response.ok) throw new Error('AI fetch failed');
      const data = await response.json();

      // 응답 데이터 평탄화 (Flatten)
      let allRecommendedStores: any[] = [];
      data.recommendations.forEach((rec: any) => {
        allRecommendedStores = [...allRecommendedStores, ...rec.stores];
      });

      // 주소 -> 좌표 변환 (비동기 병렬)
      const mappedStores = await Promise.all(
        allRecommendedStores.map(async (item, index) => {
          const coords = await getCoordsFromAddress(item.address);
          return {
            id: index + 1000, // 임시 ID
            name: item.name,
            category: 'AI 추천',
            address: item.address,
            lat: coords ? coords.lat : 0,
            lng: coords ? coords.lng : 0,
            image: undefined,
            rating: 4.5,
            reviewCount: 10,
            description: 'AI가 추천하는 장소입니다.',
          } as Store;
        })
      );

      // 좌표 유효한 매장만 필터링
      const validStores = mappedStores.filter(s => s.lat !== 0);
      
      setSliderStores(validStores);
      if(validStores.length > 0) {
          setSelectedStore(validStores[0]);
          drawMarkers(validStores); // 지도에 마커 찍기
      }

    } catch (error) {
      console.error('AI 추천 실패:', error);
      alert('AI 추천을 불러오는데 실패했습니다.');
    }
  };

  // --- [4] 맵 관련 로직 ---
  
  // 단일 매장으로 지도 업데이트 (검색 시)
  const updateMapWithStore = (store: Store) => {
    if (!mapRef.current) return;
    const moveLatLon = new window.kakao.maps.LatLng(store.lat, store.lng);
    mapRef.current.panTo(moveLatLon);

    // 단일 마커 표시
    // (기존 마커 제거 로직이 필요하다면 markerManager 등 도입 필요. 여기선 새로 생성만 함)
    const marker = new window.kakao.maps.Marker({
      position: moveLatLon,
      map: mapRef.current,
      title: store.name,
    });

    window.kakao.maps.event.addListener(marker, 'click', () => {
      setSelectedStore(store);
      mapRef.current.panTo(moveLatLon);
    });

    // 슬라이더 업데이트
    setSliderStores([store]);
    setSelectedStore(store);
  };

  // 다중 마커 그리기 (AI 추천 등)
  const drawMarkers = (stores: Store[]) => {
    if (!mapRef.current) return;
    // 실제로는 여기서 기존 마커 setMap(null) 처리 필요
    stores.forEach((store) => {
      const pos = new window.kakao.maps.LatLng(store.lat, store.lng);
      const marker = new window.kakao.maps.Marker({
        position: pos,
        map: mapRef.current,
        title: store.name,
      });
      window.kakao.maps.event.addListener(marker, 'click', () => {
        setSelectedStore(store);
        mapRef.current.panTo(pos);
      });
    });
  };

  const updateSliderContent = (newMode: StoreListMode) => {
    setMode(newMode);
    if (newMode === 'ai') {
      fetchAiRecommendations();
    } else {
      // nearby, favorites는 API 미구현 상태이므로 빈 배열 처리 (필요 시 구현)
      setSliderStores([]);
      setSelectedStore(null);
    }
  };

  // --- [5] 초기화 ---
  useEffect(() => {
    const initializeMap = (initialPosition: { lat: number; lng: number }) => {
      if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
        window.kakao.maps.load(() => {
          const container = document.getElementById('map');
          if (container && mapRef.current === null) {
            const mapCenter = new window.kakao.maps.LatLng(initialPosition.lat, initialPosition.lng);
            const options = { center: mapCenter, level: 3 };
            const kakaoMap = new window.kakao.maps.Map(container, options);
            
            mapRef.current = kakaoMap;
            geocoderRef.current = new window.kakao.maps.services.Geocoder();
            setCenter(initialPosition);
          }
        });
      }
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => initializeMap({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        console.warn('Geolocation Error:', err);
        initializeMap({ lat: 37.5665, lng: 126.978 }); // 기본값 (서울시청)
      },
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <div className="w-full h-screen flex flex-col justify-center relative overflow-hidden bg-white">
      {/* Title */}
      <div className="mx-5 my-2 text-[25px] font-semibold flex justify-start items-start">
        Map
      </div>

      {/* 가짜 검색창 (클릭 시 모달 오픈) */}
      <div 
        className="w-full justify-center flex flex-row h-11 px-3 gap-3 z-10"
        onClick={() => setIsSearchModalOpen(true)}
      >
        <div className="flex-1 rounded-[10px] h-full bg-gray-100 flex items-center px-4 cursor-pointer">
           <span className="text-gray-400 text-sm">지역, 건물, 주소 검색</span>
        </div>
        <button className="w-11 h-full flex items-center justify-center rounded-[10px] bg-gray-100 cursor-pointer">
          <img src={searchIcon} alt="search" />
        </button>
      </div>

      {/* 필터 탭 */}
      <div className="absolute top-[120px] left-3 rounded-[50px] justify-center px-3 py-2 z-10 gap-2 bg-white ">
        <RadioTab label="내 주변" value="nearby" currentValue={mode} onClick={() => updateSliderContent('nearby')} />
        <RadioTab label="AI 추천" value="ai" currentValue={mode} onClick={() => updateSliderContent('ai')} />
        <RadioTab label="즐겨찾기" value="favorites" currentValue={mode} onClick={() => updateSliderContent('favorites')} />
      </div>

      {/* 지도 영역 */}
      <div className="flex-grow w-full mt-3">
        <div id="map" className="w-full h-full z-0"></div>
      </div>

      {/* 슬라이더 */}
      <StoreSlider
        stores={sliderStores}
        selectedStore={selectedStore}
        onStoreSelect={(store) => {
          setSelectedStore(store);
          if(mapRef.current) {
             const pos = new window.kakao.maps.LatLng(store.lat, store.lng);
             mapRef.current.panTo(pos);
          }
        }}
      />

      <UserBottomBar />

      {/* 검색 모달 */}
      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectStore={handleSelectSearchResult}
      />
    </div>
  );
};