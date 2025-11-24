// import React from 'react';
// import BackButton from '../../components/BackButton';
// import { UserBottomBar } from '../../components/UserBottomBar';

// const AccountSetting: React.FC = () => {
//   // 표시할 임시 데이터
//   const userInfo = {
//     email: 'abcdef@gmail.com',
//     id: 'abcdef0123',
//     joinDate: '2025. 11. 18',
//   };

//   return (
//     <div className="min-h-screen w-[390px] bg-white text-gray-900 flex flex-col">
//       {/* 1. 헤더 (기존 코드와 동일) */}
//       <header className="relative flex items-center justify-center p-4 border-b border-gray-200 flex-shrink-0">
//         <div className="absolute left-4">
//           <BackButton />
//         </div>
//         <h1 className="text-lg font-semibold">계정 관리</h1>
//       </header>

//       {/* 2. 메인 컨텐츠 영역 (기존 코드의 레이아웃 클래스 완벽 유지) */}
//       {/* p-6: 가로 여백 유지, justify-between: 하단 바 위치 유지 */}
//       <div className="flex-1 flex flex-col justify-between p-6">
//         {/* 상단 리스트 영역 (w-full로 가로 꽉 차게 설정) */}
//         <main className="w-full flex flex-col">
//           {/* 리스트 아이템: 이메일 */}
//           <div className="w-full flex justify-between items-center py-4 border-b border-gray-100">
//             <span className="text-sm font-medium text-gray-900">이메일</span>
//             <span className="text-sm text-gray-400">{userInfo.email}</span>
//           </div>

//           {/* 리스트 아이템: 아이디 */}
//           <div className="w-full flex justify-between items-center py-4 border-b border-gray-100">
//             <span className="text-sm font-medium text-gray-900">아이디</span>
//             <span className="text-sm text-gray-400">{userInfo.id}</span>
//           </div>

//           {/* 리스트 아이템: 가입일 */}
//           <div className="w-full flex justify-between items-center py-4 border-b border-gray-100">
//             <span className="text-sm font-medium text-gray-900">가입일</span>
//             <span className="text-sm text-gray-400">{userInfo.joinDate}</span>
//           </div>

//           {/* 리스트 아이템: 회원 탈퇴 (버튼 기능을 리스트 형태로 변경) */}
//           <button
//             className="w-full flex justify-start items-center py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
//             onClick={() => console.log('회원 탈퇴 클릭')}
//           >
//             <span className="text-sm font-medium text-gray-900">회원 탈퇴</span>
//           </button>
//         </main>

//         {/* 하단 영역 (저장 버튼 제거, UserBottomBar만 유지) */}
//         <footer className="pb-4">
//           <UserBottomBar />
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default AccountSetting;

import React, { useState } from 'react';
import BackButton from '../../components/BackButton';
import { UserBottomBar } from '../../components/UserBottomBar';

const AccountSetting: React.FC = () => {
  // 모달 상태 관리 (false: 닫힘, true: 열림)
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 표시할 임시 데이터
  const userInfo = {
    email: 'abcdef@gmail.com',
    id: 'abcdef0123',
    joinDate: '2025. 11. 18',
  };

  // 탈퇴 버튼 클릭 핸들러
  const handleDeleteAccount = () => {
    // 여기에 실제 탈퇴 API 로직을 추가하면 됩니다.
    console.log('탈퇴 처리가 완료되었습니다.');
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen w-[390px] bg-white text-gray-900 flex flex-col relative">
      {/* 1. 헤더 */}
      <header className="relative flex items-center justify-center p-4 border-b border-gray-200 flex-shrink-0">
        <div className="absolute left-4">
          <BackButton />
        </div>
        <h1 className="text-lg font-semibold">계정 관리</h1>
      </header>

      {/* 2. 메인 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col justify-between p-6">
        <main className="w-full flex flex-col">
          {/* 리스트 아이템: 이메일 */}
          <div className="w-full flex justify-between items-center py-4 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-900">이메일</span>
            <span className="text-sm text-gray-400">{userInfo.email}</span>
          </div>

          {/* 리스트 아이템: 아이디 */}
          <div className="w-full flex justify-between items-center py-4 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-900">아이디</span>
            <span className="text-sm text-gray-400">{userInfo.id}</span>
          </div>

          {/* 리스트 아이템: 가입일 */}
          <div className="w-full flex justify-between items-center py-4 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-900">가입일</span>
            <span className="text-sm text-gray-400">{userInfo.joinDate}</span>
          </div>

          {/* 리스트 아이템: 회원 탈퇴 (클릭 시 모달 오픈) */}
          <button
            className="w-full flex justify-start items-center py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="text-sm font-medium text-gray-900">회원 탈퇴</span>
          </button>
        </main>

        {/* 하단 영역 */}
        <footer className="pb-4">
          <UserBottomBar />
        </footer>
      </div>

      {/* === 모달 창 === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/50">
          <div className="w-[300px] bg-white rounded-xl overflow-hidden shadow-lg animate-fade-in-up">
            {/* 텍스트 영역 */}
            <div className="p-6 flex flex-col items-center text-center space-y-3">
              <h2 className="text-base font-bold text-gray-800">
                회원을 탈퇴하면 모든 정보가 사라져요.
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed break-keep">
                탈퇴하면 모든 회원 정보와 스탬프 내역이 삭제되어 복구할 수
                없으며, 같은 이메일과 소셜계정으로 30일간 재가입이 불가합니다.
              </p>
            </div>

            {/* 버튼 영역 (이미지와 동일한 5:5 분할 디자인) */}
            <div className="flex h-12">
              {/* 탈퇴 버튼 (어두운 회색) */}
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-gray-600 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                탈퇴
              </button>
              {/* 취소 버튼 (흰색) */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-white text-gray-800 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSetting;
