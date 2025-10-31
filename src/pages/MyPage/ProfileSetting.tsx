import React from 'react';
import BackButton from '../../components/BackButton';
import Plus from '../../assets/plus.svg';
import FilledStar from '../../assets/filledstar.svg';
import ThreeDots from '../../assets/threedots.svg';

// '칭호' 섹션의 아이콘을 위한 임시 컴포넌트
// 이미지의 로고를 단순한 형태로 대체했습니다.
const TitleIcon = () => (
  <div className="w-16 h-16 rounded-full bg-white border border-gray-300 flex items-center justify-center">
    <div className="w-12 h-12 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold">
      ICON
    </div>
  </div>
);

const ProfileSetting: React.FC = () => {
  // 가로 스크롤바 숨기기 위한 스타일
  const scrollbarHideStyle: React.CSSProperties = {
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE and Edge
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* 1. 헤더 (뒤로가기 버튼, 타이틀) */}
      <header className="relative flex items-center justify-center p-4 border-b border-gray-200">
        <div className="absolute left-4">
          <BackButton />
        </div>
        <h1 className="text-lg font-semibold">프로필 설정</h1>
      </header>

      {/* 2. 메인 컨텐츠 영역 */}
      <main className="p-6 space-y-8">
        {/* 프로필 이미지 섹션 */}
        <div className="flex justify-center mt-4">
          <div className="relative w-32 h-32 bg-gray-200 rounded-2xl">
            {/* 이미지 업로드 버튼 (이미지의 원형 버튼) */}
            <button className="absolute top-[-10px] right-[-10px] w-9 h-9 bg-white rounded-full border border-gray-300 shadow flex items-center justify-center">
              {/* 기능적으로 Camera 아이콘을 추가하는 것이 좋습니다. */}
              <img src={FilledStar} alt="FilledStar" className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 닉네임 섹션 */}
        <div className="space-y-2">
          <label
            htmlFor="nickname"
            className="text-sm font-medium text-gray-700"
          >
            닉네임
          </label>
          <div className="relative flex items-end border-b border-gray-300 focus-within:border-black">
            <input
              type="text"
              id="nickname"
              defaultValue="김철수"
              maxLength={12}
              className="flex-1 pb-2 text-lg bg-transparent focus:outline-none"
            />
            <span className="pb-2 text-sm text-gray-400">3/12</span>
          </div>
        </div>

        {/* 칭호 섹션 (가로 스크롤) */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">칭호</label>
          <div
            className="flex space-x-3 overflow-x-auto pb-2"
            // 스크롤바 숨김 (tailwind-scrollbar-hide 플러그인 없이)
            style={scrollbarHideStyle}
          >
            {/* Item 1 (Active) */}
            <div className="flex-shrink-0 flex flex-col items-center space-y-2 p-4 rounded-xl w-32 border-2 border-orange-500 bg-white cursor-pointer">
              <TitleIcon />
              <span className="text-sm font-medium text-orange-500">
                고독한 미식가
              </span>
            </div>
            {/* Item 2 (Inactive) */}
            <div className="flex-shrink-0 flex flex-col items-center space-y-2 p-4 rounded-xl w-32 bg-gray-100 cursor-pointer">
              <TitleIcon />
              <span className="text-sm font-medium text-gray-500">
                테이크아웃 장인
              </span>
            </div>
            {/* Item 3 (Inactive) */}
            <div className="flex-shrink-0 flex flex-col items-center space-y-2 p-4 rounded-xl w-32 bg-gray-100 cursor-pointer">
              <TitleIcon />
              <span className="text-sm font-medium text-gray-500">
                고독한 미식가
              </span>
            </div>
            {/* Item 4 (Inactive) - 스크롤을 위해 추가 */}
            <div className="flex-shrink-0 flex flex-col items-center space-y-2 p-4 rounded-xl w-32 bg-gray-100 cursor-pointer">
              <TitleIcon />
              <span className="text-sm font-medium text-gray-500">
                새로운 칭호
              </span>
            </div>
          </div>
        </div>

        {/* 성별 섹션 */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">성별</label>
          <div className="grid grid-cols-2 gap-3">
            {/* Selected Button (이미지 기준) */}
            <button className="py-3 px-6 rounded-lg bg-white text-black font-medium border border-gray-900">
              남
            </button>
            {/* Unselected Button */}
            <button className="py-3 px-6 rounded-lg bg-white text-gray-400 border border-gray-300">
              여
            </button>
          </div>
        </div>

        {/* 단골 가게 등록 섹션 */}
        <div className="space-y-3 pb-10">
          <label className="text-sm font-medium text-gray-700">
            단골 가게 등록
          </label>
          <div className="space-y-3">
            {/* Store 1 (Filled) */}
            <div className="flex items-center w-full p-3 rounded-lg bg-white border border-gray-300">
              <div className="flex-1">
                <span className="text-sm font-medium text-black">카페나무</span>
                <p className="text-xs text-gray-500">
                  서울 마포구 와우산로 94 롯폰기 1층 (상수)
                </p>
              </div>
              <button className="p-1 text-gray-400 hover:text-black">
                <img src={ThreeDots} alt="ThreeDots" className="w-6 h-6" />
              </button>
            </div>

            {/* Store 2 (Empty) */}
            <button className="flex items-center justify-center w-full py-5 rounded-lg bg-white border border-gray-300 text-gray-400 hover:border-gray-500 hover:text-gray-500 transition-colors">
              <img src={Plus} alt="Plus" className="w-6 h-6" />
            </button>

            {/* Store 3 (Empty) */}
            <button className="flex items-center justify-center w-full py-5 rounded-lg bg-white border border-gray-300 text-gray-400 hover:border-gray-500 hover:text-gray-500 transition-colors">
              <img src={Plus} alt="Plus" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSetting;
