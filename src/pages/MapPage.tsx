/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react';
import searchIcon from '../assets/searchIcon.png';
import { UserBottomBar } from '../components/UserBottomBar';
import { StoreSlider, type Store } from '../components/StoreSlider';
import { SearchModal, type SearchApiResponse } from '../components/SearchModal';
import marker_icon from '../assets/marker_icon.png';

// --- [API 응답 타입 정의] ---
interface NearbyStoreResponse {
  storeId: number;
  storeName: string | null;
  storeAddress: string;
  category: string | null;
  phone: string | null;
  stampImageUrl: string | null;
  storeImageUrl: string | null;
  reward: string | null;
  stampReward: string | null;
  sns: string | null;
  storeUrl: string | null;
  distanceMeters: number;
}

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

  // 마커 관리를 위한 Ref (탭 변경 시 기존 마커 삭제용)
  const markersRef = useRef<any[]>([]);
  const overlaysRef = useRef<any[]>([]);

  // 상태 관리
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [sliderStores, setSliderStores] = useState<Store[]>([]);
  const [mode, setMode] = useState<StoreListMode>('nearby');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(true);

  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 37.5665,
    lng: 126.978,
  });

  const apiUri = import.meta.env.VITE_API_URI; // 환경변수 사용

  // --- [1] 유틸 함수: 주소 -> 좌표 변환 ---
  const getCoordsFromAddress = (
    address: string
  ): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!geocoderRef.current || !window.kakao) {
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

  const clearMarkers = () => {
    // 마커 삭제
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 오버레이(텍스트) 삭제
    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];
  };

  // [3] 다중 마커 + 텍스트 그리기
  const drawMarkers = (stores: Store[]) => {
    if (!mapRef.current) return;

    // 기존 마커/오버레이 삭제
    clearMarkers();

    const imageSize = new window.kakao.maps.Size(35, 35);
    const imageOption = { offset: new window.kakao.maps.Point(17.5, 35) }; // 마커의 바닥 중앙이 좌표

    const markerImage = new window.kakao.maps.MarkerImage(
      marker_icon,
      imageSize,
      imageOption
    );

    stores.forEach((store) => {
      const pos = new window.kakao.maps.LatLng(store.lat, store.lng);

      // 1. 마커 생성
      const marker = new window.kakao.maps.Marker({
        position: pos,
        map: mapRef.current,
        title: store.name,
        image: markerImage,
      });

      // 2. 커스텀 오버레이(텍스트) 생성
      // yAnchor: 0 (상단이 좌표에 위치) -> 마커 끝부분 바로 밑에 글씨가 옴
      // xAnchor: 0.5 (가로 중앙 정렬)
      const content = `
        <div class="custom-overlay-label">
          ${store.name}
        </div>
      `;

      const overlay = new window.kakao.maps.CustomOverlay({
        position: pos,
        content: content,
        xAnchor: 0.5,
        yAnchor: 0, // 마커 이미지 높이에 따라 살짝 간격 조절 (음수면 아래로 내려감)
      });

      overlay.setMap(mapRef.current); // 지도에 표시

      // 이벤트 등록
      window.kakao.maps.event.addListener(marker, 'click', () => {
        setSelectedStore(store);
        setIsSliderOpen(true);
        mapRef.current.panTo(pos);
      });

      // Ref에 저장
      markersRef.current.push(marker);
      overlaysRef.current.push(overlay);
    });
  };

  // [4] 단일 검색 결과 업데이트 함수 수정
  const updateMapWithStore = (store: Store) => {
    if (!mapRef.current) return;
    const moveLatLon = new window.kakao.maps.LatLng(store.lat, store.lng);
    mapRef.current.panTo(moveLatLon);

    clearMarkers();

    // 마커 이미지 설정
    const imageSize = new window.kakao.maps.Size(35, 35);
    const imageOption = { offset: new window.kakao.maps.Point(17.5, 35) };
    const markerImage = new window.kakao.maps.MarkerImage(
      marker_icon,
      imageSize,
      imageOption
    );

    // 1. 마커 생성
    const marker = new window.kakao.maps.Marker({
      position: moveLatLon,
      map: mapRef.current,
      title: store.name,
      image: markerImage,
    });

    // 2. 오버레이 생성
    const content = `
      <div class="custom-overlay-label">
        ${store.name}
      </div>
    `;

    const overlay = new window.kakao.maps.CustomOverlay({
      position: moveLatLon,
      content: content,
      xAnchor: 0,
      yAnchor: 0.5,
    });
    overlay.setMap(mapRef.current);

    window.kakao.maps.event.addListener(marker, 'click', () => {
      setSelectedStore(store);
      setIsSliderOpen(true);
      mapRef.current.panTo(moveLatLon);
    });

    markersRef.current.push(marker);
    overlaysRef.current.push(overlay); // 오버레이도 저장

    setSliderStores([store]);
    setSelectedStore(store);
    setIsSliderOpen(true);
  };

  // --- [3] API 호출: 내 주변 가게 조회 ---
  const fetchNearbyStores = async (latitude: number, longitude: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${apiUri}/v1/stores/nearby?latitude=${latitude}&longitude=${longitude}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token || ''}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch nearby stores');

      const data: NearbyStoreResponse[] = await response.json();

      // API 응답에는 lat/lng가 없으므로 주소 변환 병렬 처리
      const mappedStores = await Promise.all(
        data.map(async (item) => {
          const coords = await getCoordsFromAddress(item.storeAddress);
          return {
            id: item.storeId,
            name: item.storeName || '이름 없음', // null 처리
            category: item.category || '기타',
            address: item.storeAddress,
            lat: coords ? coords.lat : 0,
            lng: coords ? coords.lng : 0,
            image: item.storeImageUrl || undefined,
            rating: 0, // 정보 없음
            reviewCount: 0, // 정보 없음
            description: item.reward || item.storeName || '',
            distance: item.distanceMeters,
          } as Store;
        })
      );

      // 좌표 변환에 성공한 매장만 필터링
      const validStores = mappedStores.filter((s) => s.lat !== 0);

      setSliderStores(validStores);

      if (validStores.length > 0) {
        setSliderStores(validStores);
        setSelectedStore(validStores[0]);
        drawMarkers(validStores);
      } else {
        clearMarkers();
        setSliderStores([]);
      }
    } catch (error) {
      console.error('Error fetching nearby stores:', error);
    }
  };

  // --- [4] API 호출: AI 추천 ---
  const fetchAiRecommendations = async () => {
    try {
      const currentUserId = 2; // 실제 유저 ID 필요
      const response = await fetch(`${apiUri}/v1/ai/call`, {
        // 경로 수정
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUserId,
          location: { latitude: center.lat, longitude: center.lng },
          event_stores: [],
          new_stores: [],
          popular_stores: [],
          visit_statics: [],
        }),
      });

      if (!response.ok) throw new Error('AI fetch failed');
      const data = await response.json();

      let allRecommendedStores: any[] = [];
      if (data.recommendations) {
        data.recommendations.forEach((rec: any) => {
          allRecommendedStores = [...allRecommendedStores, ...rec.stores];
        });
      }

      const mappedStores = await Promise.all(
        allRecommendedStores.map(async (item, index) => {
          const coords = await getCoordsFromAddress(item.address);
          return {
            id: index + 1000,
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

      const validStores = mappedStores.filter((s) => s.lat !== 0);
      setSliderStores(validStores);
      if (validStores.length > 0) {
        drawMarkers(validStores);
      } else {
        clearMarkers();
      }
    } catch (error) {
      console.error('AI 추천 실패:', error);
      alert('AI 추천을 불러오는데 실패했습니다.');
    }
  };

  // --- [5] 탭 변경 핸들러 ---
  const updateSliderContent = (newMode: StoreListMode) => {
    setMode(newMode);
    // 모드 변경 시 선택된 가게 초기화
    setSelectedStore(null);

    if (newMode === 'ai') {
      fetchAiRecommendations();
    } else if (newMode === 'nearby') {
      // 현재 중심 좌표 기준으로 다시 검색
      fetchNearbyStores(center.lat, center.lng);
    } else {
      // favorites (미구현)
      setSliderStores([]);
      clearMarkers();
    }
  };

  // --- [6] 검색 모달 결과 처리 ---
  const handleSelectSearchResult = async (searchData: SearchApiResponse) => {
    setIsSearchModalOpen(false);
    const coords = await getCoordsFromAddress(searchData.storeAddress);

    if (!coords) {
      alert('매장의 위치 정보를 찾을 수 없습니다.');
      return;
    }

    const newStore: Store = {
      id: searchData.storeId,
      name: searchData.storeName,
      category: searchData.category,
      address: searchData.storeAddress,
      lat: coords.lat,
      lng: coords.lng,
      image: searchData.storeImageUrl || undefined,
      rating: 0,
      reviewCount: 0,
      description: searchData.reward || '이벤트 정보 없음',
      distance: 0,
    };

    // 검색 결과는 모드와 상관없이 지도에 표시
    updateMapWithStore(newStore);
  };

  // --- [7] 초기화 (지도 로드 -> 내 위치 -> 내 주변 API 호출) ---
  useEffect(() => {
    const initializeMap = (initialPosition: { lat: number; lng: number }) => {
      if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
        window.kakao.maps.load(() => {
          const container = document.getElementById('map');
          if (container && mapRef.current === null) {
            const mapCenter = new window.kakao.maps.LatLng(
              initialPosition.lat,
              initialPosition.lng
            );
            const options = { center: mapCenter, level: 3 };
            const kakaoMap = new window.kakao.maps.Map(container, options);

            mapRef.current = kakaoMap;
            geocoderRef.current = new window.kakao.maps.services.Geocoder();

            window.kakao.maps.event.addListener(kakaoMap, 'click', () => {
              setIsSliderOpen((prev) => !prev);
            });

            // 내 주변 가게 불러오기
            fetchNearbyStores(initialPosition.lat, initialPosition.lng);
          }
        });
      }
    };

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        initializeMap({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        console.warn('Geolocation Error:', err);
        const defaultPos = { lat: 37.5665, lng: 126.978 }; // 서울시청
        initializeMap(defaultPos);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <div className="w-full h-screen flex flex-col justify-center relative overflow-hidden bg-white">
      <style>{`
        .custom-overlay-label {
          font-size: 12px;
          font-weight: 600;
          color: #black;
          white-space: nowrap; /* 줄바꿈 방지 */
        }
      `}</style>

      {/* Title */}
      <div className="mx-5 my-2 text-[25px] font-semibold flex justify-start items-start">
        Map
      </div>

      {/* 가짜 검색창 */}
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
      <div className="absolute top-[120px] left-3 rounded-[50px] justify-center px-3 py-2 z-10 gap-2 bg-white flex shadow-sm">
        <RadioTab
          label="내 주변"
          value="nearby"
          currentValue={mode}
          onClick={() => updateSliderContent('nearby')}
        />
        <RadioTab
          label="AI 추천"
          value="ai"
          currentValue={mode}
          onClick={() => updateSliderContent('ai')}
        />
        <RadioTab
          label="즐겨찾기"
          value="favorites"
          currentValue={mode}
          onClick={() => updateSliderContent('favorites')}
        />
      </div>

      {/* 지도 영역 */}
      <div className="flex-grow w-full mt-3 relative">
        <div id="map" className="w-full h-full z-0"></div>
      </div>

      {/* 슬라이더 */}
      <StoreSlider
        stores={sliderStores}
        selectedStore={selectedStore}
        isOpen={isSliderOpen} // [추가]
        onStoreSelect={(store) => {
          setSelectedStore(store);
          setIsSliderOpen(true); // 슬라이더 내 카드 클릭 시 확실히 열림 상태 유지
          if (mapRef.current) {
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
