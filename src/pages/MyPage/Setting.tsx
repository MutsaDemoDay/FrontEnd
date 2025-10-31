import React from 'react';
import BackButton from '../../components/BackButton';

export default function Setting() {
  return (
    <div className="w-[399px] min-h-screen bg-white mx-auto border border-gray-300 overflow-y-auto">
      {/* 1. 설정 페이지 헤더 (페이지 전용) */}
      <SettingsHeader />

      {/* 2. 메인 컨텐츠 영역 */}
      <main className="p-4 flex flex-col gap-3">
        {/* 상단 버튼 그룹 */}
        <SettingsLinkButton icon={true} label="프로필 설정" />
        <SettingsLinkButton icon={true} label="계정 정보" />
        <SettingsLinkButton icon={true} label="쿠폰함" />

        {/* 하단 버튼 그룹 (위쪽과 간격 띄우기) */}
        <SettingsLinkButton label="점주 계정으로 전환" className="mt-4" />
        <SettingsLinkButton label="로그아웃" />
      </main>
    </div>
  );
}

/**
 * 설정 페이지 전용 헤더
 * (뒤로가기 버튼, 중앙 정렬된 제목)
 */
const SettingsHeader = () => (
  <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-200 h-[60px]">
    <div className="relative w-full flex justify-center items-center">
      {/* 뒤로가기 버튼 (absolute로 좌측에 배치) */}
      <div className="absolute left-0">
        {/* <ArrowLeft className="w-6 h-6 text-gray-800 cursor-pointer" /> */}
        <BackButton />
      </div>
      {/* 제목 (중앙 배치) */}
      <h1 className="text-lg font-bold">설정</h1>
    </div>
  </header>
);

/**
 * 재사용 가능한 설정 버튼 컴포넌트
 */
const SettingsLinkButton = ({
  label,
  icon = false,
  className = '',
}: {
  label: string;
  icon?: boolean;
  className?: string;
}) => (
  <button
    className={`
      w-full p-4 bg-gray-100 rounded-2xl 
      flex items-center text-left 
      hover:bg-gray-200 active:bg-gray-300 transition-colors
      ${className}
    `}
  >
    {icon && (
      // 아이콘 플레이스홀더 (이미지상 흰색 원)
      <div className="w-12 h-12 bg-white rounded-full mr-4 flex-shrink-0"></div>
    )}
    <span className="text-base font-medium text-gray-800">{label}</span>
  </button>
);
