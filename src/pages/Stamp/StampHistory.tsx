import { useState, useRef } from 'react';
import BackButton from '../../components/BackButton';

// Assets
import UploadIcon from '../../assets/upload.svg';
import RightCircleIcon from '../../assets/rightcircle.svg';

// --- [아이콘 컴포넌트] ---
const StampIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 8H19C20.1046 8 21 8.89543 21 10V11C21 12.1046 20.1046 13 19 13H18V8Z"
      stroke="#555"
      strokeWidth="1.5"
    />
    <path
      d="M6 8H18V17C18 19.2091 16.2091 21 14 21H10C7.79086 21 6 19.2091 6 17V8Z"
      stroke="#555"
      strokeWidth="1.5"
    />
    <path
      d="M9.5 4C9.5 4 9 5.5 10.5 5.5C12 5.5 11.5 4 11.5 4"
      stroke="#555"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12.5 3C12.5 3 12 4.5 13.5 4.5C15 4.5 14.5 3 14.5 3"
      stroke="#555"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// --- [데이터 타입] ---
interface HistoryItem {
  id: number;
  date: string;
  cafeName: string;
  address: string;
}

const StampHistory = () => {
  // --- [데이터] ---
  const historyData: HistoryItem[] = [
    {
      id: 1,
      date: '2025.01.01',
      cafeName: '열공커피 홍대입구역점',
      address: '서울특별 마포구 와우산로 1831',
    },
    {
      id: 2,
      date: '2024.12.25',
      cafeName: '카페나무 강남점',
      address: '강남구 테헤란로 123',
    },
    {
      id: 3,
      date: '2024.11.11',
      cafeName: '스탠스커피',
      address: '마포구 양화로 45',
    },
    {
      id: 4,
      date: '2024.10.31',
      cafeName: '카페드림',
      address: '서대문구 연세로 50',
    },
    {
      id: 5,
      date: '2024.09.15',
      cafeName: '블루보틀 성수',
      address: '성동구 아차산로 7',
    },
    {
      id: 6,
      date: '2024.08.20',
      cafeName: '스타벅스 리저브',
      address: '종로구 종로 51',
    },
    {
      id: 7,
      date: '2024.07.07',
      cafeName: '이디야 커피',
      address: '강서구 공항대로 100',
    },
    {
      id: 8,
      date: '2024.06.01',
      cafeName: '투썸플레이스',
      address: '영등포구 여의대로 1',
    },
  ];

  // --- [상태 관리] ---
  const [currentIndex, setCurrentIndex] = useState(1000);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startX = useRef<number | null>(null);

  // --- [Helper] ---
  const getItem = (index: number) => {
    const len = historyData.length;
    const wrappedIndex = ((index % len) + len) % len;
    return historyData[wrappedIndex];
  };

  // --- [드래그 이벤트 핸들러] ---
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    startX.current = clientX;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || startX.current === null) return;
    const currentDrag = clientX - startX.current;
    setDragOffset(currentDrag);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    startX.current = null;

    const MOVE_THRESHOLD = 80;
    const movedCards = -Math.round(dragOffset / MOVE_THRESHOLD);

    setCurrentIndex((prev) => prev + movedCards);
    setDragOffset(0);
  };

  // --- [계산 로직] ---
  const MOVE_THRESHOLD = 80;
  const virtualIndex = currentIndex - dragOffset / MOVE_THRESHOLD;

  const currentDisplayIndex = Math.round(virtualIndex);
  const currentItem = getItem(currentDisplayIndex);

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden select-none font-sans">
      {/* 상단 배경 그라데이션 */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white to-gray-50 z-0 pointer-events-none" />

      {/* Header */}
      <div className="px-5 py-4 flex items-center relative z-10 bg-transparent">
        <BackButton />
        <h1 className="text-lg font-bold text-gray-800 ml-2">
          스탬프 히스토리
        </h1>
      </div>

      {/* Info Section */}
      <div className="px-5 mt-2 relative z-10 flex flex-col items-center">
        <div className="absolute right-5 top-0">
          <button className="p-1">
            <img src={UploadIcon} alt="share" className="w-6 h-6 opacity-40" />
          </button>
        </div>

        <div className="text-center mt-6 transition-all duration-300">
          <h2 className="text-[22px] font-bold text-gray-800 leading-tight mb-2">
            총 <span className="text-[#FF6B00]">{historyData.length}장</span>의
            <br />
            스탬프 완료!
          </h2>
          <p className="text-[11px] text-gray-400 mb-8 leading-snug">
            최근 1년까지의 스탬프 히스토리를 조회할 수 있어요.
            <br />
            1년 이전의 내역은 고객센터로 문의해주세요.
          </p>

          {/* Dynamic Info Area */}
          <div className="mb-4 animate-fade-in flex flex-col items-center">
            <p className="text-xs text-gray-500 font-medium mb-1">
              {currentItem.date}
            </p>
            <div className="flex items-center justify-center gap-1 mb-1">
              <h3 className="text-lg font-extrabold text-gray-900">
                {currentItem.cafeName}
              </h3>
              <img
                src={RightCircleIcon}
                alt="go"
                className="w-4 h-4 opacity-60"
              />
            </div>
            <p className="text-[11px] text-gray-400">{currentItem.address}</p>
          </div>
        </div>
      </div>

      {/* Card Fan Area */}
      <div
        className="flex-1 relative flex items-end justify-center pb-10 overflow-hidden cursor-grab active:cursor-grabbing z-10"
        onTouchStart={(e) => handleStart(e.targetTouches[0].clientX)}
        onTouchMove={(e) => handleMove(e.targetTouches[0].clientX)}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        {/* 하단 오렌지 배경 그라데이션 */}
        <div className="absolute bottom-0 left-0 w-full h-[70%] bg-gradient-to-t from-[#FF9F65] via-[#FFD1B0] to-transparent opacity-90 pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-10 pointer-events-none -z-10"></div>

        {/* Cards Container */}
        <div className="relative w-[160px] h-[250px] mb-12">
          {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((offsetStep) => {
            const baseIndex = Math.floor(virtualIndex);
            const renderIndex = baseIndex + offsetStep;
            const offset = renderIndex - virtualIndex;

            if (offset < -3.8 || offset > 3.8) return null;

            // const item = getItem(renderIndex);
            const absOffset = Math.abs(offset);

            // [핵심 변경] 아주 촘촘한 부채꼴
            // 1. 가로 간격(translateX): 10px (거의 겹침)
            // 2. 회전 각도(rotate): 5도 (살짝만 비틀기)
            // 3. 높이 차이(translateY): 아주 미세하게만 (거의 같은 높이)
            const translateX = offset * 10;
            const translateY = absOffset * 2;
            const rotate = offset * 5;
            const scale = 1 - absOffset * 0.05;
            const zIndex = 50 - Math.round(absOffset * 10);

            return (
              <div
                key={`card-${renderIndex}`}
                className="absolute top-0 left-0 w-full h-full will-change-transform origin-bottom"
                style={{
                  zIndex: zIndex,
                  transform: `
                    translateX(${translateX}px) 
                    translateY(${translateY}px) 
                    rotate(${rotate}deg) 
                    scale(${scale})
                  `,
                  transition: isDragging
                    ? 'none'
                    : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  opacity: absOffset > 2.5 ? 0.5 : 1,
                }}
              >
                {/* Card Content */}
                <div className="w-full h-full bg-white rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.1)] border border-gray-100 p-3 flex relative overflow-hidden">
                  {/* Left Gray Pill */}
                  <div className="w-7 h-full bg-[#F3F4F6] rounded-full flex items-center justify-center shrink-0 py-2">
                    <span
                      className="text-[8px] text-gray-400 font-medium tracking-tighter whitespace-nowrap"
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                      }}
                    >
                      스탬프 10개 적립시 1잔 무료로 드려요
                    </span>
                  </div>

                  {/* Stamp Grid */}
                  <div className="flex-1 pl-2 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-x-3 gap-y-5">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-center opacity-80"
                        >
                          <StampIcon />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Glossy Effect */}
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-white/30 to-white/60 opacity-50 pointer-events-none rounded-2xl"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StampHistory;
