import React, { useEffect, useState } from 'react';
import axios from 'axios';

// --- 타입 정의 (API 명세 준수) ---
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

// --- 🔥 [MOCK DATA] 마포구 실제 카페 데이터 ---
const MOCK_AI_DATA: AiResponse = {
  success: true,
  user_id: "mock_user",
  recommendations: [
    {
      category: "AI 추천 카페", // 카테고리 이름은 UI에 표시 안될 수도 있지만 구조 유지
      stores: [
        {
          name: "앤트러사이트 합정점",
          address: "서울 마포구 토정로5길 10",
        },
        {
          name: "프릳츠 도화점",
          address: "서울 마포구 새창로2길 17",
        },
        {
          name: "테일러커피 서교점",
          address: "서울 마포구 와우산로33길 46",
        },
        {
          name: "커피리브레 연남점",
          address: "서울 마포구 성미산로 198",
        },
        {
          name: "망원동내커피",
          address: "서울 마포구 월드컵로13길 55-24",
        },
      ],
    },
  ],
};

const USE_MOCK = true;

export const AiRecommendationSheet = () => {
  const [recommendations, setRecommendations] = useState<StoreInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // API 호출 함수
  const fetchAiData = async () => {
    try {
      if (USE_MOCK) {
        // 가짜 딜레이 후 데이터 세팅
        setTimeout(() => {
          // 구조상 첫 번째 카테고리의 상점들을 가져온다고 가정
          const stores = MOCK_AI_DATA.recommendations[0]?.stores || [];
          setRecommendations(stores);
          setLoading(false);
        }, 800);
        return;
      }

      // 실제 API 호출 (작동 안하겠지만 코드 유지)
      const apiUri = import.meta.env.VITE_API_URI;
      const res = await axios.post<AiResponse>(`${apiUri}/v1/ai/call`, {
        user_id: 1, // 예시 ID
        location: {
          latitude: 37.556, // 예시: 마포구 위도
          longitude: 126.904, // 예시: 마포구 경도
        },
      });

      if (res.data.success && res.data.recommendations.length > 0) {
        setRecommendations(res.data.recommendations[0].stores);
      }
    } catch (e) {
      console.error("AI 추천 로드 실패", e);
      // 에러 나면 목데이터 보여줄지 결정 (여기선 빈배열 처리)
      setRecommendations([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAiData();
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[30px] shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-30 transition-transform duration-300">
      {/* 핸들 바 */}
      <div className="w-full flex justify-center pt-3 pb-2">
        <div className="w-[40px] h-[4px] bg-gray-200 rounded-full" />
      </div>

      <div className="px-6 pb-8 pt-2">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-1">
            AI가 당신의 등록 카페 유형과 거리 등을 고려해
          </p>
          <h2 className="text-[16px] font-bold text-gray-800">
            맞춤형 카페 5곳을 추천해드려요
          </h2>
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
            {recommendations.map((store, idx) => (
              <div
                key={idx}
                className="flex items-center py-4 border-b border-gray-100 last:border-0"
              >
                {/* 주황색 별 아이콘 원 */}
                <div className="w-[44px] h-[44px] bg-[#FFF0E6] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  {/* 별 아이콘 (SVG) */}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};