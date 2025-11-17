/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from 'react'; // useRef를 import에 추가
import road_search_button from '../assets/road_search_button.png';

// API 응답으로 예상되는 가게 데이터 타입
// (실제 API 응답에 맞게 storeId, storeName, address 필드명을 확인/수정해야 합니다.)
export type Store = {
  storeId: number;
  storeName: string;
  address: string;
};

type StoreSearchModalProps = {
  onClose: () => void;
  onSelect: (store: Store) => void;
};

export const StoreSearchModal = ({
  onClose,
  onSelect,
}: StoreSearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- 스와이프 감지를 위한 Refs ---
  const touchStartY = useRef(0);
  const scrollableContentRef = useRef<HTMLDivElement>(null); // 스크롤 영역을 참조

  // 가게 검색 실행 함수
  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      setError('검색어를 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      const response = await fetch(
        `https://daango.store/api/v1/stores/search?storeName=${encodeURIComponent(
          searchQuery
        )}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // API가 인증을 요구한다면 Authorization 헤더 추가
            // 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
        }
      );

      if (!response.ok) {
        throw new Error('가게 검색에 실패했습니다.');
      }

      const result = await response.json();

      // --- API 응답 구조에 맞게 이 부분을 수정해야 합니다 ---
      // 예시 1: { success: true, data: [...] } 형태일 경우
      if (result.success && Array.isArray(result.data)) {
        if (result.data.length === 0) {
          setError('검색 결과가 없습니다.');
        } else {
          setSearchResults(result.data);
        }
      }
      // 예시 2: [...] 형태 (배열이 바로 반환될 경우)
      else if (Array.isArray(result)) {
        if (result.length === 0) {
          setError('검색 결과가 없습니다.');
        } else {
          setSearchResults(result);
        }
      }
      // -----------------------------------------------------
      else {
        console.error('Unexpected API response structure:', result);
        setError('검색 결과를 처리할 수 없습니다.');
      }
    } catch (err: any) {
      setError(err.message || '검색 중 오류가 발생했습니다.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 결과에서 가게를 선택했을 때의 핸들러
  const handleStoreSelect = (store: Store) => {
    onSelect(store);
  };

  // --- 스와이프 닫기 핸들러 ---
  const handleTouchStart = (e: React.TouchEvent) => {
    // 터치 시작 지점의 Y좌표를 기록
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const scrollableElement = scrollableContentRef.current;

    // 75px 이상 아래로 스와이프했고 (아래로 내렸고),
    // 스크롤 가능한 영역이 존재하지 않거나, 존재하더라도 스크롤이 맨 위(0)일 때만 닫기
    if (deltaY > 75 && (!scrollableElement || scrollableElement.scrollTop === 0)) {
      onClose();
    }
  };
  

  return (
    // 모달 오버레이
    <div
      className="fixed inset-0 z-50 backdrop-brightness-75"
      onClick={onClose} // 배경 클릭 시 닫기
    >
      {/* 모달 컨텐츠 */}
      <div
        className="absolute w-screen bottom-0 top-[30%] bg-white p-6 flex flex-col rounded-t-xl"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart} // 스와이프 시작 이벤트 핸들러
        onTouchEnd={handleTouchEnd}     // 스와이프 끝 이벤트 핸들러
      >
        <h2 className="self-start mb-4 text-lg font-bold">단골 가게 검색</h2>

        {/* 검색창 */}
        <div className="flex items-center w-full gap-2 mb-4 text-gray-500">
          <input
            type="text"
            className="pl-5 rounded-[10px] w-full h-10 bg-gray-100"
            placeholder="가게 이름으로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <img
            src={road_search_button}
            onClick={handleSearch}
            className="flex shrink-0 text-white rounded-[10px] h-10 cursor-pointer"
            alt="검색"
          />
        </div>

        {/* 검색 결과 목록 */}
        <div
          ref={scrollableContentRef}
          className="flex-1 w-full overflow-y-auto"
        >
          {isLoading && (
            <div className="p-4 text-center text-gray-500">검색 중...</div>
          )}
          {error && (
            <div className="p-4 text-center text-red-500">{error}</div>
          )}
          {searchResults.length > 0 && (
            <ul className="w-full bg-white rounded-[10px] shadow-lg border border-gray-200 overflow-hidden">
              {searchResults.map((store) => (
                <li
                  key={store.storeId} // storeId를 key로 사용
                  className="p-3 text-sm text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleStoreSelect(store)}
                >
                  <div className="font-medium text-gray-800">
                    {store.storeName}
                  </div>
                  <div className="text-xs text-gray-500">{store.address}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="px-4 py-2 mt-4 bg-gray-200 rounded hover:bg-gray-300"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default StoreSearchModal;