import React from 'react';
import { UserBottomBar } from '../../components/UserBottomBar';
import BackButton from '../../components/BackButton';
// 이미지 import (사용자가 제공한 경로 유지)
import HeartShare from '../../assets/heart_share.png';
import Phone from '../../assets/phone_icon.png';
import instagram from '../../assets/instagram_icon.png';
import internet from '../../assets/internet_icon.png';
import gift from '../../assets/gift_icon.png';
//import coffee from '../../assets/coffee_icon.png';

export const StampRegistration4 = () => {
  // 스탬프 더미 데이터 (10개 중 7개 채워짐 예시)
  const stamps = Array(10)
    .fill(false)
    .map((_, i) => i < 7);

  return (
    <div className="w-[430px] min-h-screen bg-white flex flex-col mx-auto relative shadow-lg">
      {/* 상단 영역 (스크롤 가능) */}
      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        {/* 1. 매장 이미지 헤더 */}
        <div className="relative w-full h-60">
          <img
            src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000&auto=format&fit=crop"
            alt="매장 이미지"
            className="w-full h-full object-cover"
          />
          {/* 헤더 버튼들 */}
          <div className="absolute top-4 left-4">
            <BackButton />
          </div>
          <div className="absolute top-4 right-4 cursor-pointer">
            <img
              src={HeartShare}
              alt="좋아요 공유"
              className="w-20 h-auto object-contain"
            />
          </div>
        </div>

        {/* 2. 매장 정보 섹션 */}
        <div className="px-6 pt-6 pb-4 bg-white">
          <div className="flex items-end gap-2 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">카페나무</h1>
            <span className="text-sm text-gray-400 mb-1">커피전문</span>
          </div>
          <p className="text-xs text-gray-400 mb-6">
            8.3km &nbsp;|&nbsp; 서울 마포구 와우산로 94 홍문관 1층 (상수동)
          </p>

          {/* 연락처 정보 */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <div className="flex items-center gap-3">
              <img src={Phone} alt="전화" className="w-4 h-4 opacity-60" />
              <span className="text-sm text-gray-600">010-1234-5678</span>
            </div>
            <div className="flex items-center gap-3">
              <img
                src={internet}
                alt="웹사이트"
                className="w-4 h-4 opacity-60"
              />
              <span className="text-sm text-gray-600">cafenamu.com</span>
            </div>
            <div className="flex items-center gap-3">
              <img
                src={instagram}
                alt="인스타그램"
                className="w-4 h-4 opacity-60"
              />
              <span className="text-sm text-gray-600">@cafenamu</span>
            </div>
          </div>
        </div>

        {/* 3. 스탬프 섹션 (회색 배경) */}
        <div className="bg-[#F6F6F6] px-6 py-6 min-h-[300px]">
          <h2 className="text-[#8C7E74] font-bold mb-4 text-lg">Stamp</h2>

          {/* 스탬프 카드 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center">
            <div className="grid grid-cols-5 gap-x-4 gap-y-6 mb-6">
              {stamps.map((isFilled, index) => (
                <div key={index} className="flex items-center justify-center">
                  <img
                    src={gift}
                    alt="스탬프"
                    className={`w-6 h-6 object-contain ${
                      isFilled ? '' : 'opacity-30 grayscale'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* 말풍선 텍스트 (디자인 유사하게) */}
            <div className="bg-gray-200 px-3 py-1 rounded-full text-[10px] text-gray-600 font-medium mb-2">
              스탬프 10개 아메리카노 1잔 무료로 드려요.
            </div>
          </div>

          {/* 리워드 정보 */}
          <div className="flex items-center justify-center gap-2 mt-6 text-gray-500 text-sm font-medium">
            <img
              src={gift}
              alt="리워드"
              className="w-[18px] h-[18px] object-contain"
            />
            <span>리워드 보상: 매장 음료 1잔</span>
          </div>

          {/* 등록하기 버튼 */}
          <div className="mt-8 mb-4">
            <button className="w-full bg-[#FF6B00] text-white py-4 rounded-full font-bold text-lg shadow-md hover:bg-orange-600 transition-colors">
              스탬프 등록하기
            </button>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 바 (고정) */}
      <UserBottomBar />
    </div>
  );
};
