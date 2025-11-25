import React from 'react';
import { type StoreDetail } from '../../type/Store';

// 이미지 import
import clock from '../../assets/clock.png';
import phone_icon from '../../assets/phone_icon.png';
import internet_icon from '../../assets/internet_icon.png';
import instagram_icon from '../../assets/instagram_icon.png';
import default_store_stamp from '../../assets/store_stamp.png';
import gift_icon from '../../assets/gift_icon.png';

interface StoreInfoHomeProps {
  storeDetail: StoreDetail | null;
}


export const StoreInfoHome: React.FC<StoreInfoHomeProps> = ({
  storeDetail,
}) => {
  return (
    <>
      <div className="flex flex-col w-full h-[120px]">
        {/* 영업 시간 (API의 message 필드 사용) */}
        <div className="flex flex-row w-full h-[40px] items-center gap-3 border-b border-t border-[var(--fill-color1)] px-6 ">
          <img src={clock} alt="" className="w-[20px] h-[20px]" />
          <p className="text-[14px] text-[var(--fill-color7)] font-medium">
            {storeDetail?.status || '영업 정보'}
          </p>
          <p className="text-[14px] text-[var(--fill-color5)] font-medium">
            {storeDetail?.message || ''}
          </p>
        </div>

        {/* 전화번호 */}
        <div className="flex flex-row w-full h-[40px] items-center gap-3 border-b border-[var(--fill-color1)] px-6 ">
          <img src={phone_icon} alt="" className="w-[20px] h-[20px]" />
          <p className="text-[14px] text-[var(--fill-color7)] font-medium">
            {storeDetail?.phone || '정보 없음'}
          </p>
        </div>

        {/* 링크 & SNS */}
        <div className="flex flex-row w-full h-[40px] items-center border-b border-[var(--fill-color1)] px-6 ">
          <div className="w-1/2 flex flex-row items-center gap-3">
            <img src={internet_icon} alt="" className="w-[20px] h-[20px]" />
            <a
              href={storeDetail?.storeUrl || '#'}
              className="text-[14px] text-[var(--fill-color7)] font-medium truncate"
            >
              {storeDetail?.storeUrl ? '홈페이지' : '정보 없음'}
            </a>
          </div>
          <div className="w-1/2 flex flex-row items-center gap-3">
            <img src={instagram_icon} alt="" className="w-[20px] h-[20px]" />
            <a
              href={storeDetail?.sns || '#'}
              className="text-[14px] text-[var(--fill-color7)] font-medium truncate"
            >
              {storeDetail?.sns ? 'SNS' : '정보 없음'}
            </a>
          </div>
        </div>
      </div>

      {/* 스탬프 영역 */}
      <div className="w-full h-[360px] bg-[var(--fill-color1)]">
        <div className="w-full h-[46px] px-6 items-center flex">
          <p className="text-[#72594B] font-semibold text-[18px]">Stamp</p>
        </div>
        <div className="h-px bg-[var(--fill-color2)]" />
        <div className="flex flex-col items-center justify-center w-full">
          <img
            src={storeDetail?.stampImageUrl || default_store_stamp}
            alt="Store Stamp"
            className="w-[220px] h-[144px] mt-5 object-contain"
          />
          <div className="flex flex-row gap-2 items-center mt-5">
            <img src={gift_icon} alt="" className="w-[18px] h-[18px]" />
            <p className="text-[12px] text-[var(--fill-color6)]">
              리워드 보상:
            </p>
            <p className="text-[12px] text-[var(--fill-color5)]">
              {storeDetail?.reward || '매장 보상 정보'}
            </p>
          </div>
          <button className="w-[292px] h-[52px] bg-[var(--main-color)] text-[var(--fill-color1)] text-[16px] font-semibold rounded-[30px] mt-6 cursor-pointer">
            스탬프 등록하기
          </button>
        </div>
      </div>

      {/* 시그니처 메뉴 (동적 렌더링) */}
      <div className="w-full pb-10">
        <div className="w-full h-[54px] flex items-center px-6">
          <p className="text-[var(--main-color2)] font-semibold text-[18px]">
            Signature Menu
          </p>
        </div>
        <div className="h-px bg-[var(--fill-color2)]" />

        {/* 메뉴 리스트 매핑 */}
        {storeDetail?.signatureMenus &&
        storeDetail.signatureMenus.length > 0 ? (
          storeDetail.signatureMenus.map((menu, index) => (
            <div
              key={index}
              className="w-full h-[160px] justify-center items-center flex border-b border-[var(--fill-color2)] last:border-0"
            >
              <div className="flex flex-row items-center w-[350px] h-[120px]">
                <img
                  src={menu.menuImageUrl}
                  alt={menu.menuName}
                  className="w-[120px] h-[120px] object-cover rounded-md"
                />
                <div className="w-[212px] h-[100px] flex flex-col justify-center ml-5">
                  <p className="text-[var(--main-color2)] font-semibold text-[16px]">
                    {menu.menuName}
                  </p>
                  <p className="text-[var(--fill-color5)] text-[14px]">
                    {menu.content}
                  </p>
                  <p className="text-[var(--fill-color7)] text-[14px] mt-auto">
                    {menu.price.toLocaleString()}원
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-[160px] flex items-center justify-center text-[var(--fill-color5)] text-[14px]">
            등록된 대표 메뉴가 없습니다.
          </div>
        )}
      </div>
    </>
  );
};
