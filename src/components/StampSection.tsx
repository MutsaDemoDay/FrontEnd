import React, { useState, useRef, useCallback } from 'react';
import Plus from '../assets/plus.svg';
import ThreeDots from '../assets/threedots.svg';

// --- (목데이터) ---
const stampCardsData = [
  { id: 1, name: '카페나무', currentStamps: 7, totalStamps: 10 },
  { id: 2, name: '블루보틀', currentStamps: 3, totalStamps: 10 },
  { id: 3, name: '스타벅스', currentStamps: 10, totalStamps: 10 },
  { id: 4, name: '탐앤탐스', currentStamps: 2, totalStamps: 5 },
  { id: 5, name: '커피빈', currentStamps: 5, totalStamps: 10 },
  { id: 6, name: '할리스', currentStamps: 8, totalStamps: 10 },
  { id: 7, name: '투썸', currentStamps: 6, totalStamps: 10 },
];
const TOTAL_CARDS = stampCardsData.length;
const SWIPE_THRESHOLD = 10; // 스와이프 민감도

/**
 * 스탬프 카드의 내용물
 */
const StampCardContent = ({
  currentStamps,
  totalStamps,
}: {
  currentStamps: number;
  totalStamps: number;
}) => (
  <div className="w-full h-full p-2 flex flex-col justify-center select-none pointer-events-none">
    <div className="grid grid-cols-5 gap-1">
      {Array.from({ length: totalStamps }).map((_, i) => (
        <div
          key={i}
          className={`w-5 h-5 rounded-full border-2 ${
            i < currentStamps
              ? 'border-orange-500 bg-orange-100'
              : 'border-dashed border-gray-300'
          } flex items-center justify-center`}
        >
          {i < currentStamps ? (
            <svg // w-4 h-4
              className="w-4 h-4 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          )}
        </div>
      ))}
    </div>
    {/* 게이지 바 */}
    {/* <div className="h-1 bg-gray-200 rounded-full mt-2 w-full">
      <div
        className="h-full bg-orange-500 rounded-full"
        style={{ width: `${(currentStamps / totalStamps) * 100}%` }}
      ></div>
    </div> */}
  </div>
);

const StampsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentY, setCurrentY] = useState(0);

  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);

  // --- 드래그 로직 (이전과 동일) ---
  const handleDragEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setCurrentY(0);
    window.removeEventListener('mousemove', handleDragMove);
    window.removeEventListener('mouseup', handleDragEnd);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleDragEnd);
  }, []);

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    processMove(e.clientY);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDraggingRef.current) return;
    processMove(e.touches[0].clientY);
  }, []);

  const processMove = (y: number) => {
    const deltaY = y - startYRef.current;
    if (deltaY < -SWIPE_THRESHOLD) {
      setActiveIndex((prevIndex) => (prevIndex + 1) % TOTAL_CARDS);
      startYRef.current = y;
      setCurrentY(0);
    } else if (deltaY > SWIPE_THRESHOLD) {
      setActiveIndex(
        (prevIndex) => (prevIndex - 1 + TOTAL_CARDS) % TOTAL_CARDS
      );
      startYRef.current = y;
      setCurrentY(0);
    } else {
      setCurrentY(deltaY);
    }
  };

  const handleDragStart = (y: number) => {
    isDraggingRef.current = true;
    startYRef.current = y;
    setCurrentY(0);
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleDragEnd);
  };
  // --- 드래그 로직 끝 ---

  return (
    <div className="bg-white rounded-lg p-4 overflow-hidden">
      {/* 섹션 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full border border-gray-200 flex items-center justify-center -translate-x-1"></div>
          <h2 className="font-bold text-lg">현재 스탬프({TOTAL_CARDS})</h2>
        </div>
        <div className="flex gap-2 items-center text-gray-400">
          <img src={Plus} alt="Plus" className="w-6 h-6" />
          <img src={ThreeDots} alt="ThreeDots" className="w-6 h-6" />
        </div>
      </div>

      {/* --- 카드 스택 컨테이너 --- */}
      <div
        className="relative h-48 w-full flex items-center"
        onMouseDown={(e: React.MouseEvent) => handleDragStart(e.clientY)}
        onTouchStart={(e: React.TouchEvent) =>
          handleDragStart(e.touches[0].clientY)
        }
      >
        {/* 옅은 주황색 홀더 */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[78px] h-[198px] bg-[#F60] rounded-r-[20px] z-0"></div>

        {/* 짙은 주황색 홀더 */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[39px] h-[172px] bg-[#EF6000] rounded-r-[10px] border-r-[3px] border-r-[rgba(0,0,0,0.60)] z-20"></div>

        {/* 카드 스택 */}
        <div
          className={`relative w-[230.51px] h-[74.879px] ml-[39px] z-10 ${
            isDraggingRef.current ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {stampCardsData.map((card, index) => {
            let offset = index - activeIndex;
            if (offset > TOTAL_CARDS / 2) offset -= TOTAL_CARDS;
            else if (offset < -TOTAL_CARDS / 2) offset += TOTAL_CARDS;

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
              // (Future Cards - 아래에 쌓임)
              const baseTranslateY = 10 * offset;
              const baseScale = 1 - 0.05 * offset;
              const baseRotate = 4 * offset;
              const progress = Math.min(
                1,
                Math.max(0, -currentY / (SWIPE_THRESHOLD * 1.5))
              );

              translateY = baseTranslateY * (1 - progress);
              scale = baseScale + (1 - baseScale) * progress;
              rotate = `${baseRotate * (1 - progress)}deg`;

              opacity = offset <= 2 ? 0.8 - 0.4 * (offset - 1) : 0;
              zIndex = 10 - offset;
            } else {
              // (Past Cards - "위에" 있는 카드)
              const progress = Math.min(
                1,
                Math.max(0, currentY / (SWIPE_THRESHOLD * 1.5))
              );

              const currentOffset = Math.abs(offset);
              const baseTranslateY = -10 * currentOffset;
              const baseScale = 1 - 0.05 * currentOffset;
              const baseRotate = -4 * currentOffset;

              translateY = baseTranslateY + (0 - baseTranslateY) * progress;
              scale = baseScale + (1 - baseScale) * progress;
              rotate = `${baseRotate + (0 - baseRotate) * progress}deg`;

              opacity =
                currentOffset <= 2 ? 0.8 - 0.4 * (currentOffset - 1) : 0;
              zIndex = 5 - currentOffset;
            }

            const transitionClass = isDraggingRef.current
              ? ''
              : 'transition-all duration-500 ease-out';

            return (
              <div
                key={card.id}
                className={`absolute w-full h-full flex-shrink-0 bg-white rounded-[5px] shadow-[4px_4px_8px_6px_rgba(0,0,0,0.10)] overflow-hidden ${transitionClass}`}
                style={{
                  transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate})`,
                  opacity,
                  zIndex,
                  transformOrigin: transformOrigin,
                }}
              >
                {/* 활성 카드(offset === 0)일 때만 내용물 렌더링 */}
                {offset === 0 ? (
                  <StampCardContent
                    currentStamps={card.currentStamps}
                    totalStamps={card.totalStamps}
                  />
                ) : null}
              </div>
            );
          })}
        </div>

        {/* 활성화된 카드 이름 */}
        <h3
          className="absolute font-bold text-lg text-gray-800 pointer-events-none z-30"
          style={{
            left: 'calc(39px + 230.51px + 16px)',
            top: '50%',
            transform: `translateY(calc(-50% + ${currentY}px))`,
          }}
        >
          {stampCardsData[activeIndex].name}
        </h3>
      </div>
    </div>
  );
};

export default StampsSection;
