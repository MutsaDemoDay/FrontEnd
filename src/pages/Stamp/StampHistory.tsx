// import React, { useState, useRef } from 'react';
// import BackButton from '../../components/BackButton'; // 경로 확인 필요

// // Assets
// import UploadIcon from '../../assets/upload.svg';
// import RightCircleIcon from '../../assets/rightcircle.svg';

// // 카드에 들어갈 커피 아이콘 (Inline SVG)
// const CoffeeBeanIcon = () => (
//   <svg
//     width="20"
//     height="20"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="#555"
//     strokeWidth="1.5"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
//     <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
//     <line x1="6" y1="1" x2="6" y2="4" />
//     <line x1="10" y1="1" x2="10" y2="4" />
//     <line x1="14" y1="1" x2="14" y2="4" />
//   </svg>
// );

// // 히스토리 데이터 타입
// interface HistoryItem {
//   id: number;
//   date: string;
//   cafeName: string;
//   address: string;
// }

// const StampHistory = () => {
//   // 가상 데이터
//   const historyData: HistoryItem[] = [
//     {
//       id: 1,
//       date: '2025.01.01',
//       cafeName: '열공커피 홍대입구역점',
//       address: '서울특별시 마포구 와우산로 1831',
//     },
//     {
//       id: 2,
//       date: '2024.12.25',
//       cafeName: '카페나무 강남점',
//       address: '서울특별시 강남구 테헤란로 123',
//     },
//     {
//       id: 3,
//       date: '2024.11.11',
//       cafeName: '스탠스커피',
//       address: '서울특별시 마포구 양화로 45',
//     },
//     {
//       id: 4,
//       date: '2024.10.31',
//       cafeName: '카페드림',
//       address: '서울특별시 서대문구 연세로 50',
//     },
//     {
//       id: 5,
//       date: '2024.09.15',
//       cafeName: '블루보틀 성수',
//       address: '서울특별시 성동구 아차산로 7',
//     },
//     {
//       id: 6,
//       date: '2024.08.20',
//       cafeName: '스타벅스 리저브',
//       address: '서울특별시 종로구 종로 51',
//     },
//     {
//       id: 7,
//       date: '2024.07.07',
//       cafeName: '이디야 커피',
//       address: '서울특별시 강서구 공항대로 100',
//     },
//     {
//       id: 8,
//       date: '2024.06.01',
//       cafeName: '투썸플레이스',
//       address: '서울특별시 영등포구 여의대로 1',
//     },
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);

//   // 드래그(스와이프) 로직을 위한 상태
//   const [touchStart, setTouchStart] = useState<number | null>(null);
//   const [touchEnd, setTouchEnd] = useState<number | null>(null);

//   // 터치 시작
//   const onTouchStart = (e: React.TouchEvent) => {
//     setTouchEnd(null);
//     setTouchStart(e.targetTouches[0].clientX);
//   };

//   // 터치 이동
//   const onTouchMove = (e: React.TouchEvent) => {
//     setTouchEnd(e.targetTouches[0].clientX);
//   };

//   // 터치 종료 (스와이프 판단)
//   const onTouchEnd = () => {
//     if (!touchStart || !touchEnd) return;

//     const distance = touchStart - touchEnd;
//     const isLeftSwipe = distance > 50; // 50px 이상 움직이면 스와이프 인식
//     const isRightSwipe = distance < -50;

//     if (isLeftSwipe) {
//       // 다음 카드로 (오른쪽에서 왼쪽으로 밈)
//       if (currentIndex < historyData.length - 1) {
//         setCurrentIndex((prev) => prev + 1);
//       }
//     } else if (isRightSwipe) {
//       // 이전 카드로 (왼쪽에서 오른쪽으로 밈)
//       if (currentIndex > 0) {
//         setCurrentIndex((prev) => prev - 1);
//       }
//     }
//   };

//   // 현재 보여질 데이터
//   const currentItem = historyData[currentIndex];

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
//       {/* 1. Header */}
//       <div className="px-5 py-4 bg-white flex items-center relative z-10">
//         <BackButton />
//         <h1 className="text-xl font-bold text-gray-800 ml-2">
//           스탬프 히스토리
//         </h1>
//       </div>

//       {/* 2. Top Content (Info) */}
//       <div className="px-5 mt-6 relative z-10">
//         {/* Upload Icon */}
//         <div className="absolute right-5 top-0">
//           <button className="p-1">
//             <img src={UploadIcon} alt="share" className="w-6 h-6 opacity-60" />
//           </button>
//         </div>

//         {/* Text Info */}
//         <div className="text-center mt-8 transition-all duration-300 ease-in-out">
//           <h2 className="text-xl font-bold text-gray-800 mb-2">
//             총 <span className="text-[#FF6B00]">{historyData.length}장</span>의
//             <br />
//             스탬프 완료!
//           </h2>
//           <p className="text-[10px] text-gray-400 mb-10 leading-tight">
//             최근 1년까지의 스탬프 히스토리를 조회할 수 있어요.
//             <br />
//             1년 이전의 내역은 고객센터로 문의해주세요.
//           </p>

//           {/* Dynamic Info (Date, Name, Address) */}
//           <div className="mb-2">
//             <p className="text-xs text-gray-500 font-medium mb-1">
//               {currentItem.date}
//             </p>
//             <div className="flex items-center justify-center gap-1 mb-1">
//               <h3 className="text-lg font-bold text-gray-800">
//                 {currentItem.cafeName}
//               </h3>
//               <img src={RightCircleIcon} alt="go" className="w-4 h-4" />
//             </div>
//             <p className="text-[10px] text-gray-400">{currentItem.address}</p>
//           </div>
//         </div>
//       </div>

//       {/* 3. Card Stack Area */}
//       <div
//         className="flex-1 relative flex items-end justify-center pb-10 overflow-hidden"
//         onTouchStart={onTouchStart}
//         onTouchMove={onTouchMove}
//         onTouchEnd={onTouchEnd}
//       >
//         {/* Background Gradient Effect at bottom */}
//         <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-200 to-transparent pointer-events-none z-0"></div>

//         {/* Cards */}
//         <div className="relative w-[220px] h-[320px] perspective-1000">
//           {historyData.map((item, index) => {
//             // 현재 카드 기준 상대적 위치 계산
//             const offset = index - currentIndex;

//             // 화면에 안 보이는 카드는 렌더링 최적화를 위해 숨김 (선택 사항)
//             if (offset < -1 || offset > 2) return null;

//             // 스타일 계산 (스택 효과)
//             let style: React.CSSProperties = {};

//             if (offset === 0) {
//               // 현재 활성 카드
//               style = {
//                 zIndex: 10,
//                 transform: 'translateY(0) scale(1)',
//                 opacity: 1,
//               };
//             } else if (offset > 0) {
//               // 뒤에 쌓인 카드들 (Fan effect)
//               // index가 커질수록 Y축으로 내려가고, scale은 작아지고, 부채꼴처럼 벌어짐
//               const rotate = offset % 2 === 0 ? offset * 5 : offset * -5; // 지그재그 회전 효과
//               style = {
//                 zIndex: 10 - offset,
//                 transform: `translateY(${offset * 15}px) translateX(${
//                   offset % 2 === 0 ? -offset * 5 : offset * 5
//                 }px) scale(${1 - offset * 0.05}) rotate(${rotate}deg)`,
//                 opacity: 1 - offset * 0.2,
//                 filter: 'brightness(0.95)',
//               };
//             } else {
//               // 이미 지나간 카드 (왼쪽으로 사라짐)
//               style = {
//                 zIndex: 0,
//                 transform: 'translateX(-150%) rotate(-20deg)',
//                 opacity: 0,
//               };
//             }

//             return (
//               <div
//                 key={item.id}
//                 className="absolute top-0 left-0 w-full h-full transition-all duration-500 ease-out origin-bottom"
//                 style={style}
//               >
//                 {/* Card Design */}
//                 <div className="w-full h-full bg-white rounded-xl shadow-xl border border-gray-100 p-4 flex relative overflow-hidden">
//                   {/* Left Barcode Area */}
//                   <div className="w-8 h-full bg-gray-100 rounded-full flex items-center justify-center mr-3">
//                     <span className="text-[8px] text-gray-400 font-medium -rotate-90 whitespace-nowrap tracking-widest">
//                       스탬프 10개 아메리카노 1잔 무료로 드려요
//                     </span>
//                   </div>

//                   {/* Stamps Grid */}
//                   <div className="flex-1 flex items-center justify-center">
//                     <div className="grid grid-cols-2 gap-x-6 gap-y-6">
//                       {[...Array(10)].map((_, i) => (
//                         <CoffeeBeanIcon key={i} />
//                       ))}
//                     </div>
//                   </div>

//                   {/* Glossy Overlay (Optional) */}
//                   <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-b from-white/50 to-transparent rotate-45 transform translate-x-10 -translate-y-10"></div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StampHistory;

import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

// Assets
import UploadIcon from '../../assets/upload.svg';
import RightCircleIcon from '../../assets/rightcircle.svg';

// 카드에 들어갈 커피 아이콘
const CoffeeBeanIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#555"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);

// 히스토리 데이터 타입
interface HistoryItem {
  id: number;
  date: string;
  cafeName: string;
  address: string;
}

const StampHistory = () => {
  // 가상 데이터
  const historyData: HistoryItem[] = [
    {
      id: 1,
      date: '2025.01.01',
      cafeName: '열공커피 홍대입구역점',
      address: '서울특별시 마포구 와우산로 1831',
    },
    {
      id: 2,
      date: '2024.12.25',
      cafeName: '카페나무 강남점',
      address: '서울특별시 강남구 테헤란로 123',
    },
    {
      id: 3,
      date: '2024.11.11',
      cafeName: '스탠스커피',
      address: '서울특별시 마포구 양화로 45',
    },
    {
      id: 4,
      date: '2024.10.31',
      cafeName: '카페드림',
      address: '서울특별시 서대문구 연세로 50',
    },
    {
      id: 5,
      date: '2024.09.15',
      cafeName: '블루보틀 성수',
      address: '서울특별시 성동구 아차산로 7',
    },
    {
      id: 6,
      date: '2024.08.20',
      cafeName: '스타벅스 리저브',
      address: '서울특별시 종로구 종로 51',
    },
    {
      id: 7,
      date: '2024.07.07',
      cafeName: '이디야 커피',
      address: '서울특별시 강서구 공항대로 100',
    },
    {
      id: 8,
      date: '2024.06.01',
      cafeName: '투썸플레이스',
      address: '서울특별시 영등포구 여의대로 1',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // 드래그 로직을 위한 상태 (시작점, 현재점)
  const [startX, setStartX] = useState<number | null>(null);
  const [endX, setEndX] = useState<number | null>(null);

  // --- 통합 이벤트 핸들러 (마우스 + 터치) ---

  // 1. 시작 (TouchStart / MouseDown)
  const handleStart = (clientX: number) => {
    setStartX(clientX);
    setEndX(clientX); // 시작할 땐 끝점도 시작점과 동일하게
  };

  // 2. 이동 (TouchMove / MouseMove)
  const handleMove = (clientX: number) => {
    if (startX !== null) {
      setEndX(clientX);
    }
  };

  // 3. 종료 (TouchEnd / MouseUp)
  const handleEnd = () => {
    if (startX === null || endX === null) return;

    const distance = startX - endX;
    const threshold = 50; // 50px 이상 움직여야 인식

    if (distance > threshold) {
      // 왼쪽으로 밀기 (다음 카드)
      if (currentIndex < historyData.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    } else if (distance < -threshold) {
      // 오른쪽으로 밀기 (이전 카드)
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    }

    // 상태 초기화
    setStartX(null);
    setEndX(null);
  };

  // 현재 보여질 데이터
  const currentItem = historyData[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden select-none">
      {/* 1. Header */}
      <div className="px-5 py-4 bg-white flex items-center relative z-10">
        <BackButton />
        <h1 className="text-xl font-bold text-gray-800 ml-2">
          스탬프 히스토리
        </h1>
      </div>

      {/* 2. Top Content (Info) */}
      <div className="px-5 mt-6 relative z-10">
        {/* Upload Icon */}
        <div className="absolute right-5 top-0">
          <button className="p-1">
            <img src={UploadIcon} alt="share" className="w-6 h-6 opacity-60" />
          </button>
        </div>

        {/* Text Info */}
        <div className="text-center mt-8 transition-all duration-300 ease-in-out">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            총 <span className="text-[#FF6B00]">{historyData.length}장</span>의
            <br />
            스탬프 완료!
          </h2>
          <p className="text-[10px] text-gray-400 mb-10 leading-tight">
            최근 1년까지의 스탬프 히스토리를 조회할 수 있어요.
            <br />
            1년 이전의 내역은 고객센터로 문의해주세요.
          </p>

          {/* Dynamic Info */}
          <div className="mb-2 animate-fade-in">
            <p className="text-xs text-gray-500 font-medium mb-1">
              {currentItem.date}
            </p>
            <div className="flex items-center justify-center gap-1 mb-1">
              <h3 className="text-lg font-bold text-gray-800">
                {currentItem.cafeName}
              </h3>
              <img src={RightCircleIcon} alt="go" className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-gray-400">{currentItem.address}</p>
          </div>
        </div>
      </div>

      {/* 3. Card Stack Area */}
      <div
        className="flex-1 relative flex items-end justify-center pb-10 overflow-hidden cursor-grab active:cursor-grabbing"
        // 터치 이벤트
        onTouchStart={(e) => handleStart(e.targetTouches[0].clientX)}
        onTouchMove={(e) => handleMove(e.targetTouches[0].clientX)}
        onTouchEnd={handleEnd}
        // 마우스 이벤트 (PC용)
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd} // 마우스가 영역 밖으로 나가면 드래그 종료
      >
        {/* 바닥 그라데이션 효과 */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-200 to-transparent pointer-events-none z-0"></div>

        {/* Cards Container */}
        <div className="relative w-[220px] h-[320px] perspective-1000">
          {historyData.map((item, index) => {
            const offset = index - currentIndex;

            // 화면에 안 보이는 카드는 렌더링 안 함 (성능 최적화)
            if (offset < -1 || offset > 2) return null;

            // 스타일 계산
            let style: React.CSSProperties = {};

            if (offset === 0) {
              // 현재 카드
              style = {
                zIndex: 10,
                transform: `translateY(0) scale(1)`,
                opacity: 1,
              };
            } else if (offset > 0) {
              // 뒤에 있는 카드 (부채꼴)
              const rotate = offset % 2 === 0 ? offset * 5 : offset * -5;
              style = {
                zIndex: 10 - offset,
                transform: `translateY(${offset * 15}px) translateX(${
                  offset % 2 === 0 ? -offset * 5 : offset * 5
                }px) scale(${1 - offset * 0.05}) rotate(${rotate}deg)`,
                opacity: 1 - offset * 0.2,
                filter: 'brightness(0.95)',
              };
            } else {
              // 지나간 카드 (왼쪽으로 사라짐)
              style = {
                zIndex: 0,
                transform: 'translateX(-150%) rotate(-20deg)',
                opacity: 0,
              };
            }

            return (
              <div
                key={item.id}
                className="absolute top-0 left-0 w-full h-full transition-all duration-500 ease-out origin-bottom"
                style={style}
              >
                <div className="w-full h-full bg-white rounded-xl shadow-xl border border-gray-100 p-4 flex relative overflow-hidden">
                  {/* 왼쪽 바코드 영역 */}
                  <div className="w-8 h-full bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-[8px] text-gray-400 font-medium -rotate-90 whitespace-nowrap tracking-widest">
                      스탬프 10개 아메리카노 1잔 무료로 드려요
                    </span>
                  </div>

                  {/* 스탬프 그리드 */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                      {[...Array(10)].map((_, i) => (
                        <CoffeeBeanIcon key={i} />
                      ))}
                    </div>
                  </div>

                  {/* 광택 효과 */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-b from-white/50 to-transparent rotate-45 transform translate-x-10 -translate-y-10"></div>
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
