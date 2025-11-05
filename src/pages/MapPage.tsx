import React, { useEffect, useState } from 'react';
import searchIcon from '../assets/saerchIcon.png';
import { geoCodeAddress } from '../api/geoCodeAddress.ts';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    naver: any;
  }
}

interface NaverAddress {
  roadAddress: string;
  jibunAddress: string;
  x: string; // 경도 (longitude)
  y: string; // 위도 (latitude)
}

interface Store {
  id: number;
  name: string;
  category: string;
  address: string;
  distance?: number;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  description: string;
}

// 2. BottomModal 컴포넌트 Props 타입 정의
interface BottomModalProps {
  store: Store | null;
  onClose: () => void;
}

// 3. BottomModal 컴포넌트 (Props 타입 적용)
const BottomModal: React.FC<BottomModalProps> = ({ store, onClose }) => {
  if (!store) return null;

  return (
    <div
      className={`w-[300px] h-[320px] fixed bottom-20 left-0 right-0 p-5 bg-white rounded-t-2xl shadow-lg z-10
                  ${store ? 'translate-y-0' : 'translate-y-full'}`}
      style={{
        maxWidth: '640px',
        margin: '0 auto',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500"
      >
        X
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

      <div className="mt-4">
        <span className="text-yellow-500">⭐ {store.rating.toFixed(1)}</span>
        <span className="text-gray-400 ml-2">({store.reviewCount})</span>
      </div>
      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
        <span className="font-semibold text-blue-600">AI 요약:</span>{' '}
        {store.description}
      </div>
    </div>
  );
};

// 4. 가게 데이터 (Store[] 타입)
const stores: Store[] = [
  {
    id: 1,
    name: '카페홍문관',
    category: '카페',
    address: '서울 마포구 와우산로 94 홍문관 1층',
    lat: 37.55506,
    lng: 126.92497,
    rating: 3.0,
    reviewCount: 67,
    description: '차분한 감성 가득한 대형 베이커리 카페',
    distance: 8.5,
  },
  {
    id: 2,
    name: '카페나무',
    category: '카페',
    address: '서울 마포구 어딘가',
    lat: 37.550556,
    lng: 126.925833,
    rating: 4.5,
    reviewCount: 120,
    description: '활기찬 분위기의 동네 카페',
    distance: 8.3,
  },
];

// 5. MapPage 컴포넌트 (React.FC, useState 타입 명시)
export const MapPage: React.FC = () => {
  // 6. state에 타입 명시
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<NaverAddress[]>([]);
  // 사용자가 검색해서 추가한 마커들을 관리 (선택 사항)
  const [searchMarkers, setSearchMarkers] = useState<naver.maps.Marker[]>([]);

  useEffect(() => {
    const checkNaverMaps = () => {
      // window.naver로 접근
      if (typeof window.naver !== 'undefined' && window.naver.maps) {
        const mapInstance = new window.naver.maps.Map('map', {
          center: new window.naver.maps.LatLng(37.550556, 126.925833),
          zoom: 15,
          minzoom: 9,
          zoomControl: true,
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT,
          },
        });

        mapInstance.setOptions('minZoom', 9);
        setMap(mapInstance);
      } else {
        setTimeout(checkNaverMaps, 100);
      }
    };

    checkNaverMaps();
  }, []);

  const onSearchMap = async () => {
    if (searchQuery.trim() === '') {
      alert('검색어를 입력해주세요.');
      return;
    }

    try {
      // 1단계에서 수정한 geoCodeAddress 함수 호출
      const addresses = await geoCodeAddress(searchQuery);

      if (addresses.length === 0) {
        alert('검색 결과가 없습니다.');
        setSearchResults([]); // 결과가 없으면 리스트 비우기
      } else {
        // "가장 연관된 주소 3개" (혹은 API가 준 전체)
        // Naver API는 보통 최대 10개까지 관련 주소를 반환합니다.
        // 3개만 보여주고 싶다면 .slice(0, 3) 사용
        setSearchResults(addresses.slice(0, 3));
      }
    } catch (error) {
      console.error(error);
      alert('주소 검색 중 오류가 발생했습니다.');
    }
  };

  // 5. 검색 결과 리스트에서 항목 클릭 시 실행될 함수 (신규)
  const handleAddressSelect = (address: NaverAddress) => {
    if (!map) return;

    const { x, y } = address; // x: 경도, y: 위도
    const newLatLng = new window.naver.maps.LatLng(Number(y), Number(x));

    // 새 마커 생성
    const newMarker = new window.naver.maps.Marker({
      position: newLatLng,
      map: map,
    });

    // (선택 사항) 새 마커 관리
    setSearchMarkers((prevMarkers) => [...prevMarkers, newMarker]);

    // 지도를 새 마커 위치로 이동
    map.panTo(newLatLng);

    // 검색 결과 리스트 숨기기
    setSearchResults([]);
    // 검색창에 선택한 주소 표시
    setSearchQuery(address.roadAddress || address.jibunAddress);
  };

  useEffect(() => {
    if (map) {
      stores.forEach((store) => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(store.lat, store.lng),
          map: map,
        });

        // 7. 이벤트 리스너의 반환 타입(any)을 사용하지 않으므로 변수 선언 스킵
        window.naver.maps.Event.addListener(marker, 'click', () => {
          setSelectedStore(store);
          map.panTo(marker.getPosition());
        });
      });

      window.naver.maps.Event.addListener(map, 'click', () => {
        setSelectedStore(null);
      });
    }
  }, [map]); // 'map' state가 변경될 때마다 실행

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
          // 6. input을 state와 연결 (제어 컴포넌트)
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          // 7. Enter 키로도 검색되도록 (선택 사항)
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

      {/* 8. 검색 결과 리스트 UI (신규) */}
      {/* 검색창(input)의 부모(div)에 relative를 추가하고 
        결과 리스트(ul)에 absolute를 주어 검색창 바로 아래에 뜨게 합니다.
        z-index가 지도(z-0)나 BottomModal(z-10)보다 높아야 합니다.
      */}
      <div className="relative w-full flex justify-center px-3 z-20">
        {searchResults.length > 0 && (
          <ul className="absolute top-1 w-[316px] bg-white rounded-[10px] shadow-lg border border-gray-200 overflow-hidden">
            {searchResults.map((address, index) => (
              <li
                key={index}
                className="p-3 text-sm cursor-pointer hover:bg-gray-100"
                onClick={() => handleAddressSelect(address)}
              >
                <div className="font-medium text-gray-800">
                  {address.roadAddress}
                </div>
                <div className="text-xs text-gray-500">
                  [지번] {address.jibunAddress}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex-grow w-full mt-3">
        {/* z-index 조정 (검색 결과가 위로 와야 함) */}
        <div id="map" className="w-full h-full z-0"></div>
      </div>

      {/* BottomModal은 z-10이므로 검색 결과(z-20)보다 아래에 있습니다. */}
      <BottomModal
        store={selectedStore}
        onClose={() => setSelectedStore(null)}
      />
    </div>
  );
};
