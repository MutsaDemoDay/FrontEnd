/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import shop_arrow from '../assets/shop_arrow.png';

interface Store {
  // ... (Store 인터페이스)
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

const StoreCard: React.FC<{
  store: Store;
  onStoreSelect: (store: Store) => void;
}> = ({ store, onStoreSelect }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/store/${store.id}`);
  };

  return (
    <div
      className="w-[300px] h-[320px] p-5 bg-white rounded-2xl shadow-lg
                 flex-shrink-0 scroll-snap-align-center relative"
      style={{
        boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <button
        onClick={handleNavigate}
        className="absolute top-5 right-4 text-gray-500 text-xl font-bold z-20"
        aria-label="가게 상세 페이지으로 이동"
      >
        <img src={shop_arrow} alt="" />
      </button>

      <div className="flex flex-col">
        <div className="flex flex-row items-center gap-1">
          <p
            className="text-[20px] font-medium cursor-pointer" // cursor-pointer 추가
            onClick={() => onStoreSelect(store)}
          >
            {store.name}
          </p>
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
        <span className="text-(--fill-color3) ml-1">({store.reviewCount})</span>
      </div>
      <div className="w-[202px] h-[24px] text-[10px] mt-1 px-4 py-1.5 bg-gray-50 rounded-[20px]">
        <span className="font-semibold text-black">AI 요약</span>{' '}
        {store.description}
      </div>
    </div>
  );
};

interface StoreSliderProps {
  stores: Store[];
  selectedStore: Store | null;
  onClose: () => void; // [수정] onClose prop 다시 추가
  onStoreSelect: (store: Store) => void;
}

export const StoreSlider: React.FC<StoreSliderProps> = ({
  stores,
  selectedStore,
  // onClose, // onClose는 MapPage에서 지도를 클릭할 때 처리됩니다.
  onStoreSelect,
}) => {
  const sliderRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!selectedStore || !sliderRef.current) return;

    const targetElement = sliderRef.current.querySelector(
      `[data-store-id="${selectedStore.id}"]`
    );

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedStore]);

  // [수정] 렌더링 조건을 다시 selectedStore로 변경합니다.
  if (!selectedStore) {
    return null;
  }

  return (
    <div className="fixed bottom-[100px] left-0 right-0 w-full z-10">
      <div
        ref={sliderRef}
        className="flex overflow-x-auto scroll-snap-type-x-mandatory scroll-smooth gap-4"
        style={{
          paddingLeft: 'calc(50% - 150px)',
          paddingRight: 'calc(50% - 150px)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>
          {`
            .scroll-snap-type-x-mandatory::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        {stores.map((store) => (
          <div key={store.id} data-store-id={store.id}>
            {/* StoreCard가 isSelected prop을 받지 않도록 수정 (혹은 유지하셔도 됩니다) */}
            <StoreCard store={store} onStoreSelect={onStoreSelect} />
          </div>
        ))}
      </div>
    </div>
  );
};