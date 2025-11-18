import { BackButton2 } from '../../components/BackButton2';
import heart_share from '../../assets/heart_share.png';
import clock from '../../assets/clock.png';
import phone_icon from '../../assets/phone_icon.png';
import internet_icon from '../../assets/internet_icon.png';
import instagram_icon from '../../assets/instagram_icon.png';
import store_stamp from '../../assets/store_stamp.png';
import gift_icon from '../../assets/gift_icon.png';
import americano from '../../assets/americano.png';
import { useState } from 'react';

export const StoreInfo = () => {
  const [selectedTab, setSelectedTab] = useState<'home' | 'review'>('home');

  const HomeTabContent = () => (
    <>
      <div className="flex flex-col w-full h-[120px]">
        <div className="flex flex-row w-full h-[40px] items-center gap-3 border-b border-t border-(--fill-color1) px-6 ">
          <img src={clock} alt="" className="w-[20px] h-[20px]" />
          <p className="text-[14px] text-(--fill-color7) font-medium">
            영업 중
          </p>
          <p className="text-[14px] text-(--fill-color5) font-medium">
            24:00까지
          </p>
        </div>
        <div className="flex flex-row w-full h-[40px] items-center gap-3 border-b border-t border-(--fill-color1) px-6 ">
          <img src={phone_icon} alt="" className="w-[20px] h-[20px]" />
          <p className="text-[14px] text-(--fill-color7) font-medium">
            010-0000-0000
          </p>
        </div>
        <div className="flex flex-row w-full h-[40px] items-center border-b border-t border-(--fill-color1) px-6 ">
          <div className="w-1/2 flex flex-row items-center gap-3">
            <img src={internet_icon} alt="" className="w-[20px] h-[20px]" />
            <p className="text-[14px] text-(--fill-color7) font-medium">
              http:www.com
            </p>
          </div>
          <div className="w-1/2 flex flex-row items-center gap-3">
            <img src={instagram_icon} alt="" className="w-[20px] h-[20px]" />
            <p className="text-[14px] text-(--fill-color7) font-medium">
              @instagramid{' '}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-[360px] bg-(--fill-color1)">
        <div className="w-full h-[46px] px-6 items-center flex">
          {' '}
          <p className="text-[#72594B] font-semibold text-[18px]">Stamp</p>
        </div>

        {/* 구분선 */}
        <div className="h-px bg-(--fill-color2)" />

        <div className="flex flex-col items-center justify-center w-full">
          <img
            src={store_stamp}
            alt="Store Stamp"
            className="w-[220px] h-[144px] mt-5"
          />
          <div className="flex flex-row gap-2 items-center mt-5">
            <img src={gift_icon} alt="" className="w-[18px] h-[18px]" />
            <p className="text-[12px] text-(--fill-color6)">리워드 보상:</p>
            <p className="text-[12px] text-(--fill-color5)">매장 음료 1잔</p>
          </div>
          <button className="w-[292px] h-[52px] bg-(--main-color) text-(--fill-color1) text-[16px] font-semibold rounded-[30px] mt-6">
            스탬프 등록하기
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="w-full h-[54px] flex items-center px-6">
          <p className="text-(--main-color2) font-semibold text-[18px]">
            Signature Menu
          </p>
        </div>

        {/* 구분선 */}
        <div className="h-px bg-(--fill-color2)" />

        <div className="w-full h-[160px] justify-center items-center flex">
          <div className="flex flex-row items-center w-[350px] h-[120px]">
            <img src={americano} alt="" className="w-[120px] h-[120px]" />
            <div className="w-[212px] h-[100px] flex flex-col justify-center ml-5">
              <p className="text-(--main-color2) font-semibold text-[16px]">
                Americano
              </p>
              <p className="text-(--fill-color5) text-[14px]">
                원두와 물 그리고 얼음
              </p>
              <p className="text-(--fill-color7) text-[14px] mt-9">4,500원</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const ReviewTabContent = () => (
    <div className="w-full p-10 text-center text-gray-500">
      <div className="flex flex-col items-center justify-center w-full h-[160px]">
        <div className="flex flex-row justify-center items-center">
          <p className="text-[14px] text-(--fill-color7)">2025년 01월 01일</p>
          <p>
            에 해당 가게 스탬프를 완료했어요. <br />
            방문 후기를 남겨주세요!
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col">
      <div className="w-full h-[220px] bg-amber-100">
        <div className="w-full flex justify-between items-start">
          <BackButton2 />
          <img
            src={heart_share}
            alt="공유하기"
            className="w-[80px] h-[40px] m-3"
          />
        </div>
      </div>

      <div className="w-full h-[180px] flex flex-col items-center justify-around px-6">
        <div className="flex flex-row items-center">
          <p className="text-(--fill-color7) font-semibold text-[24px] mr-5">
            카페나무
          </p>
          <p className="text-(--fill-color6) font-medium text-[14px]">
            커피 전문
          </p>
        </div>
        <div className="flex flex-row items-center gap-5">
          <p className="text-(--fill-color4) text-[12px]">8.3km</p>
          <p className="text-(--fill-color4) text-[12px]">
            서울 마포구 와우산로 94 홍문관 1층 (상수동)
          </p>
        </div>
        <div className="flex flex-row justify-center items-center w-full h-[54px] bg-(--fill-color1) rounded-[50px]">
          <div className="flex w-1/2 justify-center items-center">
            <button
              className={`w-[calc(100%-20px)] transition-all ${
                selectedTab === 'home'
                  ? 'bg-white h-[40px] rounded-[30px]'
                  : 'h-[40px] text-gray-500'
              }`}
              onClick={() => setSelectedTab('home')}
            >
              홈
            </button>
          </div>
          <div className="flex w-1/2 justify-center items-center">
            <button
              className={`w-[calc(100%-20px)] transition-all ${
                selectedTab === 'review'
                  ? 'bg-white h-[40px] rounded-[30px]'
                  : 'h-[40px] text-gray-500'
              }`}
              onClick={() => setSelectedTab('review')}
            >
              리뷰
            </button>
          </div>
        </div>
      </div>

      {selectedTab === 'home' ? <HomeTabContent /> : <ReviewTabContent />}
    </div>
  );
};
