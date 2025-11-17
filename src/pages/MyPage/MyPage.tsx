import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

import BackButton from '../../components/BackButton';
import StampsSection from '../../components/StampSection';

import Setting from '../../assets/setting.svg';
//import Plus from '../../assets/plus.svg';
//import ThreeDots from '../../assets/threedots.svg';
import DownButton from '../../assets/downbutton.svg';
import FilledStar from '../../assets/filledstar.svg';
import EmptyStar from '../../assets/emptystar.svg';

import { UserBottomBar } from '../../components/UserBottomBar';

// 페이지 전체를 감싸는 컨테이너
export default function MyPage() {
  return (
    <div className="w-[393px] min-h-screen bg-gray-100 mx-auto border border-gray-300 overflow-y-auto">
      {/* 1. 상단 헤더 */}
      <Header />

      <main className="flex flex-col">
        {/* 2. 프로필 카드 */}
        <ProfileCard />

        {/* 구분선 */}
        <div className="h-2 bg-gray-100"></div>

        {/* 3. 현재 스탬프 섹션 */}
        <StampsSection />

        {/* 구분선 */}
        <div className="h-2 bg-gray-100"></div>

        {/* 4. 뱃지 섹션 */}
        <BadgesSection />

        {/* 구분선 */}
        <div className="h-2 bg-gray-100"></div>

        {/* 5. 리뷰 섹션 */}
        <ReviewsSection />
      </main>
    </div>
  );
}

// 1. 상단 헤더 컴포넌트
const Header = () => (
  <header className="bg-white p-4 flex justify-between items-center sticky top-0 z-10 border-b border-gray-200">
    {/* <ArrowLeft className="w-6 h-6 text-gray-800" /> */}
    <BackButton />
    <Link to="/mypage/setting">
      <img src={Setting} alt="Setting" className="w-6 h-6" />
    </Link>
  </header>
);

// 2. 프로필 카드 컴포넌트 (프로필 + 스탯)
const ProfileCard = () => (
  <div className="bg-white p-6 flex flex-col items-center">
    {/* 프로필 이미지 placeholder */}
    <div className="w-24 h-24 bg-gray-200 rounded-lg mb-4"></div>

    <h1 className="text-2xl font-bold mb-2">닉네임</h1>

    {/* 뱃지 */}
    <div className="flex gap-2 my-2">
      <span className="text-xs text-white bg-gray-800 px-3 py-1 rounded-full">
        라떼 마스터
      </span>
      <span className="text-xs text-white bg-gray-800 px-3 py-1 rounded-full">
        고독한 미식가
      </span>
    </div>

    {/* 스탯 (스탬프, 뱃지, 리뷰) */}
    <div className="flex justify-around w-full mt-6">
      <StatItem count={7} label="현재 스탬프" />
      <StatItem count={2} label="뱃지" />
      <StatItem count={10} label="리뷰" />
    </div>
  </div>
);

// 프로필 스탯 아이템
const StatItem = ({ count, label }: { count: number; label: string }) => (
  <div className="text-center">
    <span className="text-2xl font-bold block">{count}</span>
    <span className="text-sm text-gray-500">{label}</span>
  </div>
);

// [수정 3] 'StampsSection' 컴포넌트 정의 삭제
// const StampsSection = () => ( ... );

// 4. 뱃지 섹션
const BadgesSection = () => (
  <div className="bg-white rounded-lg p-4">
    {/* 섹션 헤더 */}
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-bold text-lg">뱃지(2)</h2>
      <img src={DownButton} alt="DownButton" className="w-6 h-6" />
    </div>

    {/* 뱃지 목록 */}
    <div className="flex gap-4">
      <BadgeItem label="고독한 미식가" />
      <BadgeItem label="라떼 마스터" />
    </div>
  </div>
);

// 뱃지 아이템
const BadgeItem = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center gap-2">
    {/* 뱃지 이미지 (이미지 재현) */}
    <div className="w-20 h-20 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center relative overflow-hidden">
        <div className="w-12 h-12 rounded-full border-[3px] border-white"></div>
        <div className="absolute w-10 h-[3px] bg-white rotate-90"></div>
        <div className="absolute w-10 h-[3px] bg-white"></div>
        <div className="absolute w-10 h-[3px] bg-white rotate-45"></div>
        <div className="absolute w-10 h-[3px] bg-white -rotate-45"></div>
      </div>
    </div>
    <span className="text-sm text-gray-700">{label}</span>
  </div>
);

// 5. 리뷰 섹션
const ReviewsSection = () => (
  <div className="bg-white rounded-lg p-4">
    {/* 섹션 헤더 */}
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-bold text-lg">리뷰(10)</h2>
      <img src={DownButton} alt="DownButton" className="w-6 h-6" />
    </div>

    {/* 리뷰 목록 */}
    <div className="flex flex-col gap-8">
      <ReviewItem />
      <ReviewItem />
    </div>
  </div>
);

// 리뷰 아이템
const ReviewItem = () => (
  <div className="flex flex-col gap-2">
    {/* 리뷰 헤더 */}
    <div className="flex justify-between items-center">
      <h3 className="font-bold">카페나무</h3>
      <span className="text-xs text-(--fill-color3)">2025. 08. 04</span>
    </div>

    {/* 별점 */}
    <div className="flex">
      <img src={FilledStar} alt="FilledStar" className="w-6 h-6" />
      <img src={FilledStar} alt="FilledStar" className="w-6 h-6" />
      <img src={FilledStar} alt="FilledStar" className="w-6 h-6" />
      <img src={EmptyStar} alt="EmptyStar" className="w-6 h-6" />
      <img src={EmptyStar} alt="EmptyStar" className="w-6 h-6" />
    </div>

    {/* 이미지 Placeholder (체크무늬 대신 회색 배경 사용) */}
    <div className="w-full aspect-square bg-gray-200 rounded-lg mt-2"></div>

    {/* 리뷰 텍스트 */}
    <p className="text-sm text-gray-700 mt-2">
      집 근처에 즌 카페가 여기라 한번 가봤는데 너무 좋아요
    </p>
    <UserBottomBar />
  </div>
);
