import React, { useState, useEffect } from 'react';
import pinIcon from '../assets/pinIcon.png';
import backbutton3_icon from '../assets/backbutton3_icon.png';
import searchIcon from '../assets/searchIcon.png';

export interface SearchApiResponse {
  storeId: number;
  storeName: string;
  storeAddress: string;
  category: string;
  phone: string;
  storeUrl: string | null;
  stampImageUrl: string | null;
  storeImageUrl: string | null;
  reward: string | null;
  stampReward: string | null;
  sns: string | null;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStore: (storeData: SearchApiResponse) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectStore,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchApiResponse[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // [수정 1] 환경 변수 로드
  const apiUri = import.meta.env.VITE_API_URI;

  // 모달 열릴 때 스크롤 막기 및 초기화
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // 모달이 닫힐 때 검색어와 결과 초기화 (사용자 경험 향상)
      setQuery('');
      setResults([]);
      setHasSearched(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // --- [핵심] 실시간 검색 로직 (디바운싱 적용) ---
  useEffect(() => {
    // 1. 검색어가 없으면 결과 초기화
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    // 2. 0.3초 딜레이 후 API 호출 (디바운싱)
    const debounceTimer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        
        // [수정 2] URL 연결 수정 (apiUri + endpoint)
        // storeName 파라미터가 백엔드와 일치하는지 확인 필수 (storeName vs keyword)
        const response = await fetch(
          `${apiUri}/v1/stores/search?storeName=${encodeURIComponent(query)}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token || ''}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          // [수정 3] 응답 데이터 구조 방어 코드
          // 백엔드가 { data: [...] } 형식이면 data.data, 바로 배열이면 data 사용
          const list = Array.isArray(data) ? data : (data.data || []);
          setResults(list);
        } else {
          console.warn('검색 API 오류:', response.status);
          setResults([]);
        }
      } catch (e) {
        console.error('검색 실패:', e);
        setResults([]);
      } finally {
        setIsLoading(false);
        setHasSearched(true);
      }
    }, 300); 

    return () => clearTimeout(debounceTimer);
  }, [query, apiUri]); // apiUri 의존성 추가

  // 검색어 하이라이팅 함수
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim() || !text) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="text-[#FF6B00] font-bold">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col w-full h-full">
      {/* --- 헤더 영역 --- */}
      <div className="flex items-center gap-3 p-4 bg-white border-b border-gray-100 shrink-0">
        <button onClick={onClose} className="p-2 -ml-2">
          <img src={backbutton3_icon} alt="Back" className="w-[11px] h-[20px]" />
        </button>

        <div className="flex-1 flex items-center bg-gray-100 rounded-[8px] h-[40px] px-3">
          <input
            autoFocus
            type="text"
            className="flex-1 bg-transparent outline-none text-[15px] placeholder-gray-400 text-black"
            placeholder="카페 이름 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        <button
          className="w-[40px] h-[40px] bg-[#FF6B00] rounded-[8px] flex items-center justify-center flex-shrink-0"
        >
          <img
            src={searchIcon}
            alt="Search"
            className="w-5 h-5 brightness-0 invert"
          />
        </button>
      </div>

      {/* --- 컨텐츠 영역 --- */}
      <div className="flex-1 overflow-y-auto bg-white">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-[200px] text-gray-400 text-sm">
            검색중...
          </div>
        )}

        {!hasSearched && !isLoading && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400 text-sm">
            매장 이름을 입력해주세요.
          </div>
        )}

        {!isLoading && hasSearched && results.length > 0 && (
          <ul>
            {results.map((store) => (
              <li
                key={store.storeId}
                className="flex items-start gap-3 p-5 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onSelectStore(store)}
              >
                <div className="w-5 h-5 flex-shrink-0 mt-1">
                  <img
                    src={pinIcon}
                    alt="location"
                    className="w-full h-full object-contain opacity-70"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-[16px] font-medium text-gray-900 leading-tight mb-1">
                    {highlightText(store.storeName, query)}
                  </div>
                  <div className="text-[13px] text-gray-400 font-light">
                    {store.storeAddress}
                  </div>
                  <div className="mt-1">
                    <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {store.category || '기타'}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!isLoading && hasSearched && results.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
            <div className="text-[18px] font-medium text-gray-800 mb-2">
              검색 결과가 없습니다.
            </div>
            <div className="text-[14px] text-gray-500 leading-relaxed">
              매장 이름을 다시 확인해주세요!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};