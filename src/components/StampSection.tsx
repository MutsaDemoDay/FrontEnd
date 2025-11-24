import React, { useState, useRef, useCallback, useEffect } from 'react';
import Plus from '../assets/plus.svg';
import ThreeDots from '../assets/threedots.svg';

// --- 타입 정의 ---

interface StampResponse {
  storeName: string;
  currentCount: number;
  maxCount: number;
  stampImageUrl: string;
}

interface StampCardData {
  id: number;
  name: string;
  currentStamps: number;
  totalStamps: number;
}

// 환경 변수 설정
const API_BASE_URL = import.meta.env.VITE_API_URI || 'http://localhost:8080';
const SWIPE_THRESHOLD = 10;

// ✅ 카드 내부 내용물 컴포넌트 (사진과 동일한 구조)
const StampCardContent = ({
  currentStamps,
  totalStamps,
}: {
  currentStamps: number;
  totalStamps: number;
}) => (
  <div className="w-full h-full px-5 py-4 flex flex-col justify-between bg-white select-none pointer-events-none">
    {/* 1. 스탬프 아이콘 그리드 영역 (상단) */}
    <div className="flex-1 flex items-center justify-center">
      {/* 2줄로 나오게 하기 위해 grid-cols-5 사용 (총 10개 기준) */}
      <div className="grid grid-cols-5 gap-x-4 gap-y-3">
        {Array.from({ length: totalStamps }).map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            {i < currentStamps ? (
              // [채워진 스탬프] - 검은색 라인 or 브랜드 컬러
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-800" // 활성 색상
              >
                {/* 김 모락모락 + 컵 아이콘 */}
                <path
                  d="M18 8H19C20.1046 8 21 8.89543 21 10V12C21 13.1046 20.1046 14 19 14H18V8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 8H18V15C18 17.2091 16.2091 19 14 19H6C3.79086 19 2 17.2091 2 15V8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 1V4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 1V4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 1V4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              // [빈 스탬프] - 연한 회색
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-300" // 비활성 색상
              >
                <path
                  d="M18 8H19C20.1046 8 21 8.89543 21 10V12C21 13.1046 20.1046 14 19 14H18V8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 8H18V15C18 17.2091 16.2091 19 14 19H6C3.79086 19 2 17.2091 2 15V8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 1V4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 1V4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 1V4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* 2. 하단 안내 문구 영역 (회색 알약 모양) */}
    <div className="flex justify-center mt-2">
      <div className="bg-gray-200 rounded-full px-4 py-1.5 flex items-center justify-center w-full max-w-[90%]">
        <span className="text-[10px] text-gray-600 font-bold tracking-tighter">
          스탬프 10개 아메리카노 1잔 무료로 드려요.
        </span>
      </div>
    </div>
  </div>
);

const StampSection = () => {
  // --- 상태 관리 ---
  const [stampCards, setStampCards] = useState<StampCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentY, setCurrentY] = useState(0);

  const totalCardsRef = useRef(0);

  useEffect(() => {
    const fetchStamps = async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);
        const token = localStorage.getItem('accessToken');

        const response = await fetch(`${API_BASE_URL}/v1/users/stamps`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`서버 에러 (${response.status}): ${errorText}`);
        }

        const data: StampResponse[] = await response.json();

        const formattedData: StampCardData[] = data.map((item, index) => ({
          id: index,
          name: item.storeName,
          currentStamps: item.currentCount,
          totalStamps: item.maxCount,
        }));

        setStampCards(formattedData);
        totalCardsRef.current = formattedData.length;
      } catch (error: any) {
        console.error('Failed to fetch stamps:', error);
        setErrorMsg(error.message);
        setStampCards([]);
        totalCardsRef.current = 0;
      } finally {
        setIsLoading(false);
      }
    };

    fetchStamps();
  }, []);

  useEffect(() => {
    totalCardsRef.current = stampCards.length;
  }, [stampCards]);

  // --- 드래그 로직 ---
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);

  const handleDragEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setCurrentY(0);
    window.removeEventListener('mousemove', handleDragMove);
    window.removeEventListener('mouseup', handleDragEnd);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleDragEnd);
  }, []);

  const processMove = (y: number) => {
    const total = totalCardsRef.current;
    if (total === 0) return;

    const deltaY = y - startYRef.current;

    if (deltaY < -SWIPE_THRESHOLD) {
      setActiveIndex((prevIndex) => (prevIndex + 1) % total);
      startYRef.current = y;
      setCurrentY(0);
    } else if (deltaY > SWIPE_THRESHOLD) {
      setActiveIndex((prevIndex) => (prevIndex - 1 + total) % total);
      startYRef.current = y;
      setCurrentY(0);
    } else {
      setCurrentY(deltaY);
    }
  };

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    processMove(e.clientY);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDraggingRef.current) return;
    processMove(e.touches[0].clientY);
  }, []);

  const handleDragStart = (y: number) => {
    if (totalCardsRef.current === 0) return;
    isDraggingRef.current = true;
    startYRef.current = y;
    setCurrentY(0);
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleDragEnd);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-4 h-48 flex items-center justify-center text-gray-400 animate-pulse">
        스탬프 정보를 불러오는 중...
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="bg-white rounded-lg p-4 h-48 flex flex-col items-center justify-center text-red-400 gap-2">
        <p className="text-sm text-center">{errorMsg}</p>
        <p className="text-xs text-gray-400 text-center">
          로그인이 되어있는지 확인해주세요.
        </p>
      </div>
    );
  }

  if (stampCards.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 h-48 flex items-center justify-center text-gray-400">
        진행 중인 스탬프가 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 pb-6 overflow-hidden">
      {/* 섹션 헤더 */}
      {/* <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full border border-gray-200 flex items-center justify-center -translate-x-1"></div>
          <h2 className="font-bold text-lg">
            현재 스탬프({stampCards.length})
          </h2>
        </div>
        <div className="flex gap-2 items-center text-(--fill-color3)">
          <img src={Plus} alt="Plus" className="w-6 h-6" />
          <img src={ThreeDots} alt="ThreeDots" className="w-6 h-6" />
        </div>
      </div> */}

      {/* --- 카드 스택 컨테이너 --- */}
      <div
        className="relative h-56 w-full flex items-center mb-8" // 높이를 살짝 키워서(h-56) 카드가 잘 보이게 조정
        onMouseDown={(e: React.MouseEvent) => handleDragStart(e.clientY)}
        onTouchStart={(e: React.TouchEvent) =>
          handleDragStart(e.touches[0].clientY)
        }
      >
        {/* 왼쪽 배경 장식 (카드 홀더) */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[78px] h-[220px] bg-[#F60] rounded-r-[20px] z-0"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[39px] h-[190px] bg-[#EF6000] rounded-r-[10px] border-r-[3px] border-r-[rgba(0,0,0,0.60)] z-20"></div>

        {/* 실제 카드 스택 */}
        <div
          className={`relative w-[250px] h-[160px] ml-[39px] z-10 ${
            // 카드 크기 조정 (w-250, h-160)
            isDraggingRef.current ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {stampCards.map((card, index) => {
            const total = stampCards.length;
            let offset = index - activeIndex;
            if (offset > total / 2) offset -= total;
            else if (offset < -total / 2) offset += total;

            let translateY, scale, opacity, zIndex, rotate;
            let transformOrigin = 'left center';

            if (offset === 0) {
              // (Active Card)
              translateY = currentY;
              scale = 1;
              opacity = 1;
              zIndex = 10;
              rotate = '0deg';
              transformOrigin = 'center center';
            } else if (offset > 0) {
              // (Future Cards) - 아래쪽으로 쌓임
              const baseTranslateY = 15 * offset; // 간격 조정
              const baseScale = 1 - 0.05 * offset;
              const baseRotate = 3 * offset;
              const progress = Math.min(
                1,
                Math.max(0, -currentY / (SWIPE_THRESHOLD * 1.5))
              );

              translateY = baseTranslateY * (1 - progress);
              scale = baseScale + (1 - baseScale) * progress;
              rotate = `${baseRotate * (1 - progress)}deg`;

              // 뒤에 있는 카드들도 잘 보이도록 opacity를 높게 설정
              opacity = offset <= 3 ? 1 : 0;
              zIndex = 10 - offset;
            } else {
              // (Past Cards) - 위쪽으로 지나감
              const progress = Math.min(
                1,
                Math.max(0, currentY / (SWIPE_THRESHOLD * 1.5))
              );

              const currentOffset = Math.abs(offset);
              const baseTranslateY = -15 * currentOffset;
              const baseScale = 1 - 0.05 * currentOffset;
              const baseRotate = -3 * currentOffset;

              translateY = baseTranslateY + (0 - baseTranslateY) * progress;
              scale = baseScale + (1 - baseScale) * progress;
              rotate = `${baseRotate + (0 - baseRotate) * progress}deg`;

              opacity = currentOffset <= 3 ? 1 : 0;
              zIndex = 5 - currentOffset;
            }

            const transitionClass = isDraggingRef.current
              ? ''
              : 'transition-all duration-500 ease-out';

            return (
              <div
                key={card.id}
                className={`absolute w-full h-full flex-shrink-0 rounded-[12px] shadow-[0_4px_10px_rgba(0,0,0,0.15)] overflow-hidden ${transitionClass}`}
                style={{
                  transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate})`,
                  opacity,
                  zIndex,
                  transformOrigin: transformOrigin,
                }}
              >
                {/* 모든 카드에 컨텐츠 렌더링 */}
                <StampCardContent
                  currentStamps={card.currentStamps}
                  totalStamps={card.totalStamps}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 하단 가게 이름 & 스탬프 개수 (카드 바깥쪽 정보) */}
      {stampCards.length > 0 && (
        <div className="flex flex-col items-center justify-center space-y-1 mt-2">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {/* 커피 아이콘 SVG */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-800"
            >
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
            {stampCards[activeIndex]?.name || ''}
          </h3>
          <p className="text-gray-500 font-medium">
            {stampCards[activeIndex]?.currentStamps}/
            {stampCards[activeIndex]?.totalStamps}
          </p>
        </div>
      )}
    </div>
  );
};

export default StampSection;
