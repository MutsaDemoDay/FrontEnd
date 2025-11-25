// import React, { useState, useRef, useCallback, useEffect } from 'react';
// // import Plus from '../assets/plus.svg';
// // import ThreeDots from '../assets/threedots.svg';

// // ==========================================
// // ✅ 1. StampCard 컴포넌트 (UI 표시용)
// // ==========================================

// export interface StampData {
//   storeName: string;
//   currentCount: number;
//   maxCount: number;
//   stampImageUrl: string;
// }

// interface StampCardProps {
//   data: StampData | null;
//   currentIndex?: number; // 페이지네이션 표시용 (선택사항)
//   totalLength?: number; // 페이지네이션 표시용 (선택사항)
// }

// const StampCard = ({
//   data,
//   currentIndex = 0,
//   totalLength = 0,
// }: StampCardProps) => {
//   // 데이터가 없을 경우
//   if (!data) {
//     return (
//       <div className="bg-white rounded-2xl p-5 shadow-sm h-[100px] flex items-center justify-center text-gray-400 text-sm border border-gray-100">
//         적립된 스탬프 정보가 없습니다.
//       </div>
//     );
//   }

//   // 남은 개수 계산 (음수 방지)
//   const remaining = Math.max(0, data.maxCount - data.currentCount);

//   return (
//     <div className="bg-white rounded-2xl p-5 shadow-[0_2px_15px_rgba(0,0,0,0.08)] relative overflow-hidden border border-gray-100">
//       <div className="flex justify-between items-center pb-4">
//         {/* Left Text Section */}
//         <div>
//           <p className="text-gray-800 text-sm mb-1">
//             {data.storeName}{' '}
//             <span className="font-bold">
//               {remaining > 0 ? `${remaining}잔 더` : '스탬프 완료!'}
//             </span>
//           </p>
//           <div className="flex items-end gap-1">
//             <span className="text-[#FF6B00] font-bold text-xl">
//               {data.currentCount}/{data.maxCount}
//             </span>
//             <span className="text-gray-400 text-xs mb-1">개 현재 적립</span>
//           </div>
//         </div>

//         {/* Right Arrow Button */}
//         <button className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
//           <svg
//             width="6"
//             height="10"
//             viewBox="0 0 6 10"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M1 9L5 5L1 1"
//               stroke="#9CA3AF"
//               strokeWidth="1.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         </button>
//       </div>

//       {/* Pagination Dots (현재 위치 반영) */}
//       {totalLength > 1 && (
//         <div className="flex justify-center items-center space-x-1 absolute bottom-2 left-0 right-0">
//           {Array.from({ length: Math.min(5, totalLength) }).map((_, i) => (
//             <div
//               key={i}
//               className={`rounded-full transition-all duration-300 ${
//                 // 간단한 로직: 인덱스가 일치하면 활성화 (5개 이상일 경우 로직 고도화 필요하지만 여기선 단순화)
//                 i === currentIndex % 5
//                   ? 'w-3 h-1 bg-gray-600'
//                   : 'w-1 h-1 bg-gray-200'
//               }`}
//             ></div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // ==========================================
// // ✅ 2. StampSection 내부 로직
// // ==========================================

// // API 응답 타입
// interface StampResponse {
//   storeName: string;
//   currentCount: number;
//   maxCount: number;
//   stampImageUrl: string;
// }

// // 내부 상태용 데이터 타입
// interface StampCardData {
//   id: number;
//   name: string;
//   currentStamps: number;
//   totalStamps: number;
// }

// // 환경 변수 설정
// const API_BASE_URL = import.meta.env.VITE_API_URI || 'http://localhost:8080';
// const SWIPE_THRESHOLD = 50;
// const DAMPING_FACTOR = 0.7;

// // 카드 내부 내용물 (스탬프 도장 찍히는 3D 카드)
// const StampCardContent = ({
//   currentStamps,
//   totalStamps,
// }: {
//   currentStamps: number;
//   totalStamps: number;
// }) => (
//   <div className="w-full h-full px-5 py-4 flex flex-col justify-between bg-white select-none pointer-events-none">
//     <div className="flex-1 flex items-center justify-center">
//       <div className="grid grid-cols-5 gap-x-4 gap-y-3">
//         {Array.from({ length: totalStamps }).map((_, i) => (
//           <div key={i} className="flex items-center justify-center">
//             {i < currentStamps ? (
//               <svg
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="text-gray-800"
//               >
//                 <path
//                   d="M18 8H19C20.1046 8 21 8.89543 21 10V12C21 13.1046 20.1046 14 19 14H18V8Z"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M2 8H18V15C18 17.2091 16.2091 19 14 19H6C3.79086 19 2 17.2091 2 15V8Z"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M6 1V4"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M10 1V4"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M14 1V4"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             ) : (
//               <svg
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="text-gray-300"
//               >
//                 <path
//                   d="M18 8H19C20.1046 8 21 8.89543 21 10V12C21 13.1046 20.1046 14 19 14H18V8Z"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M2 8H18V15C18 17.2091 16.2091 19 14 19H6C3.79086 19 2 17.2091 2 15V8Z"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M6 1V4"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M10 1V4"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M14 1V4"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//     <div className="flex justify-center mt-2">
//       <div className="bg-gray-200 rounded-full px-4 py-1.5 flex items-center justify-center w-full max-w-[90%]">
//         <span className="text-[10px] text-gray-600 font-bold tracking-tighter">
//           스탬프 {totalStamps}개 모으면 무료 쿠폰!
//         </span>
//       </div>
//     </div>
//   </div>
// );

// const StampSection = () => {
//   // --- 상태 관리 ---
//   const [stampCards, setStampCards] = useState<StampCardData[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [currentY, setCurrentY] = useState(0);

//   const totalCardsRef = useRef(0);

//   // --- 데이터 페칭 ---
//   useEffect(() => {
//     const fetchStamps = async () => {
//       try {
//         setIsLoading(true);
//         setErrorMsg(null);
//         const token =
//           localStorage.getItem('accessToken') || localStorage.getItem('token');

//         const response = await fetch(`${API_BASE_URL}/v1/users/stamps`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             ...(token && { Authorization: `Bearer ${token}` }),
//           },
//         });

//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(`서버 에러 (${response.status}): ${errorText}`);
//         }

//         const data: StampResponse[] = await response.json();

//         const formattedData: StampCardData[] = data.map((item, index) => ({
//           id: index,
//           name: item.storeName,
//           currentStamps: item.currentCount,
//           totalStamps: item.maxCount,
//         }));

//         setStampCards(formattedData);
//         totalCardsRef.current = formattedData.length;
//       } catch (error: any) {
//         console.error('Failed to fetch stamps:', error);
//         setErrorMsg(error.message);
//         setStampCards([]);
//         totalCardsRef.current = 0;
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchStamps();
//   }, []);

//   useEffect(() => {
//     totalCardsRef.current = stampCards.length;
//   }, [stampCards]);

//   // --- 드래그 로직 ---
//   const isDraggingRef = useRef(false);
//   const startYRef = useRef(0);

//   const handleDragEnd = useCallback(() => {
//     if (!isDraggingRef.current) return;
//     isDraggingRef.current = false;
//     setCurrentY(0);

//     window.removeEventListener('mousemove', handleDragMove);
//     window.removeEventListener('mouseup', handleDragEnd);
//     window.removeEventListener('touchmove', handleTouchMove);
//     window.removeEventListener('touchend', handleDragEnd);
//   }, []);

//   const processMove = (y: number) => {
//     const total = totalCardsRef.current;
//     if (total === 0) return;

//     const rawDeltaY = y - startYRef.current;
//     const dampedDeltaY = rawDeltaY * DAMPING_FACTOR;

//     if (dampedDeltaY < -SWIPE_THRESHOLD) {
//       setActiveIndex((prevIndex) => (prevIndex + 1) % total);
//       startYRef.current = y;
//       setCurrentY(0);
//     } else if (dampedDeltaY > SWIPE_THRESHOLD) {
//       setActiveIndex((prevIndex) => (prevIndex - 1 + total) % total);
//       startYRef.current = y;
//       setCurrentY(0);
//     } else {
//       setCurrentY(dampedDeltaY);
//     }
//   };

//   const handleDragMove = useCallback((e: MouseEvent) => {
//     if (!isDraggingRef.current) return;
//     e.preventDefault();
//     processMove(e.clientY);
//   }, []);

//   const handleTouchMove = useCallback((e: TouchEvent) => {
//     if (!isDraggingRef.current) return;
//     if (e.cancelable) e.preventDefault();
//     processMove(e.touches[0].clientY);
//   }, []);

//   const handleDragStart = (y: number) => {
//     if (totalCardsRef.current === 0) return;
//     isDraggingRef.current = true;
//     startYRef.current = y;
//     setCurrentY(0);

//     window.addEventListener('mousemove', handleDragMove);
//     window.addEventListener('mouseup', handleDragEnd);
//     window.addEventListener('touchmove', handleTouchMove, { passive: false });
//     window.addEventListener('touchend', handleDragEnd);
//   };

//   // --- 렌더링 준비 ---
//   // ✅ 현재 활성화된 카드 데이터를 StampCard용 포맷으로 변환
//   const currentStampData =
//     stampCards.length > 0 ? stampCards[activeIndex] : null;

//   const stampCardProps: StampData | null = currentStampData
//     ? {
//         storeName: currentStampData.name,
//         currentCount: currentStampData.currentStamps,
//         maxCount: currentStampData.totalStamps,
//         stampImageUrl: '', // 이미지가 있다면 여기에 매핑
//       }
//     : null;

//   // --- UI 렌더링 ---
//   if (isLoading) {
//     return (
//       <div className="bg-white rounded-lg p-4 h-48 flex items-center justify-center text-gray-400 animate-pulse">
//         스탬프 정보를 불러오는 중...
//       </div>
//     );
//   }

//   if (errorMsg) {
//     return (
//       <div className="bg-white rounded-lg p-4 h-48 flex flex-col items-center justify-center text-red-400 gap-2">
//         <p className="text-sm text-center">{errorMsg}</p>
//         <p className="text-xs text-gray-400 text-center">로그인 확인 필요</p>
//       </div>
//     );
//   }

//   if (stampCards.length === 0) {
//     return (
//       <div className="bg-white rounded-lg p-4 h-48 flex items-center justify-center text-gray-400">
//         진행 중인 스탬프가 없습니다.
//       </div>
//     );
//   }

//   return (
//     <div className="rounded-lg pb-6 overflow-hidden">
//       {' '}
//       {/* bg-white 제거 (상위에서 처리하거나 필요시 추가) */}
//       {/* 1. 3D 카드 스택 (드래그 영역) */}
//       <div
//         className="relative h-56 w-full flex items-center mb-4 touch-none"
//         onMouseDown={(e: React.MouseEvent) => handleDragStart(e.clientY)}
//         onTouchStart={(e: React.TouchEvent) =>
//           handleDragStart(e.touches[0].clientY)
//         }
//       >
//         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[78px] h-[220px] bg-[#F60] rounded-r-[20px] z-0"></div>
//         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[39px] h-[190px] bg-[#EF6000] rounded-r-[10px] border-r-[3px] border-r-[rgba(0,0,0,0.60)] z-20"></div>

//         <div
//           className={`relative w-[250px] h-[160px] ml-[39px] z-10 ${
//             isDraggingRef.current ? 'cursor-grabbing' : 'cursor-grab'
//           }`}
//         >
//           {stampCards.map((card, index) => {
//             const total = stampCards.length;
//             let offset = index - activeIndex;
//             if (offset > total / 2) offset -= total;
//             else if (offset < -total / 2) offset += total;

//             let translateY, scale, opacity, zIndex, rotate;
//             const animationProgressDenom = SWIPE_THRESHOLD * 2;

//             if (offset === 0) {
//               translateY = currentY;
//               scale = 1;
//               opacity = 1;
//               zIndex = 10;
//               rotate = '0deg';
//             } else if (offset > 0) {
//               const progress = Math.min(
//                 1,
//                 Math.max(0, -currentY / animationProgressDenom)
//               );
//               translateY = 15 * offset * (1 - progress);
//               scale = 1 - 0.05 * offset + 0.05 * offset * progress;
//               rotate = `${3 * offset * (1 - progress)}deg`;
//               opacity = offset <= 3 ? 1 : 0;
//               zIndex = 10 - offset;
//             } else {
//               const progress = Math.min(
//                 1,
//                 Math.max(0, currentY / animationProgressDenom)
//               );
//               const currentOffset = Math.abs(offset);
//               const baseTranslateY = -15 * currentOffset;
//               translateY = baseTranslateY + (0 - baseTranslateY) * progress;
//               scale =
//                 1 - 0.05 * currentOffset + 0.05 * currentOffset * progress;
//               rotate = `${
//                 -3 * currentOffset + 3 * currentOffset * progress
//               }deg`;
//               opacity = currentOffset <= 3 ? 1 : 0;
//               zIndex = 5 - currentOffset;
//             }

//             return (
//               <div
//                 key={card.id}
//                 className={`absolute w-full h-full flex-shrink-0 rounded-[12px] shadow-[0_4px_10px_rgba(0,0,0,0.15)] overflow-hidden ${
//                   isDraggingRef.current
//                     ? ''
//                     : 'transition-all duration-500 ease-out'
//                 }`}
//                 style={{
//                   transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate})`,
//                   opacity,
//                   zIndex,
//                   transformOrigin:
//                     offset === 0 ? 'center center' : 'left center',
//                 }}
//               >
//                 <StampCardContent
//                   currentStamps={card.currentStamps}
//                   totalStamps={card.totalStamps}
//                 />
//               </div>
//             );
//           })}
//         </div>
//       </div>
//       {/* 2. 하단 StampCard (현재 활성화된 카드 정보 연동) */}
//       <div className="px-1">
//         <StampCard
//           data={stampCardProps}
//           currentIndex={activeIndex}
//           totalLength={stampCards.length}
//         />
//       </div>
//     </div>
//   );
// };

// export default StampSection;

import React, { useState, useRef, useCallback, useEffect } from 'react';

// ==========================================
// ✅ 1. StampCard 컴포넌트 (UI 표시용 - 디자인 수정됨)
// ==========================================

export interface StampData {
  storeName: string;
  currentCount: number;
  maxCount: number;
  stampImageUrl: string;
}

interface StampCardProps {
  data: StampData | null;
  currentIndex?: number; // 페이지네이션 표시용
  totalLength?: number; // 페이지네이션 표시용
}

const StampCard = ({
  data,
  currentIndex = 0,
  totalLength = 0,
}: StampCardProps) => {
  // 데이터가 없을 경우
  if (!data) {
    return (
      <div className="bg-white rounded-[24px] p-6 shadow-sm h-[100px] flex items-center justify-center text-gray-400 text-sm border border-gray-100">
        적립된 스탬프 정보가 없습니다.
      </div>
    );
  }

  // 남은 개수 계산 (음수 방지)
  const remaining = Math.max(0, data.maxCount - data.currentCount);

  return (
    <div className="bg-white rounded-[24px] px-6 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] relative border border-gray-100/50">
      <div className="flex justify-between items-center pb-3">
        {/* Left Text Section */}
        <div>
          <p className="text-gray-500 text-[13px] tracking-tight mb-0.5">
            이 카페{' '}
            <span className="font-bold text-gray-900">{remaining}잔 더</span>{' '}
            적립하면 스탬프 완성!
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[#FF6B00] font-bold text-[28px] leading-tight font-sans">
              {data.currentCount}/{data.maxCount}
            </span>
            <span className="text-gray-400 text-[13px] font-medium">
              개 현재 적립
            </span>
          </div>
        </div>

        {/* Right Arrow Button */}
        <button className="w-10 h-10 bg-[#F2F4F6] rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0 ml-4">
          <svg
            width="8"
            height="14"
            viewBox="0 0 8 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 13L7 7L1 1"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Pagination Dots */}
      {totalLength > 1 && (
        <div className="flex justify-center items-center gap-1.5 absolute bottom-3 left-0 right-0">
          {Array.from({ length: Math.min(5, totalLength) }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === currentIndex % 5
                  ? 'w-4 h-1.5 bg-gray-800' // 활성화된 점 (길쭉하게)
                  : 'w-1.5 h-1.5 bg-gray-300' // 비활성화된 점
              }`}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// ✅ 2. StampSection 내부 로직
// ==========================================

// API 응답 타입
interface StampResponse {
  storeName: string;
  currentCount: number;
  maxCount: number;
  stampImageUrl: string;
}

// 내부 상태용 데이터 타입
interface StampCardData {
  id: number;
  name: string;
  currentStamps: number;
  totalStamps: number;
}

// 환경 변수 설정
const API_BASE_URL = import.meta.env.VITE_API_URI || 'http://localhost:8080';
const SWIPE_THRESHOLD = 50;
const DAMPING_FACTOR = 0.7;

// 카드 내부 내용물 (스탬프 도장 찍히는 3D 카드)
const StampCardContent = ({
  currentStamps,
  totalStamps,
}: {
  currentStamps: number;
  totalStamps: number;
}) => (
  <div className="w-full h-full px-5 py-4 flex flex-col justify-between bg-white select-none pointer-events-none">
    <div className="flex-1 flex items-center justify-center">
      <div className="grid grid-cols-5 gap-x-4 gap-y-3">
        {Array.from({ length: totalStamps }).map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            {i < currentStamps ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-800"
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
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-300"
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
    <div className="flex justify-center mt-2">
      <div className="bg-gray-200 rounded-full px-4 py-1.5 flex items-center justify-center w-full max-w-[90%]">
        <span className="text-[10px] text-gray-600 font-bold tracking-tighter">
          스탬프 {totalStamps}개 모으면 무료 쿠폰!
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

  // --- 데이터 페칭 ---
  useEffect(() => {
    const fetchStamps = async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);
        const token =
          localStorage.getItem('accessToken') || localStorage.getItem('token');

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

    const rawDeltaY = y - startYRef.current;
    const dampedDeltaY = rawDeltaY * DAMPING_FACTOR;

    if (dampedDeltaY < -SWIPE_THRESHOLD) {
      setActiveIndex((prevIndex) => (prevIndex + 1) % total);
      startYRef.current = y;
      setCurrentY(0);
    } else if (dampedDeltaY > SWIPE_THRESHOLD) {
      setActiveIndex((prevIndex) => (prevIndex - 1 + total) % total);
      startYRef.current = y;
      setCurrentY(0);
    } else {
      setCurrentY(dampedDeltaY);
    }
  };

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    processMove(e.clientY);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDraggingRef.current) return;
    if (e.cancelable) e.preventDefault();
    processMove(e.touches[0].clientY);
  }, []);

  const handleDragStart = (y: number) => {
    if (totalCardsRef.current === 0) return;
    isDraggingRef.current = true;
    startYRef.current = y;
    setCurrentY(0);

    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleDragEnd);
  };

  // --- 렌더링 준비 ---
  const currentStampData =
    stampCards.length > 0 ? stampCards[activeIndex] : null;

  const stampCardProps: StampData | null = currentStampData
    ? {
        storeName: currentStampData.name,
        currentCount: currentStampData.currentStamps,
        maxCount: currentStampData.totalStamps,
        stampImageUrl: '',
      }
    : null;

  // --- UI 렌더링 ---
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
        <p className="text-xs text-gray-400 text-center">로그인 확인 필요</p>
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
    <div className="rounded-lg pb-6 overflow-hidden">
      {/* 1. 3D 카드 스택 (드래그 영역) */}
      <div
        className="relative h-56 w-full flex items-center mb-4 touch-none"
        onMouseDown={(e: React.MouseEvent) => handleDragStart(e.clientY)}
        onTouchStart={(e: React.TouchEvent) =>
          handleDragStart(e.touches[0].clientY)
        }
      >
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[78px] h-[220px] bg-[#F60] rounded-r-[20px] z-0"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[39px] h-[190px] bg-[#EF6000] rounded-r-[10px] border-r-[3px] border-r-[rgba(0,0,0,0.60)] z-20"></div>

        <div
          className={`relative w-[250px] h-[160px] ml-[39px] z-10 ${
            isDraggingRef.current ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {stampCards.map((card, index) => {
            const total = stampCards.length;
            let offset = index - activeIndex;
            if (offset > total / 2) offset -= total;
            else if (offset < -total / 2) offset += total;

            let translateY, scale, opacity, zIndex, rotate;
            const animationProgressDenom = SWIPE_THRESHOLD * 2;

            if (offset === 0) {
              translateY = currentY;
              scale = 1;
              opacity = 1;
              zIndex = 10;
              rotate = '0deg';
            } else if (offset > 0) {
              const progress = Math.min(
                1,
                Math.max(0, -currentY / animationProgressDenom)
              );
              translateY = 15 * offset * (1 - progress);
              scale = 1 - 0.05 * offset + 0.05 * offset * progress;
              rotate = `${3 * offset * (1 - progress)}deg`;
              opacity = offset <= 3 ? 1 : 0;
              zIndex = 10 - offset;
            } else {
              const progress = Math.min(
                1,
                Math.max(0, currentY / animationProgressDenom)
              );
              const currentOffset = Math.abs(offset);
              const baseTranslateY = -15 * currentOffset;
              translateY = baseTranslateY + (0 - baseTranslateY) * progress;
              scale =
                1 - 0.05 * currentOffset + 0.05 * currentOffset * progress;
              rotate = `${
                -3 * currentOffset + 3 * currentOffset * progress
              }deg`;
              opacity = currentOffset <= 3 ? 1 : 0;
              zIndex = 5 - currentOffset;
            }

            return (
              <div
                key={card.id}
                className={`absolute w-full h-full flex-shrink-0 rounded-[12px] shadow-[0_4px_10px_rgba(0,0,0,0.15)] overflow-hidden ${
                  isDraggingRef.current
                    ? ''
                    : 'transition-all duration-500 ease-out'
                }`}
                style={{
                  transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate})`,
                  opacity,
                  zIndex,
                  transformOrigin:
                    offset === 0 ? 'center center' : 'left center',
                }}
              >
                <StampCardContent
                  currentStamps={card.currentStamps}
                  totalStamps={card.totalStamps}
                />
              </div>
            );
          })}
        </div>
      </div>
      {/* 2. 하단 StampCard (현재 활성화된 카드 정보 연동) */}
      <div className="px-1">
        <StampCard
          data={stampCardProps}
          currentIndex={activeIndex}
          totalLength={stampCards.length}
        />
      </div>
    </div>
  );
};

export default StampSection;
