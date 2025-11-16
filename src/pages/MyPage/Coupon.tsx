import React from 'react';
import BackButton from '../../components/BackButton';
import FilledStar from '../../assets/filledstar.svg';
import { UserBottomBar } from '../../components/UserBottomBar';

const Coupon: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* 1. 헤더 (뒤로가기 버튼) */}
      <header className="flex items-center p-4 border-b border-gray-100">
        <BackButton />
      </header>

      {/* 2. 메인 컨텐츠 (중앙 정렬) */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 pb-20">
        {/* QR 코드 플레이스홀더 */}
        <div className="w-56 h-56 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
          {/* 실제 QR 코드 컴포넌트나 이미지가 이곳에 들어갑니다. */}
          <img src={FilledStar} alt="FilledStar" className="w-6 h-6" />
        </div>

        {/* 유효시간 */}
        <p className="text-sm font-medium text-gray-700 mb-4">
          QR코드 유효시간 <span className="text-red-500 font-bold">00:00</span>
        </p>

        {/* 쿠폰명 */}
        <h1 className="text-2xl font-bold mb-3">생일 쿠폰</h1>

        {/* 설명 */}
        <p className="text-sm text-gray-600 max-w-xs mb-4 leading-relaxed">
          본 어플과 제휴된 매장에서 제조된 음료
          <br />
          50%를 할인받을 수 있습니다.
        </p>

        {/* 기한 */}
        <p className="text-sm text-gray-500">기한: 2024.01.01까지</p>
      </div>
      <UserBottomBar />
    </div>
  );
};

export default Coupon;
