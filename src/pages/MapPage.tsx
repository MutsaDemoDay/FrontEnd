/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import searchIcon from '../assets/saerchIcon.png';
import shop_arrow from '../assets/shop_arrow.png';
import bottom_bar from '../assets/bottom_bar.png';
import type { KakaoAddress } from '../components/KakaoAddress';

// Kakao Maps SDK가 전역 window 객체에 로드될 때를 위한 타입 선언
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

interface BottomModalProps {
  store: Store | null;
  onClose: () => void;
}

interface CurrentPosition {
  lat: number;
  lng: number;
}

const BottomModal: React.FC<BottomModalProps> = ({ store }) => {
  const navigate = useNavigate();

  if (!store) return null;

  const handleNavigate = () => {
    if (store) {
      navigate(`/store/${store.id}`);
    }
  };

  return (
    <div
      className={`w-[300px] h-[320px] fixed bottom-30 left-0 right-0 p-5 bg-white rounded-2xl shadow-lg z-10
                  ${store ? 'translate-y-0' : 'translate-y-full'}`}
      style={{
        maxWidth: '640px',
        margin: '0 auto',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <button
        onClick={handleNavigate}
        className="absolute top-5 right-4 text-gray-500 text-xl font-bold"
        aria-label="가게 상세 페이지로 이동"
      >
        <img src={shop_arrow} alt="" />
      </button>

      <div className="flex flex-col">
        <div className="flex flex-row items-center gap-1">
          <p className="text-[20px] font-medium">{store.name}</p>
          <p className="text-[12px] text-gray-500">{store.category}</p>
        </div>
        <div className="flex flex-row items-center mt-2 gap-2">
          <p className="text-[12px] text-gray-500">
            {store.distance ? `${store.distance}km` : '거리 정보 없음'}
          </p>
          <p className="text-[12px] text-gray-500">{store.address}</p>
        </div>
      </div>

      <div className="w-[144px] h-[144px] bg-gray-300 rounded-2xl my-4 pb-10">
        <img src={store.image} alt="아직 이미지가 등록되지 않았습니다." />
      </div>
      <div className="mt-1">
        <span className="text-yellow-500">⭐️ {store.rating.toFixed(1)}</span>
        <span className="text-gray-400 ml-1">({store.reviewCount})</span>
      </div>
      <div className="w-[202px] h-[24px] text-[10px] mt-1 px-4 py-1.5 bg-gray-50 rounded-[20px]">
        <span className="font-semibold text-black">AI 요약</span>{' '}
        {store.description}
      </div>
    </div>
  );
};

const stores: Store[] = [
  {
    id: 1,
    name: '카페홍문관',
    category: '카페',
    address: '서울 마포구 와우산로 94 홍문관 1층',
    lat: 37.55506,
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
];

export const MapPage: React.FC = () => {
  const [map, setMap] = useState<any | null>(null);
  const geocoderRef = useRef<any | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const [center, setCenter] = useState<CurrentPosition>({ lat: 37.5665, lng: 126.978 });

  // 검색창 입력값
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 주소 검색 결과
  const [addressResults, setAddressResults] = useState<KakaoAddress[]>([]);

  // 가게 검색 결과
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);

  // 검색된 주소 마커들
  const [searchMarkers, setSearchMarkers] = useState<any[]>([]);

  useEffect(() => {
    // Kakao Maps SDK 로드 및 지도 초기화
    if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');

        if (container) {
          const options = {
            center: new window.kakao.maps.LatLng(center.lat, center.lng),
            level: 3,
          };
          const kakaoMap = new window.kakao.maps.Map(container, options);
          setMap(kakaoMap); // 지도 state 설정
          geocoderRef.current = new window.kakao.maps.services.Geocoder();
        }
      });
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      // 1-3. 위치를 가져오면 'center' state를 업데이트합니다.
      // 이 state 업데이트가 아래 두 번째 useEffect를 트리거합니다.
      setCenter({ lat: userLat, lng: userLng });
    });
  }, []);

  useEffect(() => {
    // map 객체가 생성되었고, center 값이 (기본 또는 새 값으로) 존재할 때
    if (map) {
      // 새 center 좌표로 LatLng 객체 생성
      const newCenter = new window.kakao.maps.LatLng(center.lat, center.lng);
      map.panTo(newCenter);
    }
  }, [map, center]);

  // 저장된 가게 마커들을 지도에 표시하는 useEffect
  useEffect(() => {
    if (!map) return; // 지도가 아직 로드되지 않았다면 아무것도 하지 않음

    stores.forEach((store) => {
      const markerPosition = new window.kakao.maps.LatLng(store.lat, store.lng);
      const marker = new window.kakao.maps.Marker({
        map: map,
        position: markerPosition,
        title: store.name, // 마커에 마우스 오버 시 표시될 이름
      });

      // 마커 클릭 이벤트 리스너
      window.kakao.maps.event.addListener(marker, 'click', () => {
        setSelectedStore(store);
        map.panTo(markerPosition); // 클릭한 마커 위치로 지도 이동
      });
    });

    // 지도 클릭 시 모달 닫기
    window.kakao.maps.event.addListener(map, 'click', () => {
      setSelectedStore(null);
    });
  }, [map]); // map 객체가 준비될 때마다 실행

  const onSearchMap = () => {
    if (searchQuery.trim() === '') {
      alert('검색어를 입력해주세요.');
      return;
    }
    if (!geocoderRef.current) {
      alert('지도 검색 기능이 아직 준비되지 않았습니다.');
      return;
    }

    // 1. (수정) 즉시 검색된 '가게' 결과는 숨김
    setFilteredStores([]);

    // 2. (유지) 기존 주소 검색 마커 제거
    searchMarkers.forEach((marker) => marker.setMap(null));
    setSearchMarkers([]);

    // 3. (유지) Kakao Geocoder API 호출
    geocoderRef.current.addressSearch(
      searchQuery,
      (result: KakaoAddress[], status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          // 4. (수정) '주소' 검색 결과 state에 저장
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
    if (!map) return;
    const { x, y } = address;
    const moveLatLon = new window.kakao.maps.LatLng(Number(y), Number(x));

    const newMarker = new window.kakao.maps.Marker({
      position: moveLatLon,
      map: map,
    });
    setSearchMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    map.panTo(moveLatLon);

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
    if (!map) return;

    // 1. 가게 위치로 지도 이동
    const moveLatLon = new window.kakao.maps.LatLng(store.lat, store.lng);
    map.panTo(moveLatLon);

    // 2. 하단 모달창 열기
    setSelectedStore(store);

    // 3. 모든 검색 결과 목록 숨기기
    setFilteredStores([]);
    setAddressResults([]);

    // 4. 검색창 값을 가게 이름으로 설정
    setSearchQuery(store.name);
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center relative overflow-hidden">
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

      {/* --- 💡 수정: 검색 결과 UI --- */}
      <div className="relative w-full flex justify-center px-3 z-20">
        {/* 1. '가게' 즉시 검색 결과 렌더링 */}
        {filteredStores.length > 0 && (
          <ul className="absolute top-1 w-[316px] bg-white rounded-[10px] shadow-lg border border-gray-200 overflow-hidden">
            {filteredStores.map((store) => (
              <li
                key={`store-${store.id}`}
                className="p-3 text-sm cursor-pointer hover:bg-gray-100"
                onClick={() => handleStoreSelect(store)} // <--- 💡 추가된 핸들러
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

      <BottomModal
        store={selectedStore}
        onClose={() => setSelectedStore(null)}
      />

      <div className="fixed w-screen h-[72px] bottom-3 left-0 right-0 flex justify-center items-center">
        <img src={bottom_bar} alt="하단바" />
      </div>
    </div>
  );
};
