// import React from 'react';
// import BackButton from '../../components/BackButton';

// const CouponBox: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-white text-gray-900 flex flex-col">
//       {/* 1. 헤더 (뒤로가기 버튼) */}
//       <header className="flex items-center p-4 border-b border-gray-100">
//         <BackButton />
//       </header>

//       {/* 2. 메인 컨텐츠 (flex-grow로 남은 공간 채우기) */}
//       <div className="flex-1 flex flex-col justify-between">
//         {/* 상단 쿠폰 목록 영역 */}
//         <main>
//           {/* 페이지 타이틀 */}
//           <h1 className="text-2xl font-bold p-6">쿠폰함</h1>

//           {/* 쿠폰 리스트 컨테이너 (타이틀과 리스트 구분선) */}
//           <div className="border-t border-gray-100">
//             {/* 쿠폰 아이템 1 */}
//             <div className="flex items-center p-6 border-b border-gray-100">
//               {/* 이미지/아이콘 영역 */}
//               <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0"></div>

//               {/* 텍스트 영역 */}
//               <div className="ml-4">
//                 <h2 className="font-semibold text-base">생일 쿠폰</h2>
//                 <div className="text-sm text-gray-500 mt-1">
//                   <span>기한: 2024.01.01까지</span>
//                   {/* '10일 남음' 텍스트는 이미지에서 파란색 계열로 보여서 text-blue-600을 적용했습니다. */}
//                   <span className="text-blue-600 font-medium ml-3">
//                     10일 남음
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* 쿠폰 아이템 2 */}
//             <div className="flex items-center p-6 border-b border-gray-100">
//               <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0"></div>
//               <div className="ml-4">
//                 <h2 className="font-semibold text-base">
//                   이달의 카페 사이즈업 쿠폰
//                 </h2>
//                 <div className="text-sm text-gray-500 mt-1">
//                   <span>기한: 2024.01.01까지</span>
//                   <span className="text-blue-600 font-medium ml-3">
//                     10일 남음
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* 여기에 쿠폰 아이템을 추가하면 리스트가 늘어납니다. */}
//           </div>
//         </main>

//         {/* 하단 유의사항 영역 */}
//         <footer className="p-6 pb-10">
//           <h3 className="text-sm font-medium text-gray-600 mb-3">유의사항</h3>
//           <ul className="space-y-1.5 text-xs text-gray-500 list-disc list-inside">
//             <li>쿠폰은 중복사용이 불가능 합니다.</li>
//             <li>결제 이후 취소되면, 쿠폰은 복구 됩니다.</li>
//             <li>
//               취소를 통해 복구된 쿠폰은 유효기간이 지날시 사용이 불가능합니다.
//             </li>
//           </ul>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default CouponBox;

import React from 'react';
// react-router-dom에서 useNavigate를 import 합니다.
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { UserBottomBar } from '../../components/UserBottomBar';

const CouponBox: React.FC = () => {
  // navigate 함수를 사용하기 위해 훅을 호출합니다.
  const navigate = useNavigate();

  // 쿠폰 클릭 시 호출될 핸들러
  const handleCouponClick = () => {
    // '/coupon' 경로는 App.tsx 등 라우터 설정에 정의된 경로입니다.
    // 실제로는 쿠폰 ID를 함께 넘겨야 할 수 있습니다. 예: navigate('/coupon/123')
    navigate('/coupon');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* 1. 헤더 (뒤로가기 버튼) */}
      <header className="flex items-center p-4 border-b border-gray-100">
        <BackButton />
      </header>

      {/* 2. 메인 컨텐츠 (flex-grow로 남은 공간 채우기) */}
      <div className="flex-1 flex flex-col justify-between">
        {/* 상단 쿠폰 목록 영역 */}
        <main>
          {/* 페이지 타이틀 */}
          <h1 className="text-2xl font-bold p-6">쿠폰함</h1>

          {/* 쿠폰 리스트 컨테이너 (타이틀과 리스트 구분선) */}
          <div className="border-t border-gray-100">
            {/* 쿠폰 아이템 1 (클릭 가능하도록 수정) */}
            <div
              className="flex items-center p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={handleCouponClick} // onClick 핸들러 추가
            >
              {/* 이미지/아이콘 영역 */}
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0"></div>

              {/* 텍스트 영역 */}
              <div className="ml-4">
                <h2 className="font-semibold text-base">생일 쿠폰</h2>
                <div className="text-sm text-gray-500 mt-1">
                  <span>기한: 2024.01.01까지</span>
                  <span className="text-blue-600 font-medium ml-3">
                    10일 남음
                  </span>
                </div>
              </div>
            </div>

            {/* 쿠폰 아이템 2 (클릭 가능하도록 수정) */}
            <div
              className="flex items-center p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={handleCouponClick} // onClick 핸들러 추가
            >
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0"></div>
              <div className="ml-4">
                <h2 className="font-semibold text-base">
                  이달의 카페 사이즈업 쿠폰
                </h2>
                <div className="text-sm text-gray-500 mt-1">
                  <span>기한: 2024.01.01까지</span>
                  <span className="text-blue-600 font-medium ml-3">
                    10일 남음
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* 하단 유의사항 영역 */}
        <footer className="p-6 pb-10">
          <h3 className="text-sm font-medium text-gray-600 mb-3">유의사항</h3>
          <ul className="space-y-1.5 text-xs text-gray-500 list-disc list-inside">
            <li>쿠폰은 중복사용이 불가능 합니다.</li>
            <li>결제 이후 취소되면, 쿠폰은 복구 됩니다.</li>
            <li>
              취소를 통해 복구된 쿠폰은 유효기간이 지날시 사용이 불가능합니다.
            </li>
          </ul>
        </footer>
      </div>
      <UserBottomBar />
    </div>
  );
};

export default CouponBox;
