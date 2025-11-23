// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import BackButton from '../../components/BackButton';

// // Assets
// import UploadIcon from '../../assets/upload.svg';
// import RightCircleIcon from '../../assets/rightcircle.svg';

// // API URI 상수는 실제 환경 변수나 설정 파일에서 가져오세요.
// const apiUri = import.meta.env.VITE_API_URI;

// // --- [아이콘 컴포넌트] ---
// const StampIcon = () => (
//   <svg
//     width="22"
//     height="22"
//     viewBox="0 0 24 24"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       d="M18 8H19C20.1046 8 21 8.89543 21 10V11C21 12.1046 20.1046 13 19 13H18V8Z"
//       stroke="#555"
//       strokeWidth="1.5"
//     />
//     <path
//       d="M6 8H18V17C18 19.2091 16.2091 21 14 21H10C7.79086 21 6 19.2091 6 17V8Z"
//       stroke="#555"
//       strokeWidth="1.5"
//     />
//     <path
//       d="M9.5 4C9.5 4 9 5.5 10.5 5.5C12 5.5 11.5 4 11.5 4"
//       stroke="#555"
//       strokeWidth="1.5"
//       strokeLinecap="round"
//     />
//     <path
//       d="M12.5 3C12.5 3 12 4.5 13.5 4.5C15 4.5 14.5 3 14.5 3"
//       stroke="#555"
//       strokeWidth="1.5"
//       strokeLinecap="round"
//     />
//   </svg>
// );

// // --- [데이터 타입] ---
// interface HistoryItem {
//   storeName: string;
//   storeAddress: string;
//   issuedDate: string;
// }

// interface StampHistoryResponse {
//   totalStampSum: number;
//   completedStampNum: number;
//   completedStamps: HistoryItem[] | null;
// }

// const StampHistory = () => {
//   // --- [상태 관리] ---
//   const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const [currentIndex, setCurrentIndex] = useState(1000);
//   const [dragOffset, setDragOffset] = useState(0);
//   const [isDragging, setIsDragging] = useState(false);

//   const startX = useRef<number | null>(null);

//   // --- [API 호출] ---
//   useEffect(() => {
//     const fetchHistory = async () => {
//       const token = localStorage.getItem('accessToken');

//       if (!token) {
//         console.warn('로그인 토큰이 없어 데이터를 불러올 수 없습니다.');
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get<StampHistoryResponse>(
//           `${apiUri}/v1/users/stamps/history`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const list = response.data?.completedStamps || [];
//         setHistoryData(list);
//         console.log('데이터 로드 완료 (개수):', list.length);
//       } catch (error) {
//         console.error('스탬프 히스토리 조회 실패:', error);
//         setHistoryData([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, []);

//   // --- [Helper] ---
//   const getItem = (index: number) => {
//     if (historyData.length === 0) return null;
//     const len = historyData.length;
//     const wrappedIndex = ((index % len) + len) % len;
//     return historyData[wrappedIndex];
//   };

//   // --- [드래그 이벤트 핸들러] ---
//   const handleStart = (clientX: number) => {
//     if (historyData.length === 0) return;
//     setIsDragging(true);
//     startX.current = clientX;
//   };

//   const handleMove = (clientX: number) => {
//     if (!isDragging || startX.current === null) return;
//     const currentDrag = clientX - startX.current;
//     setDragOffset(currentDrag);
//   };

//   const handleEnd = () => {
//     if (!isDragging) return;
//     setIsDragging(false);
//     startX.current = null;

//     const MOVE_THRESHOLD = 80;
//     const movedCards = -Math.round(dragOffset / MOVE_THRESHOLD);

//     setCurrentIndex((prev) => prev + movedCards);
//     setDragOffset(0);
//   };

//   // --- [계산 로직] ---
//   const MOVE_THRESHOLD = 80;
//   const virtualIndex = currentIndex - dragOffset / MOVE_THRESHOLD;
//   const currentDisplayIndex = Math.round(virtualIndex);

//   // 현재 보여줄 아이템
//   const currentItem = getItem(currentDisplayIndex) || {
//     storeName: '-',
//     storeAddress: '-',
//     issuedDate: '-',
//   };

//   // --- [렌더링: 데이터 없음] ---
//   if (!loading && historyData.length === 0) {
//     return (
//       <div className="min-h-screen bg-white flex flex-col font-sans">
//         <div className="px-5 py-4 flex items-center">
//           <BackButton />
//           <h1 className="text-lg font-bold text-gray-800 ml-2">
//             스탬프 히스토리
//           </h1>
//         </div>
//         <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
//           <p>아직 완성된 스탬프 카드가 없어요.</p>
//         </div>
//       </div>
//     );
//   }

//   // --- [렌더링: 메인] ---
//   return (
//     <div className="min-h-screen bg-white flex flex-col relative overflow-hidden select-none font-sans">
//       {/* 전체 배경 그라데이션 (위:흰색 -> 중간:연한살구 -> 아래:오렌지) */}
//       <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FFF0EB] to-[#FF9F65] z-0 pointer-events-none" />
//       {/* 노이즈 텍스처 */}
//       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-10 z-0 pointer-events-none" />

//       {/* Header */}
//       <div className="px-5 py-4 flex items-center relative z-10 bg-transparent">
//         <BackButton />
//         <h1 className="text-lg font-bold text-gray-800 ml-2">
//           스탬프 히스토리
//         </h1>
//       </div>

//       {/* Info Section */}
//       <div className="px-5 mt-2 relative z-10 flex flex-col items-center">
//         <div className="absolute right-5 top-0">
//           <button className="p-1">
//             <img src={UploadIcon} alt="share" className="w-6 h-6 opacity-40" />
//           </button>
//         </div>

//         <div className="text-center mt-6 transition-all duration-300">
//           <h2 className="text-[22px] font-bold text-gray-800 leading-tight mb-2">
//             총 <span className="text-[#FF6B00]">{historyData.length}장</span>의
//             <br />
//             스탬프 완료!
//           </h2>
//           <p className="text-[11px] text-gray-400 mb-8 leading-snug">
//             최근 1년까지의 스탬프 히스토리를 조회할 수 있어요.
//             <br />
//             1년 이전의 내역은 고객센터로 문의해주세요.
//           </p>

//           {/* Dynamic Info Area */}
//           <div className="mb-4 animate-fade-in flex flex-col items-center">
//             <p className="text-xs text-gray-500 font-medium mb-1">
//               {currentItem.issuedDate}
//             </p>
//             <div className="flex items-center justify-center gap-1 mb-1">
//               <h3 className="text-lg font-extrabold text-gray-900">
//                 {currentItem.storeName}
//               </h3>
//               <img
//                 src={RightCircleIcon}
//                 alt="go"
//                 className="w-4 h-4 opacity-60"
//               />
//             </div>
//             <p className="text-[11px] text-gray-400">
//               {currentItem.storeAddress}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Card Fan Area */}
//       <div
//         // [변경] items-end -> items-start (위쪽 정렬)
//         // [변경] pb-10 제거, pt-[33px] 추가 (위쪽 정보와 33px 간격)
//         className="flex-1 relative flex items-start justify-center pt-[33px] overflow-hidden cursor-grab active:cursor-grabbing z-10"
//         onTouchStart={(e) => handleStart(e.targetTouches[0].clientX)}
//         onTouchMove={(e) => handleMove(e.targetTouches[0].clientX)}
//         onTouchEnd={handleEnd}
//         onMouseDown={(e) => handleStart(e.clientX)}
//         onMouseMove={(e) => handleMove(e.clientX)}
//         onMouseUp={handleEnd}
//         onMouseLeave={handleEnd}
//       >
//         {/* Cards Container */}
//         {loading ? (
//           <div className="text-white text-sm animate-pulse">Loading...</div>
//         ) : (
//           // [변경] mb-12 제거 (위쪽 정렬이므로 하단 마진 불필요)
//           <div className="relative w-[160px] h-[250px]">
//             {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((offsetStep) => {
//               const baseIndex = Math.floor(virtualIndex);
//               const renderIndex = baseIndex + offsetStep;
//               const offset = renderIndex - virtualIndex;

//               if (offset < -3.8 || offset > 3.8) return null;

//               const absOffset = Math.abs(offset);

//               const translateX = offset * 10;
//               const translateY = absOffset * 2;
//               const rotate = offset * 5;
//               const scale = 1 - absOffset * 0.05;
//               const zIndex = 50 - Math.round(absOffset * 10);

//               const cardData = getItem(renderIndex);

//               return (
//                 <div
//                   key={`card-${renderIndex}`}
//                   className="absolute top-0 left-0 w-full h-full will-change-transform origin-bottom"
//                   style={{
//                     zIndex: zIndex,
//                     transform: `
//                         translateX(${translateX}px)
//                         translateY(${translateY}px)
//                         rotate(${rotate}deg)
//                         scale(${scale})
//                     `,
//                     transition: isDragging
//                       ? 'none'
//                       : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
//                     opacity: absOffset > 2.5 ? 0.5 : 1,
//                   }}
//                 >
//                   {/* Card Content */}
//                   <div className="w-full h-full bg-white rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.1)] border border-gray-100 p-3 flex relative overflow-hidden">
//                     {/* Left Gray Pill */}
//                     <div className="w-7 h-full bg-[#F3F4F6] rounded-full flex items-center justify-center shrink-0 py-2">
//                       <span
//                         className="text-[8px] text-gray-400 font-medium tracking-tighter whitespace-nowrap"
//                         style={{
//                           transform: 'rotate(90deg)',
//                         }}
//                       >
//                         스탬프 10개 적립시 1잔 무료로 드려요
//                       </span>
//                     </div>

//                     {/* Stamp Grid */}
//                     <div className="flex-1 pl-2 flex flex-col">
//                       <div className="text-[9px] text-gray-400 text-right mb-1 font-medium">
//                         {cardData ? cardData.issuedDate : ''}
//                       </div>
//                       <div className="flex-1 flex items-center justify-center">
//                         <div className="grid grid-cols-2 gap-x-3 gap-y-5">
//                           {[...Array(10)].map((_, i) => (
//                             <div
//                               key={i}
//                               className="flex items-center justify-center opacity-80"
//                             >
//                               <div className="rotate-90">
//                                 <StampIcon />
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Glossy Effect */}
//                     <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-white/30 to-white/60 opacity-50 pointer-events-none rounded-2xl"></div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StampHistory;

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import BackButton from '../../components/BackButton';

// Assets
import UploadIcon from '../../assets/upload.svg';
import RightCircleIcon from '../../assets/rightcircle.svg';

// API URI 상수는 실제 환경 변수나 설정 파일에서 가져오세요.
const apiUri = import.meta.env.VITE_API_URI;

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
  storeName: string;
  storeAddress: string;
  issuedDate: string;
}

interface StampHistoryResponse {
  totalStampSum: number;
  completedStampNum: number;
  completedStamps: HistoryItem[] | null;
}

const StampHistory = () => {
  // --- [상태 관리] ---
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [currentIndex, setCurrentIndex] = useState(1000);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startX = useRef<number | null>(null);

  // --- [API 호출] ---
  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        console.warn('로그인 토큰이 없어 데이터를 불러올 수 없습니다.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<StampHistoryResponse>(
          `${apiUri}/v1/users/stamps/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const list = response.data?.completedStamps || [];
        setHistoryData(list);
        console.log('데이터 로드 완료 (개수):', list.length);
      } catch (error) {
        console.error('스탬프 히스토리 조회 실패:', error);
        setHistoryData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // --- [Helper] ---
  const getItem = (index: number) => {
    if (historyData.length === 0) return null;
    const len = historyData.length;
    const wrappedIndex = ((index % len) + len) % len;
    return historyData[wrappedIndex];
  };

  // --- [드래그 이벤트 핸들러] ---
  const handleStart = (clientX: number) => {
    if (historyData.length === 0) return;
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

  // 현재 보여줄 아이템
  const currentItem = getItem(currentDisplayIndex) || {
    storeName: '-',
    storeAddress: '-',
    issuedDate: '-',
  };

  // --- [렌더링: 데이터 없음] ---
  if (!loading && historyData.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <div className="px-5 py-4 flex items-center">
          <BackButton />
          <h1 className="text-lg font-bold text-gray-800 ml-2">
            스탬프 히스토리
          </h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
          <p>아직 완성된 스탬프 카드가 없어요.</p>
        </div>
      </div>
    );
  }

  // --- [렌더링: 메인] ---
  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden select-none font-sans">
      {/* [수정됨] 배경 그라데이션 길이 조절 */}
      {/* h-[80%]: 전체 높이의 80%만 차지 */}
      {/* bottom-0: 바닥에 붙임 */}
      {/* bg-gradient-to-t: 아래(오렌지)에서 위(흰색)로 올라가도록 방향 변경 */}
      <div className="absolute bottom-0 left-0 w-full h-[80%] bg-gradient-to-t from-[#FF9F65] via-[#FFF0EB] to-white z-0 pointer-events-none" />

      {/* 노이즈 텍스처 (그라데이션 영역에만 적용) */}
      <div className="absolute bottom-0 left-0 w-full h-[80%] bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-10 z-0 pointer-events-none" />

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
              {currentItem.issuedDate}
            </p>
            <div className="flex items-center justify-center gap-1 mb-1">
              <h3 className="text-lg font-extrabold text-gray-900">
                {currentItem.storeName}
              </h3>
              <img
                src={RightCircleIcon}
                alt="go"
                className="w-4 h-4 opacity-60"
              />
            </div>
            <p className="text-[11px] text-gray-400">
              {currentItem.storeAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Card Fan Area */}
      <div
        className="flex-1 relative flex items-start justify-center pt-[33px] overflow-hidden cursor-grab active:cursor-grabbing z-10"
        onTouchStart={(e) => handleStart(e.targetTouches[0].clientX)}
        onTouchMove={(e) => handleMove(e.targetTouches[0].clientX)}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        {/* Cards Container */}
        {loading ? (
          <div className="text-white text-sm animate-pulse">Loading...</div>
        ) : (
          <div className="relative w-[160px] h-[250px]">
            {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((offsetStep) => {
              const baseIndex = Math.floor(virtualIndex);
              const renderIndex = baseIndex + offsetStep;
              const offset = renderIndex - virtualIndex;

              if (offset < -3.8 || offset > 3.8) return null;

              const absOffset = Math.abs(offset);

              const translateX = offset * 10;
              const translateY = absOffset * 2;
              const rotate = offset * 5;
              const scale = 1 - absOffset * 0.05;
              const zIndex = 50 - Math.round(absOffset * 10);

              const cardData = getItem(renderIndex);

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
                          transform: 'rotate(90deg)',
                        }}
                      >
                        스탬프 10개 적립시 1잔 무료로 드려요
                      </span>
                    </div>

                    {/* Stamp Grid */}
                    <div className="flex-1 pl-2 flex flex-col">
                      <div className="text-[9px] text-gray-400 text-right mb-1 font-medium">
                        {cardData ? cardData.issuedDate : ''}
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-x-3 gap-y-5">
                          {[...Array(10)].map((_, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-center opacity-80"
                            >
                              <div className="rotate-90">
                                <StampIcon />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Glossy Effect */}
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-white/30 to-white/60 opacity-50 pointer-events-none rounded-2xl"></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StampHistory;
