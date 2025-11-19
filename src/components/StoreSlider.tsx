/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface Store {
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
        className="absolute top-5 right-4 text-gray-500 hover:text-gray-800 transition-colors z-20 cursor-pointer"
        aria-label="가게 상세 페이지으로 이동"
      >
        {/* 이미지 대신 SVG 아이콘 사용 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
          />
        </svg>
      </button>

      <div className="flex flex-col">
        <div className="flex flex-row items-center gap-1">
          <p
            className="text-[20px] font-medium cursor-pointer hover:text-orange-500 transition-colors truncate max-w-[180px]"
            onClick={() => onStoreSelect(store)}
          >
            {store.name}
          </p>
          <p className="text-[12px] text-gray-500 shrink-0">{store.category}</p>
        </div>
        <div className="flex flex-row items-center mt-2 gap-2">
          <p className="text-[12px] text-gray-500 shrink-0">
            {store.distance ? `${store.distance}km` : '거리 정보 없음'}
          </p>
          <p className="text-[12px] text-gray-500 truncate max-w-[160px]">{store.address}</p>
        </div>
      </div>

      {/* 이미지 영역: 이미지가 없을 경우 대비 */}
      <div className="w-[144px] h-[144px] bg-gray-100 rounded-2xl my-4 overflow-hidden mx-auto">
        {store.image ? (
          <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            이미지 준비중
          </div>
        )}
      </div>

      <div className="mt-1 flex items-center justify-center">
        <span className="text-yellow-500">⭐️ {store.rating.toFixed(1)}</span>
        <span className="text-gray-400 ml-1">({store.reviewCount})</span>
      </div>
      
      <div className="w-[220px] h-[28px] text-[11px] mt-2 px-4 py-1.5 bg-gray-50 rounded-[20px] mx-auto truncate text-center text-gray-600">
        <span className="font-semibold text-black mr-1">AI 요약</span>
        {store.description}
      </div>
    </div>
  );
};

interface StoreSliderProps {
  stores: Store[];
  selectedStore: Store | null;
  onClose?: () => void; // onClose는 선택적으로 받음
  onStoreSelect: (store: Store) => void;
}

export const StoreSlider: React.FC<StoreSliderProps> = ({
  stores,
  selectedStore,
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

  if (!selectedStore) {
    return null;
  }

  return (
    <div className="fixed bottom-[100px] left-0 right-0 w-full z-10 pointer-events-none">
      {/* pointer-events-auto를 내부 컨테이너에 주어 슬라이더만 클릭 가능하게 함 */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto scroll-snap-type-x-mandatory scroll-smooth gap-4 px-[calc(50%-150px)] pointer-events-auto py-4"
        style={{
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
            <StoreCard store={store} onStoreSelect={onStoreSelect} />
          </div>
        ))}
      </div>
    </div>
  );
};