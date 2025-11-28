/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react';
import searchIcon from '../assets/searchIcon.png'; // 경로 및 확장자 확인 필요 (png/svg)
import marker_icon from '../assets/marker_icon.png';
import { UserBottomBar } from '../components/UserBottomBar';
import { StoreSlider, type Store } from '../components/StoreSlider';
import { SearchModal, type SearchApiResponse } from '../components/SearchModal';
import { FavoriteBottomSheet } from '../components/FavoriteBottomSheet';
import { AiRecommendationSheet } from '../components/AiRecommendationSheet';

// --- [API 응답 타입 정의] ---
interface StoreApiResponse {
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
  distanceMeters: number | null;
  favorite?: boolean;
}

// --- 필터 탭 ---
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
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border shadow-sm
      ${
        isSelected
          ? 'bg-black text-white border-black'
          : 'bg-white text-black border-gray-200 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );
};

// --- 거리 계산 함수 ---
const getDistanceFromLatLonInMeters = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.floor(d * 1000);
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

// --- MapPage 본문 ---
export const MapPage: React.FC = () => {
  const mapRef = useRef<any | null>(null);
  const geocoderRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
  const overlaysRef = useRef<any[]>([]);

  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [sliderStores, setSliderStores] = useState<Store[]>([]);
  const [mode, setMode] = useState<StoreListMode>('nearby');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(true);

  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 37.5665,
    lng: 126.978,
  });

  const apiUri = import.meta.env.VITE_API_URI;

  // --- 유틸 함수 ---
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
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];
  };

  // --- 마커 그리기 ---
  const drawMarkers = (stores: Store[]) => {
    if (!mapRef.current) return;

    clearMarkers();

    const imageSize = new window.kakao.maps.Size(35, 35);
    const imageOption = { offset: new window.kakao.maps.Point(17.5, 35) };
    const markerImage = new window.kakao.maps.MarkerImage(
      marker_icon,
      imageSize,
      imageOption
    );

    stores.forEach((store) => {
      const pos = new window.kakao.maps.LatLng(store.lat, store.lng);

      const marker = new window.kakao.maps.Marker({
        position: pos,
        map: mapRef.current,
        title: store.name,
        image: markerImage,
      });

      const content = `
        <div class="custom-overlay-label" style="padding:2px 5px; background:white; border:1px solid #ccc; border-radius:4px; font-size:11px;">
          ${store.name}
        </div>
      `;

      const overlay = new window.kakao.maps.CustomOverlay({
        position: pos,
        content: content,
        xAnchor: 0.5,
        yAnchor: 2.2,
      });

      overlay.setMap(mapRef.current);

      window.kakao.maps.event.addListener(marker, 'click', () => {
        setSelectedStore(store);
        setIsSliderOpen(true); // 마커 클릭 시 슬라이더 열기
        mapRef.current.panTo(pos);
      });

      markersRef.current.push(marker);
      overlaysRef.current.push(overlay);
    });
  };

  // --- 단일 검색 결과 업데이트 ---
  const updateMapWithStore = (store: Store) => {
    if (!mapRef.current) return;
    const moveLatLon = new window.kakao.maps.LatLng(store.lat, store.lng);
    mapRef.current.panTo(moveLatLon);

    clearMarkers();

    const imageSize = new window.kakao.maps.Size(35, 35);
    const imageOption = { offset: new window.kakao.maps.Point(17.5, 35) };
    const markerImage = new window.kakao.maps.MarkerImage(
      marker_icon,
      imageSize,
      imageOption
    );

    const marker = new window.kakao.maps.Marker({
      position: moveLatLon,
      map: mapRef.current,
      title: store.name,
      image: markerImage,
    });

    const content = `
      <div class="custom-overlay-label" style="padding:2px 5px; background:white; border:1px solid #ccc; border-radius:4px; font-size:11px;">
        ${store.name}
      </div>
    `;

    const overlay = new window.kakao.maps.CustomOverlay({
      position: moveLatLon,
      content: content,
      xAnchor: 0.5,
      yAnchor: 2.2,
    });
    overlay.setMap(mapRef.current);

    window.kakao.maps.event.addListener(marker, 'click', () => {
      setSelectedStore(store);
      setIsSliderOpen(true);
      mapRef.current.panTo(moveLatLon);
    });

    markersRef.current.push(marker);
    overlaysRef.current.push(overlay);

    setSliderStores([store]);
    setSelectedStore(store);
    setIsSliderOpen(true);
  };

  // --- API 호출: 모든 가게 불러오기 (내 주변) ---
  const fetchAllStores = async (currentLat: number, currentLng: number) => {
    try {
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${apiUri}/v1/stores`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch stores');

      const jsonResponse = await response.json();
      const storeList: StoreApiResponse[] = jsonResponse.data;

      const mappedStores = await Promise.all(
        storeList.map(async (item) => {
          if (!item.storeName) return null;

          const coords = await getCoordsFromAddress(item.storeAddress);
          const storeLat = coords ? coords.lat : 0;
          const storeLng = coords ? coords.lng : 0;

          let dist = item.distanceMeters;
          if (dist === null && storeLat !== 0 && storeLng !== 0) {
            dist = getDistanceFromLatLonInMeters(
              currentLat,
              currentLng,
              storeLat,
              storeLng
            );
          }

          return {
            id: item.storeId,
            name: item.storeName || '이름 없음',
            category: item.category || '기타',
            address: item.storeAddress,
            lat: storeLat,
            lng: storeLng,
            image: item.storeImageUrl || undefined,
            rating: 0,
            reviewCount: 0,
            description: item.reward || '이벤트 정보 없음',
            distance: dist || 0,
          } as Store;
        })
      );

      const validStores = mappedStores.filter(
        (s: any): s is Store => s !== null && s.lat !== 0
      );

      // 거리순 정렬
      validStores.sort(
        (a: any, b: any) => (a.distance || 0) - (b.distance || 0)
      );

      setSliderStores(validStores);

      if (validStores.length > 0) {
        drawMarkers(validStores);
      } else {
        clearMarkers();
        setSliderStores([]);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  // --- 즐겨찾기 목록 API 호출 ---
  const fetchFavorites = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
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

      if (!response.ok) {
        if (response.status === 404) {
          setSliderStores([]);
          clearMarkers();
          return;
        }
        throw new Error('Failed to fetch favorites');
      }

      const result = await response.json();
      const favList: any[] = Array.isArray(result.data) ? result.data : [];

      const mappedStores = await Promise.all(
        favList.map(async (item) => {
          const address = item.storeAddress || item.address || '';
          const name = item.storeName || item.name || '이름 없음';

          const coords = await getCoordsFromAddress(address);
          const storeLat = coords ? coords.lat : 0;
          const storeLng = coords ? coords.lng : 0;

          const dist = 0; // 즐겨찾기는 거리 계산 생략 가능

          return {
            id: item.storeId,
            name: name,
            category: item.category || '기타',
            address: address,
            lat: storeLat,
            lng: storeLng,
            image: item.storeImageUrl,
            rating: 0,
            reviewCount: 0,
            description: '즐겨찾는 매장',
            distance: dist,
          } as Store;
        })
      );

      const validStores = mappedStores.filter((s: any) => s.lat !== 0);

      setSliderStores(validStores);

      if (validStores.length > 0) {
        drawMarkers(validStores);
        // 목록 첫 번째 가게로 이동
        if (mapRef.current) {
          const moveLatLon = new window.kakao.maps.LatLng(
            validStores[0].lat,
            validStores[0].lng
          );
          mapRef.current.panTo(moveLatLon);
        }
      } else {
        clearMarkers();
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setSliderStores([]);
    }
  };

  // --- 즐겨찾기 삭제 처리 ---
  const handleDeleteFavorite = async (storeId: number) => {
    if (!confirm('정말 즐겨찾기를 해제하시겠습니까?')) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인 정보가 없습니다.');
      return;
    }

    try {
      const response = await fetch(`${apiUri}/v1/favstores/${storeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedStores = sliderStores.filter(
          (store) => store.id !== storeId
        );
        setSliderStores(updatedStores);
        drawMarkers(updatedStores);

        if (selectedStore?.id === storeId) {
          setSelectedStore(null);
        }
        alert('즐겨찾기가 해제되었습니다.');
      } else {
        throw new Error('삭제 실패');
      }
    } catch (error) {
      console.error('즐겨찾기 삭제 중 오류:', error);
      alert('삭제 처리에 실패했습니다.');
    }
  };

  const updateSliderContent = (newMode: StoreListMode) => {
    setMode(newMode);
    setSelectedStore(null); // 기존 선택된 가게 해제
    setIsSliderOpen(true); // 시트는 열어둠 (AI 시트를 보여주기 위함)

    if (newMode === 'ai') {
      // [수정] AI 모드: 지도 마커 제거 + 슬라이더 데이터 초기화
      // 지도는 이동하지 않고, 마커도 찍지 않음 (완전 격리)
      clearMarkers();
      setSliderStores([]);
    } else if (newMode === 'nearby') {
      // 내 주변: 마커 찍고 리스트 채움
      fetchAllStores(center.lat, center.lng);
    } else if (newMode === 'favorites') {
      // 즐겨찾기: 마커 찍고 리스트 채움
      fetchFavorites();
    }
  };

  // --- 검색 결과 처리 ---
  const handleSelectSearchResult = async (searchData: SearchApiResponse) => {
    setIsSearchModalOpen(false);
    const coords = await getCoordsFromAddress(searchData.storeAddress);

    if (!coords) {
      alert('매장의 위치 정보를 찾을 수 없습니다.');
      return;
    }

    const dist = getDistanceFromLatLonInMeters(
      center.lat,
      center.lng,
      coords.lat,
      coords.lng
    );

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
      distance: dist,
    };

    updateMapWithStore(newStore);
  };

  // --- 초기화 ---
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
            const options = { center: mapCenter, level: 4 };
            const kakaoMap = new window.kakao.maps.Map(container, options);

            mapRef.current = kakaoMap;
            geocoderRef.current = new window.kakao.maps.services.Geocoder();

            window.kakao.maps.event.addListener(kakaoMap, 'click', () => {
              // 지도 클릭 시 슬라이더 토글 (AI 모드 아닐 때만)
              if (mode !== 'ai') {
                setIsSliderOpen((prev) => !prev);
              }
            });

            // 초기 로딩 시 주변 매장 로드
            fetchAllStores(initialPosition.lat, initialPosition.lng);
          }
        });
      }
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const currentPos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCenter(currentPos);
        initializeMap(currentPos);
      },
      (err) => {
        console.warn('Geolocation Error:', err);
        const defaultPos = { lat: 37.5665, lng: 126.978 };
        setCenter(defaultPos);
        initializeMap(defaultPos);
      },
      { enableHighAccuracy: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- 렌더링 ---
  // 하단 컨텐츠(슬라이더) 결정 로직
  const renderBottomContent = () => {
    if (!isSliderOpen) return null;

    switch (mode) {
      case 'ai':
        // [수정] AI 시트에는 지도 조작 함수를 전혀 전달하지 않음
        return <AiRecommendationSheet />;
      case 'favorites':
        return (
          <FavoriteBottomSheet
            stores={sliderStores}
            onStoreClick={(store: Store) => {
              if (mapRef.current) {
                const moveLatLon = new window.kakao.maps.LatLng(
                  store.lat,
                  store.lng
                );
                mapRef.current.panTo(moveLatLon);
              }
            }}
            onDeleteRequest={handleDeleteFavorite}
          />
        );
      case 'nearby':
      default:
        return (
          <StoreSlider
            stores={sliderStores}
            selectedStore={selectedStore}
            isOpen={isSliderOpen}
            onStoreSelect={(store: Store) => {
              setSelectedStore(store);
              setIsSliderOpen(true);
              if (mapRef.current) {
                const pos = new window.kakao.maps.LatLng(store.lat, store.lng);
                mapRef.current.panTo(pos);
              }
            }}
          />
        );
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center relative overflow-hidden bg-white">
      <style>{`
        .custom-overlay-label {
          font-size: 12px;
          font-weight: 600;
          color: #black;
          white-space: nowrap; 
        }
      `}</style>

      {/* Title */}
      <div className="mx-5 my-2 text-[25px] font-semibold flex justify-start items-start">
        Map
      </div>

      {/* 검색창 */}
      <div
        className="w-full justify-center flex flex-row h-11 px-3 gap-3 z-10"
        onClick={() => setIsSearchModalOpen(true)}
      >
        <div className="flex-1 rounded-[10px] h-full bg-gray-100 flex items-center px-4 cursor-pointer">
          <span className="text-gray-400 text-sm">지역, 건물, 주소 검색</span>
        </div>
        <button className="w-11 h-full flex items-center justify-center rounded-[10px] bg-[#FF6B00] cursor-pointer">
          <img
            src={searchIcon}
            alt="search"
            className="w-5 h-5 brightness-0 invert"
          />
        </button>
      </div>

      {/* 필터 탭 */}
      <div className="absolute top-[120px] left-3 z-10 flex gap-2">
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

      {/* 하단 바텀 시트 (모드에 따라 변경됨) */}
      {renderBottomContent()}

      <UserBottomBar />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectStore={handleSelectSearchResult}
      />
    </div>
  );
};

//해당 페이지가 실제 페이지입니다. 절대 지우지 마세요.
// import React, { useEffect, useState, useRef } from 'react';
// import searchIcon from '../assets/searchIcon.png';
// import { UserBottomBar } from '../components/UserBottomBar';
// import { StoreSlider, type Store } from '../components/StoreSlider';
// import { SearchModal, type SearchApiResponse } from '../components/SearchModal';
// import marker_icon from '../assets/marker_icon.png';
// import { FavoriteBottomSheet } from '../components/FavoriteBottomSheet';

// // --- [API 응답 타입 정의] ---
// interface StoreApiResponse {
//   storeId: number;
//   storeName: string | null;
//   storeAddress: string;
//   category: string | null;
//   phone: string | null;
//   stampImageUrl: string | null;
//   storeImageUrl: string | null;
//   reward: string | null;
//   stampReward: string | null;
//   sns: string | null;
//   storeUrl: string | null;
//   distanceMeters: number | null;
//   favorite?: boolean;
// }

// // --- 필터 탭 ---
// type StoreListMode = 'nearby' | 'ai' | 'favorites';

// const RadioTab: React.FC<{
//   label: string;
//   value: StoreListMode;
//   currentValue: StoreListMode;
//   onClick: () => void;
// }> = ({ label, value, currentValue, onClick }) => {
//   const isSelected = value === currentValue;
//   return (
//     <button
//       onClick={onClick}
//       className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
//       ${
//         isSelected
//           ? 'bg-white text-black border border-black'
//           : 'bg-white text-black hover:bg-gray-300'
//       }`}
//     >
//       {label}
//     </button>
//   );
// };

// // --- 거리 계산 함수 ---
// const getDistanceFromLatLonInMeters = (
//   lat1: number,
//   lon1: number,
//   lat2: number,
//   lon2: number
// ) => {
//   const R = 6371;
//   const dLat = deg2rad(lat2 - lat1);
//   const dLon = deg2rad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(deg2rad(lat1)) *
//       Math.cos(deg2rad(lat2)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const d = R * c;
//   return Math.floor(d * 1000);
// };

// const deg2rad = (deg: number) => {
//   return deg * (Math.PI / 180);
// };

// // --- MapPage 본문 ---
// export const MapPage: React.FC = () => {
//   const mapRef = useRef<any | null>(null);
//   const geocoderRef = useRef<any | null>(null);
//   const markersRef = useRef<any[]>([]);
//   const overlaysRef = useRef<any[]>([]);

//   const [selectedStore, setSelectedStore] = useState<Store | null>(null);
//   const [sliderStores, setSliderStores] = useState<Store[]>([]);
//   const [mode, setMode] = useState<'nearby' | 'ai' | 'favorites'>('nearby');
//   const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
//   const [isSliderOpen, setIsSliderOpen] = useState(true);

//   const [center, setCenter] = useState<{ lat: number; lng: number }>({
//     lat: 37.5665,
//     lng: 126.978,
//   });

//   const apiUri = import.meta.env.VITE_API_URI;

//   // --- 유틸 함수 ---
//   const getCoordsFromAddress = (
//     address: string
//   ): Promise<{ lat: number; lng: number } | null> => {
//     return new Promise((resolve) => {
//       if (!geocoderRef.current || !window.kakao) {
//         resolve(null);
//         return;
//       }
//       geocoderRef.current.addressSearch(address, (result: any, status: any) => {
//         if (status === window.kakao.maps.services.Status.OK) {
//           resolve({ lat: Number(result[0].y), lng: Number(result[0].x) });
//         } else {
//           resolve(null);
//         }
//       });
//     });
//   };

//   const clearMarkers = () => {
//     markersRef.current.forEach((marker) => marker.setMap(null));
//     markersRef.current = [];
//     overlaysRef.current.forEach((overlay) => overlay.setMap(null));
//     overlaysRef.current = [];
//   };

//   // --- 마커 그리기 ---
//   const drawMarkers = (stores: Store[]) => {
//     if (!mapRef.current) return;

//     clearMarkers();

//     const imageSize = new window.kakao.maps.Size(35, 35);
//     const imageOption = { offset: new window.kakao.maps.Point(17.5, 35) };
//     const markerImage = new window.kakao.maps.MarkerImage(
//       marker_icon,
//       imageSize,
//       imageOption
//     );

//     stores.forEach((store) => {
//       const pos = new window.kakao.maps.LatLng(store.lat, store.lng);

//       const marker = new window.kakao.maps.Marker({
//         position: pos,
//         map: mapRef.current,
//         title: store.name,
//         image: markerImage,
//       });

//       const content = `
//         <div class="custom-overlay-label" style="padding:2px 5px; background:white; border:1px solid #ccc; border-radius:4px; font-size:11px;">
//           ${store.name}
//         </div>
//       `;

//       const overlay = new window.kakao.maps.CustomOverlay({
//         position: pos,
//         content: content,
//         xAnchor: 0.5,
//         yAnchor: 2.2,
//       });

//       overlay.setMap(mapRef.current);

//       window.kakao.maps.event.addListener(marker, 'click', () => {
//         setSelectedStore(store);
//         setIsSliderOpen(true); // 마커 클릭 시 슬라이더 열기
//         mapRef.current.panTo(pos);
//       });

//       markersRef.current.push(marker);
//       overlaysRef.current.push(overlay);
//     });
//   };

//   // --- 단일 검색 결과 업데이트 ---
//   const updateMapWithStore = (store: Store) => {
//     if (!mapRef.current) return;
//     const moveLatLon = new window.kakao.maps.LatLng(store.lat, store.lng);
//     mapRef.current.panTo(moveLatLon);

//     clearMarkers();

//     const imageSize = new window.kakao.maps.Size(35, 35);
//     const imageOption = { offset: new window.kakao.maps.Point(17.5, 35) };
//     const markerImage = new window.kakao.maps.MarkerImage(
//       marker_icon,
//       imageSize,
//       imageOption
//     );

//     const marker = new window.kakao.maps.Marker({
//       position: moveLatLon,
//       map: mapRef.current,
//       title: store.name,
//       image: markerImage,
//     });

//     const content = `
//       <div class="custom-overlay-label" style="padding:2px 5px; background:white; border:1px solid #ccc; border-radius:4px; font-size:11px;">
//         ${store.name}
//       </div>
//     `;

//     const overlay = new window.kakao.maps.CustomOverlay({
//       position: moveLatLon,
//       content: content,
//       xAnchor: 0.5,
//       yAnchor: 2.2,
//     });
//     overlay.setMap(mapRef.current);

//     window.kakao.maps.event.addListener(marker, 'click', () => {
//       setSelectedStore(store);
//       setIsSliderOpen(true);
//       mapRef.current.panTo(moveLatLon);
//     });

//     markersRef.current.push(marker);
//     overlaysRef.current.push(overlay);

//     setSliderStores([store]);
//     setSelectedStore(store);
//     setIsSliderOpen(true);
//   };

//   // --- API 호출: 모든 가게 불러오기 ---
//   const fetchAllStores = async (currentLat: number, currentLng: number) => {
//     try {
//       const token = localStorage.getItem('accessToken');

//       const response = await fetch(`${apiUri}/v1/stores`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token || ''}`,
//         },
//       });

//       if (!response.ok) throw new Error('Failed to fetch stores');

//       const jsonResponse = await response.json();
//       const storeList: StoreApiResponse[] = jsonResponse.data;

//       const mappedStores = await Promise.all(
//         storeList.map(async (item) => {
//           if (!item.storeName) return null;

//           const coords = await getCoordsFromAddress(item.storeAddress);
//           const storeLat = coords ? coords.lat : 0;
//           const storeLng = coords ? coords.lng : 0;

//           let dist = item.distanceMeters;
//           if (dist === null && storeLat !== 0 && storeLng !== 0) {
//             dist = getDistanceFromLatLonInMeters(
//               currentLat,
//               currentLng,
//               storeLat,
//               storeLng
//             );
//           }

//           return {
//             id: item.storeId,
//             name: item.storeName || '이름 없음',
//             category: item.category || '기타',
//             address: item.storeAddress,
//             lat: storeLat,
//             lng: storeLng,
//             image: item.storeImageUrl || undefined,
//             rating: 0,
//             reviewCount: 0,
//             description: item.reward || '이벤트 정보 없음',
//             distance: dist || 0,
//           } as Store;
//         })
//       );

//       const validStores = mappedStores.filter(
//         (s): s is Store => s !== null && s.lat !== 0
//       );

//       // 거리순 정렬 (undefined 방지 코드 추가 완료)
//       validStores.sort((a, b) => (a.distance || 0) - (b.distance || 0));

//       setSliderStores(validStores);

//       if (validStores.length > 0) {
//         drawMarkers(validStores);
//       } else {
//         clearMarkers();
//         setSliderStores([]);
//       }
//     } catch (error) {
//       console.error('Error fetching stores:', error);
//     }
//   };

//   // --- API 호출: AI 추천 ---
//   const fetchAiRecommendations = async () => {
//     try {
//       const currentUserId = 2;
//       const response = await fetch(`${apiUri}/v1/ai/call`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           user_id: currentUserId,
//           location: { latitude: center.lat, longitude: center.lng },
//           event_stores: [],
//           new_stores: [],
//           popular_stores: [],
//           visit_statics: [],
//         }),
//       });

//       if (!response.ok) throw new Error('AI fetch failed');
//       const data = await response.json();

//       let allRecommendedStores: any[] = [];
//       if (data.recommendations) {
//         data.recommendations.forEach((rec: any) => {
//           allRecommendedStores = [...allRecommendedStores, ...rec.stores];
//         });
//       }

//       const mappedStores = await Promise.all(
//         allRecommendedStores.map(async (item, index) => {
//           const coords = await getCoordsFromAddress(item.address);
//           return {
//             id: index + 1000,
//             name: item.name,
//             category: 'AI 추천',
//             address: item.address,
//             lat: coords ? coords.lat : 0,
//             lng: coords ? coords.lng : 0,
//             image: undefined,
//             rating: 4.5,
//             reviewCount: 10,
//             description: 'AI가 추천하는 장소입니다.',
//             distance: 0,
//           } as Store;
//         })
//       );

//       const validStores = mappedStores.filter((s) => s.lat !== 0);
//       setSliderStores(validStores);
//       if (validStores.length > 0) {
//         drawMarkers(validStores);
//       } else {
//         clearMarkers();
//       }
//     } catch (error) {
//       console.error('AI 추천 실패:', error);
//       alert('AI 추천을 불러오는데 실패했습니다.');
//     }
//   };

//   // --- 즐겨찾기 목록 API 호출 ---
//   const fetchFavorites = async () => {
//     const token = localStorage.getItem('accessToken');
//     if (!token) {
//       alert('로그인이 필요한 서비스입니다.');
//       return;
//     }

//     try {
//       // 1. GET 요청
//       const response = await fetch(`${apiUri}/v1/favstores`, {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//         },
//       });

//       if (!response.ok) {
//         if (response.status === 404) {
//           // 즐겨찾기 데이터가 없는 경우
//           setSliderStores([]);
//           clearMarkers();
//           return;
//         }
//         throw new Error('Failed to fetch favorites');
//       }

//       const result = await response.json();
//       const favList: any[] = Array.isArray(result.data) ? result.data : [];

//       const mappedStores = await Promise.all(
//         favList.map(async (item) => {
//           const address = item.storeAddress || item.address || '';
//           const name = item.storeName || item.name || '이름 없음';

//           const coords = await getCoordsFromAddress(address);
//           const storeLat = coords ? coords.lat : 0;
//           const storeLng = coords ? coords.lng : 0;

//           let dist = 0;
//           if (storeLat !== 0 && storeLng !== 0) {
//             // dist = getDistanceFromLatLonInMeters(center.lat, center.lng, storeLat, storeLng);
//           }

//           return {
//             id: item.storeId,
//             name: name,
//             category: item.category || '기타',
//             address: address,
//             lat: storeLat,
//             lng: storeLng,
//             image: item.storeImageUrl,
//             rating: 0,
//             reviewCount: 0,
//             description: '즐겨찾는 매장',
//             distance: dist,
//           } as Store;
//         })
//       );

//       // 4. 유효한 좌표만 필터링
//       const validStores = mappedStores.filter((s) => s.lat !== 0);

//       // 5. 상태 업데이트
//       setSliderStores(validStores);

//       if (validStores.length > 0) {
//         drawMarkers(validStores); // 지도에 마커 표시

//         // [옵션] 목록 첫 번째 가게로 지도 이동
//         if (mapRef.current) {
//           const moveLatLon = new window.kakao.maps.LatLng(
//             validStores[0].lat,
//             validStores[0].lng
//           );
//           mapRef.current.panTo(moveLatLon);
//         }
//       } else {
//         clearMarkers();
//       }
//     } catch (error) {
//       console.error('Error fetching favorites:', error);
//       setSliderStores([]); // 에러 시 빈 목록
//     }
//   };

//   // --- 즐겨찾기 삭제 처리 ---
//   const handleDeleteFavorite = async (storeId: number) => {
//     if (!confirm('정말 즐겨찾기를 해제하시겠습니까?')) return;

//     const token = localStorage.getItem('accessToken');
//     if (!token) {
//       alert('로그인 정보가 없습니다.');
//       return;
//     }

//     try {
//       const response = await fetch(`${apiUri}/v1/favstores/${storeId}`, {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         const updatedStores = sliderStores.filter(
//           (store) => store.id !== storeId
//         );

//         setSliderStores(updatedStores);
//         drawMarkers(updatedStores);

//         if (selectedStore?.id === storeId) {
//           setSelectedStore(null);
//         }

//         alert('즐겨찾기가 해제되었습니다.');
//       } else {
//         throw new Error('삭제 실패');
//       }
//     } catch (error) {
//       console.error('즐겨찾기 삭제 중 오류:', error);
//       alert('삭제 처리에 실패했습니다.');
//     }
//   };

//   // --- 탭 변경 핸들러 ---
//   const updateSliderContent = (newMode: StoreListMode) => {
//     setMode(newMode);
//     setSelectedStore(null);

//     if (newMode === 'ai') {
//       fetchAiRecommendations();
//     } else if (newMode === 'nearby') {
//       fetchAllStores(center.lat, center.lng);
//     } else if (newMode === 'favorites') {
//       fetchFavorites(); // [New] 즐겨찾기 호출
//     } else {
//       setSliderStores([]);
//       clearMarkers();
//     }
//   };

//   // --- [7] 검색 모달 결과 처리 ---
//   const handleSelectSearchResult = async (searchData: SearchApiResponse) => {
//     setIsSearchModalOpen(false);
//     const coords = await getCoordsFromAddress(searchData.storeAddress);

//     if (!coords) {
//       alert('매장의 위치 정보를 찾을 수 없습니다.');
//       return;
//     }

//     const dist = getDistanceFromLatLonInMeters(
//       center.lat,
//       center.lng,
//       coords.lat,
//       coords.lng
//     );

//     const newStore: Store = {
//       id: searchData.storeId,
//       name: searchData.storeName,
//       category: searchData.category,
//       address: searchData.storeAddress,
//       lat: coords.lat,
//       lng: coords.lng,
//       image: searchData.storeImageUrl || undefined,
//       rating: 0,
//       reviewCount: 0,
//       description: searchData.reward || '이벤트 정보 없음',
//       distance: dist,
//     };

//     updateMapWithStore(newStore);
//   };

//   // --- [8] 초기화 ---
//   useEffect(() => {
//     const initializeMap = (initialPosition: { lat: number; lng: number }) => {
//       if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
//         window.kakao.maps.load(() => {
//           const container = document.getElementById('map');
//           if (container && mapRef.current === null) {
//             const mapCenter = new window.kakao.maps.LatLng(
//               initialPosition.lat,
//               initialPosition.lng
//             );
//             const options = { center: mapCenter, level: 4 };
//             const kakaoMap = new window.kakao.maps.Map(container, options);

//             mapRef.current = kakaoMap;
//             geocoderRef.current = new window.kakao.maps.services.Geocoder();

//             // [복구 완료] 지도 빈 곳 클릭 시 슬라이더 닫기
//             window.kakao.maps.event.addListener(kakaoMap, 'click', () => {
//               setIsSliderOpen((prev) => !prev);
//             });

//             fetchAllStores(initialPosition.lat, initialPosition.lng);
//           }
//         });
//       }
//     };

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const currentPos = {
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude,
//         };
//         setCenter(currentPos);
//         initializeMap(currentPos);
//       },
//       (err) => {
//         console.warn('Geolocation Error:', err);
//         const defaultPos = { lat: 37.5665, lng: 126.978 };
//         setCenter(defaultPos);
//         initializeMap(defaultPos);
//       },
//       { enableHighAccuracy: true }
//     );
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <div className="w-full h-screen flex flex-col justify-center relative overflow-hidden bg-white">
//       <style>{`
//         .custom-overlay-label {
// font-size: 12px;
// font-weight: 600;
// color: #black;
// white-space: nowrap; /* 줄바꿈 방지 */
// }
//       `}</style>

//       {/* Title */}
//       <div className="mx-5 my-2 text-[25px] font-semibold flex justify-start items-start">
//         Map
//       </div>

//       {/* 가짜 검색창 */}
//       <div
//         className="w-full justify-center flex flex-row h-11 px-3 gap-3 z-10"
//         onClick={() => setIsSearchModalOpen(true)}
//       >
//         <div className="flex-1 rounded-[10px] h-full bg-gray-100 flex items-center px-4 cursor-pointer">
//           <span className="text-gray-400 text-sm">지역, 건물, 주소 검색</span>
//         </div>
//         <button className="w-11 h-full flex items-center justify-center rounded-[10px] bg-gray-100 cursor-pointer">
//           <img src={searchIcon} alt="search" />
//         </button>
//       </div>

//       {/* 필터 탭 */}
//       <div className="absolute top-[120px] left-3 rounded-[50px] justify-center px-3 py-2 z-10 gap-2 bg-white flex shadow-sm">
//         <RadioTab
//           label="내 주변"
//           value="nearby"
//           currentValue={mode}
//           onClick={() => updateSliderContent('nearby')}
//         />
//         <RadioTab
//           label="AI 추천"
//           value="ai"
//           currentValue={mode}
//           onClick={() => updateSliderContent('ai')}
//         />
//         <RadioTab
//           label="즐겨찾기"
//           value="favorites"
//           currentValue={mode}
//           onClick={() => updateSliderContent('favorites')}
//         />
//       </div>

//       {/* 지도 영역 */}
//       <div className="flex-grow w-full mt-3 relative">
//         <div id="map" className="w-full h-full z-0"></div>
//       </div>

//       {/* 슬라이더, 즐겨찾기 */}
//       {isSliderOpen &&
//         (mode === 'favorites' ? (
//           <FavoriteBottomSheet
//             stores={sliderStores}
//             onStoreClick={(store) => {
//               // 리스트 아이템 클릭 시 지도 이동
//               if (mapRef.current) {
//                 const moveLatLon = new window.kakao.maps.LatLng(
//                   store.lat,
//                   store.lng
//                 );
//                 mapRef.current.panTo(moveLatLon);
//               }
//             }}
//             onDeleteRequest={handleDeleteFavorite}
//           />
//         ) : (
//           <StoreSlider
//             stores={sliderStores}
//             selectedStore={selectedStore}
//             isOpen={isSliderOpen}
//             onStoreSelect={(store) => {
//               setSelectedStore(store);
//               setIsSliderOpen(true);
//               if (mapRef.current) {
//                 const pos = new window.kakao.maps.LatLng(store.lat, store.lng);
//                 mapRef.current.panTo(pos);
//               }
//             }}
//           />
//         ))}

//       <UserBottomBar />

//       <SearchModal
//         isOpen={isSearchModalOpen}
//         onClose={() => setIsSearchModalOpen(false)}
//         onSelectStore={handleSelectSearchResult}
//       />
//     </div>
//   );
// };
