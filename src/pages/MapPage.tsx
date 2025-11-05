import React, { useEffect, useState } from 'react';
import searchIcon from '../assets/saerchIcon.png';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const naver: any;

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
          <p className="text-[12px] text-gray-500">{store.distance ? `${store.distance}km` : '거리 정보 없음'}</p>
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

  const onSearchMap = () => {
    console.log('지도 검색');
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
        />
        <button
          className="w-11 h-full flex items-center justify-center rounded-[10px] bg-gray-100"
          onClick={onSearchMap}
        >
          <img src={searchIcon} alt="search" />
        </button>
      </div>

      <div className="flex-grow w-full mt-3">
        <div id="map" className="w-full h-full"></div>
      </div>

      <BottomModal
        store={selectedStore}
        onClose={() => setSelectedStore(null)}
      />
    </div>
  );
};
