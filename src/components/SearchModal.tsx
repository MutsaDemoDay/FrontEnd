import React, { useState, useEffect } from 'react';
import pinIcon from '../assets/pinIcon.png'; 
import backbutton3_icon from '../assets/backbutton3_icon.png';

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

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectStore }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchApiResponse[]>([]);
  const [hasSearched, setHasSearched] = useState(false); // 검색 실행 여부 체크

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // 모달 닫힐 때 상태 초기화 (원하시면 주석 해제)
      // setQuery('');
      // setResults([]);
      // setHasSearched(false);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await fetch(`/api/v1/stores/search?storeName=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        setResults([]);
      }
    } catch (e) {
      console.error(e);
      setResults([]);
    } finally {
      setHasSearched(true);
    }
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="text-(--main-color) font-bold">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col w-full h-full">
      {/* 헤더 */}
      <div className="flex items-center gap-3 p-4 bg-white border-b border-gray-100">
        <button onClick={onClose} className="flex w-[11px] h-[20px]">
          <img src={backbutton3_icon} alt="Back" className="w-[11px] h-[20px]" />
        </button>
      </div>

      {/* 컨텐츠 */}
      <div className="flex-1 p-3 overflow-y-auto bg-white">
        <div className='flex flex-row gap-3'>
            <div className="flex-1 flex items-center bg-gray-100 rounded-[8px] h-[45px] overflow-hidden">
          <input
            autoFocus
            type="text"
            className="flex-1 bg-transparent outline-none px-4 text-[15px] placeholder-gray-400"
            placeholder="지역, 건물, 주소 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <button 
          onClick={handleSearch}
          className="w-[45px] h-[45px] bg-(--main-color) rounded-[8px] flex items-center justify-center flex-shrink-0"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        </div>
        
        {/* Case 1: 검색 전 (안내 문구 또는 빈 화면) */}
        {!hasSearched && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400 text-sm">
            검색어를 입력해주세요.
          </div>
        )}

        {/* Case 2: 검색 결과 리스트 */}
        {hasSearched && results.length > 0 && (
          <ul>
            {results.map((store) => (
              <li
                key={store.storeId}
                className="flex items-center gap-3 p-5 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onSelectStore(store)}
              >
                <div className="w-5 h-[18px] flex-shrink-0 mt-1 mr-4">
                   <img src={pinIcon} alt="location" className="w-full h-full object-contain opacity-70" />
                </div>
                <div className="flex flex-col">
                  <div className="text-[16px] font-medium text-gray-900">
                    {highlightText(store.storeName, query)}
                  </div>
                  <div className="text-[13px] text-gray-400 font-light">
                    {store.storeAddress}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Case 3: 결과 없음 */}
        {hasSearched && results.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
            <div className="text-[18px] font-medium text-gray-800 mb-2">
              검색 결과가 없습니다.
            </div>
            <div className="text-[14px] text-gray-500 leading-relaxed">
              검색어가 올바르지 않거나,<br/>
              해당 매장이 제휴매장이 아닐 수도 있어요!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};