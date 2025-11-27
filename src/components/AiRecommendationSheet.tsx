import React, { useEffect, useState } from 'react';
import axios from 'axios';

// --- 타입 정의 ---
interface StoreInfo {
  name: string;
  address: string;
}

interface RecommendationCategory {
  category: string;
  stores: StoreInfo[];
}

interface AiResponse {
  success: boolean;
  user_id: string;
  recommendations: RecommendationCategory[];
}

export const AiRecommendationSheet = () => {
  const [recommendations, setRecommendations] = useState<StoreInfo[]>([]);
  const [loading, setLoading] = useState(true);
  
  // [추가 1] 시트가 펼쳐져 있는지(true), 접혀 있는지(false) 관리하는 상태
  const [isExpanded, setIsExpanded] = useState(true);

  const fetchAiData = async () => {
    try {
      const apiUri = import.meta.env.VITE_API_URI;
      console.log('AI 추천 데이터 요청 시작...');

      const res = await axios.post<AiResponse>(`${apiUri}/v1/ai/call`, {
        user_id: 4,
        location: {
          latitude: 37.55246607831308,
          longitude: 126.92494649416989,
        },
      });

      console.log('AI 응답 데이터:', res.data);

      if (res.data.success && res.data.recommendations) {
        const allStores = res.data.recommendations.flatMap(
          (category) => category.stores
        );
        setRecommendations(allStores);
      }
    } catch (e) {
      console.error('AI 추천 로드 실패', e);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAiData();
  }, []);

  return (
    <div 
      className={`
        absolute left-0 right-0 bg-white rounded-t-[30px] shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-30 
        transition-transform duration-300 ease-in-out
        ${isExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-60px)]'} 
      `}
      // [설명] isExpanded가 false면 핸들바(60px)만 남기고 아래로 숨김
      style={{ bottom: 0 }} 
    >
      {/* [추가 1] 핸들 바 영역에 클릭 이벤트 추가 
        cursor-pointer를 줘서 클릭 가능함을 표시
      */}
      <div 
        className="w-full flex justify-center pt-3 pb-2 cursor-pointer touch-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-[40px] h-[4px] bg-gray-200 rounded-full" />
      </div>

      {/* [추가 2] 스크롤 영역 제한 (max-h)
        화면의 60%까지만 올라오게 하고, 내용이 많으면 내부 스크롤 발생
        mb-20은 유지하되, 스크롤 영역 밖이 아닌 내부 리스트 끝에 패딩을 주는 것이 안전할 수 있음
        여기서는 요청하신 대로 구조 유지하며 mb-20 적용
      */}
      <div className="px-6 pb-8 pt-2 max-h-[60vh] overflow-y-auto mb-20 scrollbar-hide">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-1">
            AI가 당신의 위치와 취향을 분석해
          </p>
          <h2 className="text-[16px] font-bold text-gray-800">
            맞춤형 가게를 추천해드려요
          </h2>
          <p className='text-sm text-gray-400 mt-2'>
            * AI 추천 결과는 참고용이며, <br />실제 등록이 안 된 가게도 노출될 수 있어요.
          </p>
        </div>

        {/* 로딩 상태 */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2 py-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col space-y-0">
            {recommendations.length > 0 ? (
              recommendations.map((store, idx) => (
                <div
                  key={idx}
                  // [추가 3] 터치 피드백 (active:bg-gray-50) 및 포인터 커서
                  className="flex items-center py-4 border-b border-gray-100 last:border-0 cursor-pointer active:bg-gray-50 transition-colors"
                  onClick={() => {
                    console.log(`${store.name} 클릭됨`);
                    // 여기에 지도 이동 로직 등을 추가할 수 있습니다.
                  }}
                >
                  <div className="w-[44px] h-[44px] bg-[#FFF0E6] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="#FF6B00"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </div>

                  <div className="flex flex-col justify-center">
                    <span className="text-[15px] font-bold text-gray-800 mb-[2px]">
                      {store.name}
                    </span>
                    <span className="text-[13px] text-gray-400 truncate max-w-[250px]">
                      {store.address}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-gray-400 text-sm">
                추천할 가게가 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};