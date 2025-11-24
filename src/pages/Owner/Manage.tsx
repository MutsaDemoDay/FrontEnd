import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OwnerBottomBar } from '../../components/OwnerBottomBar';
import goto_icon from '../../assets/goto_icon.png';
import logo_gt from '../../assets/logo_gt.png';

// 서버로부터 받아올 데이터 타입 정의
export interface StampSettingsResponse {
  storeName: string;
  requiredAmount: number;
  reward: string;
  maxCnt: number;
  imgurl: string | null;
}

export const Manage = () => {
  const navigate = useNavigate();

  // --- 상태 관리 ---
  const [stampSettings, setStampSettings] = useState<StampSettingsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- 네비게이션 핸들러 ---
  const handleGotoStampEarn = () => {
    navigate('/owner/stamp-earn');
  };

  const handleGotoStampSetting = () => {
    navigate('/owner/stampsetting');
  };

  const handleGotoQRGenerate = () => {
    navigate('/owner/qr-generate');
  };

  // --- 데이터 불러오기 ---
  useEffect(() => {
    const apiUri = import.meta.env.VITE_API_URI;
    const token = localStorage.getItem('accessToken');

    if (!token) return;

    const fetchData = async () => {
      try {
        // [Step 1] 가게 이름 가져오기
        const profileResponse = await fetch(`${apiUri}/v1/managers/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const profileJson = await profileResponse.json();
        let currentStoreName = '';

        if (profileJson.code === 100 && profileJson.data?.store) {
          currentStoreName = profileJson.data.store.storeName;
        } else {
          return;
        }

        // [Step 2] 스탬프 설정 조회하기
        if (currentStoreName) {
          const settingsResponse = await fetch(
            `${apiUri}/v1/stamps/manager/settings?storeName=${encodeURIComponent(currentStoreName)}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (settingsResponse.ok) {
            const settingsData: StampSettingsResponse = await settingsResponse.json();
            setStampSettings(settingsData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-full px-6 py-4">
      <h1 className="text-[25px] text-(--fill-color6) font-normal">
        Management
      </h1>

      <p className="mt-10 text-[18px] text-(--main-color) font-semibold">
        스탬프 관리
      </p>

      <div className="flex flex-col w-full gap-3">
        <div className="flex flex-row w-full justify-between mt-5 gap-3">
          <div className="w-1/2 h-[140px] bg-(--fill-color1) text-(--fill-color7) rounded-[20px] p-3 flex flex-col justify-between">
            <p className="font-semibold text-[14px]">스탬프 적립하기</p>
            <div className="flex flex-row self-end">
              <img
                src={goto_icon}
                alt="Go"
                className="w-[40px] h-[40px] cursor-pointer"
                onClick={handleGotoStampEarn}
              />
            </div>
          </div>
          <div className="w-1/2 h-[140px] bg-(--fill-color1) text-(--fill-color7) rounded-[20px] p-3 flex flex-col justify-between">
            <p className="font-semibold text-[14px]">QR 생성하기</p>
            <div className="flex flex-row self-end">
              <img
                src={goto_icon}
                alt="Go"
                className="w-[40px] h-[40px] cursor-pointer"
                onClick={handleGotoQRGenerate}
              />
            </div>
          </div>
        </div>

        {/* 스탬프 설정 박스 */}
        <div className="w-full h-[240px] flex flex-col p-4 px-5 bg-(--fill-color1) text-(--fill-color7) rounded-[20px] justify-between">
          <div className="w-full flex flex-row justify-between">
            <p className="text-[14px] text-(--fill-color7) font-semibold">
              스탬프 설정
            </p>
            <img
              src={logo_gt}
              alt="Go"
              className="w-[9px] h-[14px] mx-1 mt-1 cursor-pointer"
              onClick={handleGotoStampSetting}
            />
          </div>

          {/* --- 수정된 부분: 이미지 표시 영역 --- */}
          <div className="w-[140px] h-[90px] self-center flex items-center justify-center rounded-[10px] overflow-hidden bg-gray-100 mt-2 border border-gray-200">
            {isLoading ? (
              <p className="text-[12px] text-(--fill-color6)">로딩중...</p>
            ) : stampSettings?.imgurl ? (
              <img
                src={stampSettings.imgurl}
                alt="스탬프 디자인"
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-[12px] text-(--fill-color6)">기본 디자인</p>
            )}
          </div>
          {/* ---------------------------------- */}

          <div className="flex flex-row items-center justify-center gap-6">
            {/* 적립 금액 기준 */}
            <div className="flex flex-col mt-5">
              <p className="text-[12px] text-(--fill-color7) font-semibold">
                적립금액 기준
              </p>
              <p className="text-[12px] text-(--fill-color6) mt-4">
                {isLoading
                  ? '로딩중...'
                  : stampSettings
                  ? `${stampSettings.requiredAmount.toLocaleString()}원 이상`
                  : '설정 필요'}
              </p>
            </div>

            <div className="w-px h-20 bg-(--fill-color2) mt-4" />

            {/* 리워드 보상 */}
            <div className="flex flex-col mt-5">
              <p className="text-[12px] text-(--fill-color7) font-semibold">
                리워드 보상
              </p>
              <p className="text-[12px] text-(--fill-color6) mt-4">
                {isLoading
                  ? '로딩중...'
                  : stampSettings
                  ? stampSettings.reward
                  : '설정 필요'}
              </p>
            </div>

            <div className="w-px h-20 bg-(--fill-color2) mt-4" />

            {/* 디자인 텍스트 */}
            <div className="flex flex-col mt-5">
              <p className="text-[12px] text-(--fill-color7) font-semibold">
                스탬프 개수
              </p>
              <p className="text-[12px] text-(--fill-color6) mt-4">
                {isLoading 
                    ? '로딩중...' 
                    : stampSettings?.maxCnt
                      ? `${stampSettings.maxCnt}개`
                      : '설정 필요'}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-10 text-[18px] text-(--main-color) font-semibold">
          고객 관리
        </p>

        <div className="flex w-full h-15 bg-(--fill-color1) rounded-[20px] px-7 items-center">
          <p className="">스탬프 등록 고객</p>
        </div>
      </div>
      <OwnerBottomBar />
    </div>
  );
};