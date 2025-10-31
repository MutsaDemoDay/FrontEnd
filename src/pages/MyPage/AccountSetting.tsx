import React from 'react';
import BackButton from '../../components/BackButton';

const AccountSetting: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* 1. 헤더 (뒤로가기 버튼, 타이틀) */}
      <header className="relative flex items-center justify-center p-4 border-b border-gray-200 flex-shrink-0">
        <div className="absolute left-4">
          <BackButton />
        </div>
        <h1 className="text-lg font-semibold">계정 정보</h1>
      </header>

      {/* 2. 메인 컨텐츠 영역 (flex-grow로 남은 공간 채우기) */}
      <div className="flex-1 flex flex-col justify-between p-6">
        {/* 상단 폼 영역 */}
        <main className="space-y-6">
          {/* 휴대폰 (활성 입력창) */}
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-gray-600"
            >
              휴대폰
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            />
          </div>

          {/* 아이디 (읽기 전용) */}
          <div className="space-y-2">
            <label
              htmlFor="userid"
              className="text-sm font-medium text-gray-600"
            >
              아이디
            </label>
            <input
              type="text"
              id="userid"
              readOnly
              className="w-full p-3 bg-gray-100 rounded-lg text-gray-700 focus:outline-none"
            />
          </div>

          {/* 비밀번호 (읽기 전용) */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-600"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              readOnly
              // 시각적으로만 보이도록 '••••••••' 같은 값을 넣을 수 있습니다.
              // value="••••••••"
              className="w-full p-3 bg-gray-100 rounded-lg text-gray-700 focus:outline-none"
            />
          </div>

          {/* 이메일 (읽기 전용) */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-600"
            >
              이메일
            </label>
            <input
              type="email"
              id="email"
              readOnly
              className="w-full p-3 bg-gray-100 rounded-lg text-gray-700 focus:outline-none"
            />
          </div>
        </main>

        {/* 하단 버튼 영역 */}
        <footer className="mt-10 pb-4">
          {/* 저장 버튼 (이미지처럼 비활성 스타일) */}
          <button
            className="w-full py-4 px-6 rounded-lg bg-gray-200 text-gray-600 font-semibold text-base"
            // disabled // 실제로는 disabled 상태일 수 있습니다.
          >
            저장
          </button>

          {/* 회원 탈퇴 버튼 */}
          <button className="w-full mt-5 text-center text-sm text-gray-500 underline">
            회원 탈퇴
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AccountSetting;
