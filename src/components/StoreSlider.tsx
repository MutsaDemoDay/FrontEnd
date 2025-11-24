/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useNavigate } from 'react-router-dom';

// ... Store 인터페이스와 StoreCard 컴포넌트는 기존과 동일 ...
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
    // ... StoreCard 내부 코드는 기존과 동일 ...
    // (이전 답변의 StoreCard 코드를 그대로 사용하세요)
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate(`/store/${store.id}`, { 
          state: { 
            storeName: store.name,
            category: store.category 
          } 
        });
    };
    const formatDistance = (meters?: number) => {
        if (typeof meters !== 'number') return '거리 정보 없음';
        if (meters >= 1000) {
          return `${(meters / 1000).toFixed(1)}km`;
        }
        return `${Math.floor(meters)}m`;
    };

    return (
        <div
        className="w-[300px] h-[320px] p-5 bg-white rounded-2xl shadow-lg
                    flex-shrink-0 scroll-snap-align-center relative"
        style={{ boxShadow: '0 -4px 12px rgba(0,0,0,0.1)' }}
        >
        <button
            onClick={handleNavigate}
            className="absolute top-5 right-4 text-gray-500 hover:text-gray-800 transition-colors z-20 cursor-pointer"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
        </button>

        <div className="flex flex-col">
            <div className="flex flex-row items-center gap-1">
            <p className="text-[20px] font-medium cursor-pointer hover:text-orange-500 transition-colors truncate max-w-[180px]" onClick={() => onStoreSelect(store)}>
                {store.name}
            </p>
            <p className="text-[12px] text-gray-500 shrink-0">{store.category}</p>
            </div>
            <div className="flex flex-row items-center mt-2 gap-2">
            <p className="text-[12px] text-gray-500 shrink-0 font-medium text-orange-600">
                {formatDistance(store.distance)}
            </p>
            <p className="text-[12px] text-gray-500 truncate max-w-[160px]">{store.address}</p>
            </div>
        </div>

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
  onStoreSelect: (store: Store) => void;
  isOpen: boolean; // [추가] 슬라이더 보임 여부
}

export const StoreSlider: React.FC<StoreSliderProps> = ({
  stores,
  selectedStore,
  onStoreSelect,
  isOpen, // [추가]
}) => {
  const sliderRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!selectedStore || !sliderRef.current) return;
    const targetElement = sliderRef.current.querySelector(
      `[data-store-id="${selectedStore.id}"]`
    );
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedStore]);

  // 데이터가 없으면 아예 렌더링 안 함
  if (!stores || stores.length === 0) {
    return null;
  }

  return (
    <div 
        className={`fixed bottom-[100px] left-0 right-0 w-full z-10 pointer-events-none transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-y-0' : 'translate-y-[150%]' 
        }`}
    >
      <div
        ref={sliderRef}
        className="flex overflow-x-auto scroll-snap-type-x-mandatory scroll-smooth gap-4 px-[calc(50%-150px)] pointer-events-auto py-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`.scroll-snap-type-x-mandatory::-webkit-scrollbar { display: none; }`}</style>

        {stores.map((store) => (
          <div key={store.id} data-store-id={store.id}>
            <StoreCard store={store} onStoreSelect={onStoreSelect} />
          </div>
        ))}
      </div>
    </div>
  );
};