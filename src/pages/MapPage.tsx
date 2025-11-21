/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react';
import searchIcon from '../assets/searchIcon.png';
import type { KakaoAddress } from '../components/KakaoAddress';
import { UserBottomBar } from '../components/UserBottomBar';
import { StoreSlider } from '../components/StoreSlider';

// Store 인터페이스
interface Store {
  id: number;
  name: string;
  category: string;
  address: string;
  distance?: number;
  image?: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  description: string;
  isFavorite?: boolean; // 즐겨찾기 여부 (목업)
}

// CurrentPosition 인터페이스
interface CurrentPosition {
  lat: number;
  lng: number;
}

// 목업 데이터
const stores: Store[] = [
  {
    id: 1,
    name: '테스트 카페',
    category: '카페',
    address: '서울 마포구 와우산로 94 홍문관 1층',
    lat: 37.557434302,
    lng: 126.92497,
    rating: 3.0,
    reviewCount: 6,
    description: '활기찬 분위기의 동네 카페',
    distance: 8.5,
    isFavorite: true,
  },
  {
    id: 2,
    name: '카페나무',
    category: '카페',
    address: '서울 마포구 어딘가',
    lat: 37.550556,
    lng: 126.925833,
    rating: 4.5,
    reviewCount: 6,
    description: '활기찬 분위기의 동네 카페',
    distance: 8.3,
  },
  {
    id: 3,
    name: '연세대학교 신촌캠퍼스',
    category: '대학교',
    address: '서울 서대문구 연세로 50',
    lat: 37.56578,
    lng: 126.93857,
    rating: 4.8,
    reviewCount: 120,
    description: '오랜 역사를 지닌 명문 대학교',
    distance: 5.0,
    isFavorite: true,
  },
  {
    id: 4,
    name: '가게 4',
    category: '음식점',
    address: '서울 어딘가 4',
    lat: 37.56178,
    lng: 126.93357,
    rating: 4.2,
    reviewCount: 50,
    description: '설명 4',
    distance: 4.1,
  },
  {
    id: 5,
    name: '가게 5',
    category: '편의점',
    address: '서울 어딘가 5',
    lat: 37.56878,
    lng: 126.93157,
    rating: 3.8,
    reviewCount: 10,
    description: '설명 5',
    distance: 6.2,
    isFavorite: false,
  },
];

// 필터 모드 타입
type StoreListMode = 'nearby' | 'ai' | 'favorites';

// 라디오 탭 버튼 헬퍼 컴포넌트
type RadioTabProps = {
  label: string;
  value: StoreListMode;
  currentValue: StoreListMode;
  onClick: () => void;
};

const RadioTab: React.FC<RadioTabProps> = ({
  label,
  value,
  currentValue,
  onClick,
}) => {
  const isSelected = value === currentValue;
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
        ${
          isSelected
            ? 'bg-white text-black border border-black'
            : 'bg-white text-black hover:bg-gray-300'
        }
      `}
    >
      {label}
    </button>
  );
};


export const MapPage: React.FC = () => {
  const mapRef = useRef<any | null>(null);
  const geocoderRef = useRef<any | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const [center, setCenter] = useState<CurrentPosition>({
    lat: 37.5665,
    lng: 126.978,
  });
  
  // ... (searchQuery, addressResults, filteredStores, searchMarkers는 동일)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addressResults, setAddressResults] = useState<KakaoAddress[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [searchMarkers, setSearchMarkers] = useState<any[]>([]);


  // 슬라이더에 표시할 가게 목록
  const [sliderStores, setSliderStores] = useState<Store[]>([]);

  // 필터 모드 상태
  const [mode, setMode] = useState<StoreListMode>('nearby');

  // [수정] 슬라이더 컨텐츠 업데이트 함수
  const updateSliderContent = (newMode: StoreListMode) => {
    setMode(newMode); // 모드 상태 업데이트

    let newSliderStores: Store[] = [];

    switch (newMode) {
      case 'nearby':
        newSliderStores = [...stores]
          .sort((a, b) => (a.distance || 99) - (b.distance || 99))
          .slice(0, 5);
        break;
      case 'ai':
        newSliderStores = [...stores]
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 5);
        break;
      case 'favorites':
        newSliderStores = stores.filter((store) => store.isFavorite === true);
        break;
    }

    setSliderStores(newSliderStores);

    if (newSliderStores.length > 0) {
      setSelectedStore(newSliderStores[0]);
    } else {
      setSelectedStore(null);
    }
  };

  // 맵 초기화 및 가게 마커 설정
  useEffect(() => {
    const initializeMap = (initialPosition: CurrentPosition) => {
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

            setCenter(initialPosition);

            // 초기 슬라이더 컨텐츠 설정
            updateSliderContent('nearby');
            
            
            stores.forEach((store) => {
              // ... (마커 생성 로직)
              const markerPosition = new window.kakao.maps.LatLng(
                store.lat,
                store.lng
              );

              const marker = new window.kakao.maps.Marker({
                map: kakaoMap,
                position: markerPosition,
                title: store.name,
              });

              // 마커 클릭 시: 슬라이더가 해당 가게를 표시하며 열림
              window.kakao.maps.event.addListener(marker, 'click', () => {
                setSelectedStore(store);
                kakaoMap.panTo(markerPosition);
              });
            });

            // 지도 클릭 시: 슬라이더가 닫힘
            window.kakao.maps.event.addListener(kakaoMap, 'click', () => {
              setSelectedStore(null);
            });
          }
        });
      }
    };
    // ... (geolocation 호출 로직)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        initializeMap(userPosition);
      },
      (err) => {
        console.warn(`Geolocation ERROR(${err.code}): ${err.message}`);
        initializeMap(center);
      },
      { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 }
    );
  }, []);

  // 검색 함수
  const onSearchMap = () => {
    if (searchQuery.trim() === '') {
      alert('검색어를 입력해주세요.');
      return;
    }
    if (!geocoderRef.current) {
      alert('지도 검색 기능이 아직 준비되지 않았습니다.');
      return;
    }

    setFilteredStores([]);

    // 기존 주소 검색 마커 제거
    searchMarkers.forEach((marker) => marker.setMap(null));
    setSearchMarkers([]);

    // Kakao Geocoder API 호출
    geocoderRef.current.addressSearch(
      searchQuery,
      (result: KakaoAddress[], status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          // 주소 검색 결과 state에 저장
          setAddressResults(result.slice(0, 3));
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          alert('검색 결과가 없습니다.');
          setAddressResults([]);
        } else {
          alert('주소 검색 중 오류가 발생했습니다.');
        }
      }
    );
  };

  // 검색창 입력값 변경 시 실행될 함수
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    setAddressResults([]);

    if (query.trim() === '') {
      setFilteredStores([]);
      return;
    }
    const matchingStores = stores.filter((store) =>
      store.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStores(matchingStores);
  };

  // 검색 결과 리스트에서 항목 클릭 시 실행될 함수
  const handleAddressSelect = (address: KakaoAddress) => {
    if (!mapRef.current) return;
    const { x, y } = address;
    const moveLatLon = new window.kakao.maps.LatLng(Number(y), Number(x));

    const newMarker = new window.kakao.maps.Marker({
      position: moveLatLon,
      map: mapRef.current,
    });
    setSearchMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    mapRef.current.panTo(moveLatLon);

    setAddressResults([]);

    setSearchQuery(
      address.road_address?.address_name ||
        address.address?.address_name ||
        address.address_name ||
        address.x ||
        address.y
    );
  };


  // handleStoreSelect (슬라이더 카드 클릭 시)
  const handleStoreSelect = (store: Store) => {
    if (!mapRef.current) return;

    const moveLatLon = new window.kakao.maps.LatLng(store.lat, store.lng);
    mapRef.current.panTo(moveLatLon);

    // 마커를 클릭하는 것과 동일하게, 'selectedStore'를 설정합니다.
    setSelectedStore(store);

    setFilteredStores([]);
    setAddressResults([]);

    setSearchQuery(store.name);
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center relative overflow-scroll srollbar-hide">
      <div className="mx-5 my-2 text-[25px] font-semibold flex justify-start items-start">
        Map
      </div>

      <div className="w-full justify-center flex flex-row h-11 px-3 gap-3 z-10">
        <input
          type="text"
          className="pl-5 rounded-[10px] w-[316px] h-full bg-gray-100"
          placeholder="지역, 건물, 주소 검색"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearchMap();
          }}
        />
        <button
          className="w-11 h-full flex items-center justify-center rounded-[10px] bg-gray-100"
          onClick={onSearchMap}
        >
          <img src={searchIcon} alt="search" />
        </button>
      </div>

      <div className="absolute top-[120px] left-3 rounded-[50px] justify-center px-3 py-2 z-10 gap-2 bg-white ">
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

      {/* 검색 결과 드롭다운 */}
      <div className="relative w-full flex justify-center px-3 z-20">
        {/* 1. '가게' 즉시 검색 결과 렌더링 */}
        {filteredStores.length > 0 && (
          <ul className="absolute top-1 w-[316px] bg-white rounded-[10px] shadow-lg border border-gray-200 overflow-hidden">
            {filteredStores.map((store) => (
              <li
                key={`store-${store.id}`}
                className="p-3 text-sm cursor-pointer hover:bg-gray-100"
                onClick={() => handleStoreSelect(store)}
              >
                <div className="font-medium text-gray-800">{store.name}</div>
                <div className="text-xs text-gray-500">{store.address}</div>
              </li>
            ))}
          </ul>
        )}

        {/* 2. '주소' 검색 결과 렌더링 */}
        {addressResults.length > 0 && (
          <ul className="absolute top-1 w-[316px] bg-white rounded-[10px] shadow-lg border border-gray-200 overflow-hidden">
            {addressResults.map((address, index) => (
              <li
                key={index}
                className="p-3 text-sm cursor-pointer hover:bg-gray-100"
                onClick={() => handleAddressSelect(address)}
              >
                <div className="font-medium text-gray-800">
                  {address.road_address?.address_name || address.address_name}
                </div>
                <div className="text-xs text-gray-500">
                  [지번] {address.address?.address_name || ''}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex-grow w-full mt-3">
        <div id="map" className="w-full h-full z-0"></div>
      </div>

      <StoreSlider
        stores={sliderStores}
        selectedStore={selectedStore}
        onClose={() => setSelectedStore(null)} // 맵 클릭 시 닫히도록 onClose 전달
        onStoreSelect={handleStoreSelect}
      />

      <UserBottomBar />
    </div>
  );
};