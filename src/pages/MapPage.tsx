/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react';
import searchIcon from '../assets/saerchIcon.png';
import bottom_bar from '../assets/bottom_bar.png';
import type { KakaoAddress } from '../components/KakaoAddress';
import { UserBottomBar } from '../components/UserBottomBar';
import { StoreSlider } from '../components/StoreSlider';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

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
}

interface CurrentPosition {
  lat: number;
  lng: number;
}

const stores: Store[] = [
  {
    id: 1,
    name: '카페홍문관',
    category: '카페',
    address: '서울 마포구 와우산로 94 홍문관 1층',
    lat: 37.557434302,
    lng: 126.92497,
    rating: 3.0,
    reviewCount: 6,
    description: '활기찬 분위기의 동네 카페',
    distance: 8.5,
  },
  {
    id: 2,
    name: '카페나무',
    category: '카페',
    address: '서울 마포구 어딘가', // 실제 카카오 API로 검색되는 주소로 변경하면 좋음
    lat: 37.550556,
    lng: 126.925833,
    rating: 3.0,
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
    rating: 4.5,
    reviewCount: 120,
    description: '오랜 역사를 지닌 명문 대학교',
    distance: 5.0,
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
  },
];

export const MapPage: React.FC = () => {
  const mapRef = useRef<any | null>(null);
  const geocoderRef = useRef<any | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const [center, setCenter] = useState<CurrentPosition>({
    lat: 37.5665,
    lng: 126.978,
  });

  // 검색창 입력값
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 주소 검색 결과
  const [addressResults, setAddressResults] = useState<KakaoAddress[]>([]);

  // 가게 검색 결과
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);

  // 검색된 주소 마커들
  const [searchMarkers, setSearchMarkers] = useState<any[]>([]);

  // 슬라이더에 표시할 가게 목록 (최대 5개)
  const [sliderStores, setSliderStores] = useState<Store[]>([]);

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

            const options = {
              center: mapCenter,
              level: 3,
            };
            const kakaoMap = new window.kakao.maps.Map(container, options);

            mapRef.current = kakaoMap;
            geocoderRef.current = new window.kakao.maps.services.Geocoder();

            setCenter(initialPosition);

            const sortedStores = [...stores]
              .sort((a, b) => (a.distance || 99) - (b.distance || 99))
              .slice(0, 5);

            setSliderStores(sortedStores);

            stores.forEach((store) => {
              const markerPosition = new window.kakao.maps.LatLng(
                store.lat,
                store.lng
              );
              const marker = new window.kakao.maps.Marker({
                map: kakaoMap,
                position: markerPosition,
                title: store.name,
              });

              window.kakao.maps.event.addListener(marker, 'click', () => {
                setSelectedStore(store);
                kakaoMap.panTo(markerPosition);
              });
            });

            window.kakao.maps.event.addListener(kakaoMap, 'click', () => {
              setSelectedStore(null);
            });
          }
        });
      }
    };
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
      {
        enableHighAccuracy: true,
        timeout: 3000,
        maximumAge: 0,
      }
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

  const handleStoreSelect = (store: Store) => {
    if (!mapRef.current) return;

    const moveLatLon = new window.kakao.maps.LatLng(store.lat, store.lng);
    mapRef.current.panTo(moveLatLon);

    setSelectedStore(store);

    setFilteredStores([]);
    setAddressResults([]);

    setSearchQuery(store.name);
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center relative overflow-hidden">
      {/* ... (기존 검색창 UI) ... */}
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
        onClose={() => setSelectedStore(null)}
        onStoreSelect={handleStoreSelect}
      />

      <div className="fixed w-screen h-[72px] bottom-3 left-0 right-0 flex justify-center items-center">
        <UserBottomBar />
      </div>
    </div>
  );
};

