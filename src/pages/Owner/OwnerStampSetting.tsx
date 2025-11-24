import { useRef, useState, useEffect } from 'react';
import { BackButton3 } from '../../components/BackButton3';
import stamp_inform from '../../assets/stamp_inform.png';

// 서버로부터 받아올 데이터 타입 정의 (예시)
interface StampSettingsResponse {
  imageUrl?: string;
  minOrderAmount: number;
  rewardType: 'beverage' | 'other';
  stampCount: number;
}

export const OwnerStampSetting = () => {
  // --- 상태 관리 ---
  const [stampImagePreview, setStampImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 실제 파일 전송을 위해 파일 객체 상태 추가
  const [stampFile, setStampFile] = useState<File | null>(null);

  // 적립 조건 및 리워드
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [rewardType, setRewardType] = useState<'beverage' | 'other'>('beverage');
  const [stampCount, setStampCount] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStampFile(file); // 전송할 파일 객체 저장
      const previewUrl = URL.createObjectURL(file);
      setStampImagePreview(previewUrl);
    }
  };

  const onIncrease = () => {
    const currentCount = parseInt(stampCount) || 0;
    setStampCount((currentCount + 1).toString());
  };

  const onDecrease = () => {
    const currentCount = parseInt(stampCount) || 0;
    if (currentCount > 0) {
      setStampCount((currentCount - 1).toString());
    }
  };

  // --- 2. POST 요청: 설정 저장하기 ---
  const handleSubmit = async () => {
    const apiUri = import.meta.env.VITE_API_URI;
    try {
      const formData = new FormData();

      // (1) image: string($binary)
      // 사용자가 새 이미지를 업로드한 경우에만 추가
      if (stampFile) {
        formData.append('image', stampFile);
      }

      // (2) data: string (JSON 문자열)
      const settingsData = {
        minOrderAmount: parseInt(minOrderAmount) || 0,
        rewardType: rewardType,
        stampCount: parseInt(stampCount) || 0,
      };
      
      // 객체를 JSON 문자열로 변환하여 'data' 필드에 추가
      formData.append('data', JSON.stringify(settingsData));

      // 전송
      const response = await fetch(`${apiUri}/v1/stamps/settings`, {
        method: 'POST',
        body: formData, // FormData 전송 시 Content-Type은 브라우저가 자동 설정
      });

      if (response.ok) {
        // 성공 시 로직 (예: 페이지 이동 또는 알림)
        alert('저장되었습니다.');
        console.log('Settings saved successfully');
      } else {
        const errorText = await response.text();
        console.error('Failed to save settings:', errorText);
        alert('저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="w-full h-screen flex flex-col p-4">
      <BackButton3 />
      <div className="p-6">
        <h1 className="text-[25px] text-(--fill-color6) font-semibold">
          스탬프 설정
        </h1>
      </div>

      <div className="w-full flex flex-col items-center justify-center">
        {' '}
        <div className="w-[330px] flex flex-col items-center mt-12">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          <img
            src={stamp_inform}
            alt="Stamp Information"
            className="w-[330px] h-[57px]"
          />

          <div className="w-full flex flex-row items-center justify-between mt-5">
            <p className="text-[14px] text-[#5B5B5B]">
              스탬프
              <br />
              디자인
            </p>
            <div
              className="w-[70%] h-[160px] bg-white rounded-lg border border-dashed border-gray-400 flex items-center justify-center overflow-hidden relative cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {stampImagePreview ? (
                <img
                  src={stampImagePreview}
                  alt="Stamp Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <span className="text-2xl mb-1">+</span>
                  <span className="text-xs">이미지를 첨부해주세요</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* 5. 적립 금액 조건 */}
        <div className="w-full mt-9 flex flex-row items-center justify-between px-4">
          <p className="text-[14px] text-[#5B5B5B] font-medium">
            적립 금액 조건
          </p>
          <div className="flex items-center border-b border-gray-300 mt-2 flex-grow justify-end ml-4">
            <input
              type="number"
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(e.target.value)}
              placeholder="5000"
              className="w-24 h-full p-2 focus:outline-none text-right"
            />
            <span className="text-gray-600 text-sm ml-1">원 이상</span>
          </div>
        </div>
      </div>

      {/* 6. 리워드 보상 선택 */}
      <div className="w-full flex flex-col px-4">
        <div className="w-full mt-9 flex flex-row items-center justify-between">
          <p className="text-[15px] text-[#5B5B5B] font-medium">리워드 보상</p>
          <div className="flex flex-row gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="reward"
                value="beverage"
                checked={rewardType === 'beverage'}
                onChange={() => setRewardType('beverage')}
                className="w-5 h-5 accent-black"
              />
              <span className="text-sm">매장 음료 1잔</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="reward"
                value="other"
                checked={rewardType === 'other'}
                onChange={() => setRewardType('other')}
                className="w-5 h-5 accent-black"
              />
              <span className="text-sm">기타 아이템</span>
            </label>
          </div>
        </div>
      </div>

      <div className="w-full mt-9 flex flex-row items-center px-4">
        <p className="text-[14px] text-[#5B5B5B] font-medium mr-8">
          스탬프판 내<br /> 스탬프 개수
        </p>
        <button onClick={onDecrease}>-</button>
        <input
          type="number"
          value={stampCount}
          onChange={(e) => setStampCount(e.target.value)}
          placeholder="10"
          className="h-full p-2 focus:outline-none text-center w-16 mx-2 border-b border-gray-300"
        />
        <button onClick={onIncrease}>+</button>
      </div>

      <button
        className="bg-(--main-color) text-white rounded-[40px] w-[316px] h-[50px] font-bold self-center mt-16"
        onClick={handleSubmit}
      >
        저장
      </button>
    </div>
  );
};