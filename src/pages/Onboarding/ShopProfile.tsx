import { useState, useRef } from 'react';
import addProfile from '../../assets/addProfile.png';
import stamp_inform from '../../assets/stamp_inform.png';

// UI용 요일 배열
const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

// API 전송용 요일 배열 (인덱스 매칭)
const API_DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

// 카테고리 목록 상수
const CATEGORIES = [
  '커피 전문',
  '베이커리',
  '테이크아웃 전문',
  '체험형 카페',
  '테마 카페',
  '기타',
];

const CATEGORY_MAP: { [key: string]: string } = {
  '커피 전문': 'COFFEE',
  '베이커리': 'BAKERY',
  '테이크아웃 전문': 'TAKEOUT',
  '체험형 카페': 'EXPERIENCE',
  '테마 카페': 'THEME',
  '기타': 'ETC',
};

interface DailyHour {
  day: string;
  start: string;
  end: string;
}

// API 명세서에 따른 영업시간 DTO
interface BusinessHourDto {
  day: string;       // "MON", "TUE", ...
  openTime: string;  // "10:00"
  closeTime: string; // "21:00"
  isHoliday: boolean;
}

// API 명세서에 따른 전체 요청 DTO
interface ShopProfileRequest {
  storeImageUrl: string;
  storeName: string;
  category: string;
  phone: string;
  businessHours: BusinessHourDto[];
  stampImageUrl: string;
  requiredAmount: number;
  reward: string;
}

export const ShopProfile = () => {
  // 1. 기본 정보
  const [storeName, setStoreName] = useState('');
  const [category, setCategory] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  // 2. 영업 시간 (월~일 초기화)
  const [weeklyHours, setWeeklyHours] = useState<DailyHour[]>(
    DAYS.map((day) => ({ day, start: '', end: '' }))
  );

  // 3. 스탬프 이미지
  const [stampImagePreview, setStampImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 실제 파일 전송을 위해 파일 객체 상태 추가 (추후 이미지 업로드 API 연동 시 필요)
  const [stampFile, setStampFile] = useState<File | null>(null);

  // 4. 적립 조건 및 리워드
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [rewardType, setRewardType] = useState<'beverage' | 'other'>('beverage');

  // --- Handlers ---

  // 영업 시간 변경 핸들러
  const handleTimeChange = (
    index: number,
    field: 'start' | 'end',
    value: string
  ) => {
    const newHours = [...weeklyHours];
    newHours[index][field] = value;
    setWeeklyHours(newHours);
  };

  // 월요일 시간 모두 동일하게 적용 핸들러
  const handleCopyMondayTime = () => {
    const monday = weeklyHours[0];
    if (!monday.start || !monday.end) {
      alert('월요일 시간을 먼저 입력해주세요.');
      return;
    }
    const newHours = weeklyHours.map((dayInfo) => ({
      ...dayInfo,
      start: monday.start,
      end: monday.end,
    }));
    setWeeklyHours(newHours);
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStampFile(file); // 파일 객체 저장
      const previewUrl = URL.createObjectURL(file);
      setStampImagePreview(previewUrl);
    }
  };

  const handleSubmit = async () => {
    if (!storeName) return alert('매장명을 입력해주세요.');
    if (!category) return alert('카테고리를 선택해주세요.');

    // 2. Business Hours 변환
    const businessHoursPayload: BusinessHourDto[] = weeklyHours.map((item, index) => {
      // 시작/종료 시간이 없으면 휴무일로 처리하는 로직
      const isHoliday = !item.start || !item.end;
      return {
        day: API_DAYS[index], // '월' -> 'MON'
        openTime: item.start || '00:00',
        closeTime: item.end || '00:00',
        isHoliday: isHoliday,
      };
    });

    // 3. 리워드 텍스트 결정
    // UI에는 '음료' vs '기타' 선택지만 있으므로, API 예시에 맞춰 문자열 생성
    // 실제로는 '기타' 선택 시 텍스트 입력 필드가 필요할 수 있음
    const rewardString = rewardType === 'beverage' ? '매장음료 1잔' : '기타 아이템';

    // 4. 최종 Payload 생성
    const payload: ShopProfileRequest = {
      // [TODO] 실제 이미지 업로드 로직 구현 후 반환된 URL 사용 필요
      storeImageUrl: "https://example.com/images/my_store_profile.png", 
      
      storeName: storeName,
      category: CATEGORY_MAP[category] || 'ETC', // 매핑된 영문 값 사용
      
      phone: phoneNumber,
      businessHours: businessHoursPayload,
      
      // [TODO] 스탬프 이미지 업로드 후 반환된 URL 사용 필요
      stampImageUrl: stampImagePreview ? "https://example.com/images/stamp_design_01.png" : "", 
      
      requiredAmount: Number(minOrderAmount.replace(/,/g, '')) || 0, // 콤마 제거 및 숫자 변환
      reward: rewardString
    };

    // 5. API 호출 (콘솔 출력으로 대체)
    console.log("========== [API 요청 데이터] ==========");
    console.log(JSON.stringify(payload, null, 2));
    

    try {
      const response = await fetch('/v1/auth/manager/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      console.log('성공:', result);
    } catch (error) {
      console.error('실패:', error);
    }
    alert("저장 데이터가 콘솔에 출력되었습니다.");

  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* 구분선 */}
      <div className="mt-10 h-px bg-gray-100" />

      {/* 안내문구 */}
      <div className="flex flex-col px-7 items-start mt-12">
        <div className="flex flex-col h-[82px]">
          <p className="text-[34px] font-semibold">심사가 완료됐어요!</p>
          <p className="text-[20px] mt-4">매장 프로필 설정을 시작하세요.</p>
        </div>
      </div>

      {/* 구분선 */}
      <div className="mt-10 h-px bg-gray-100" />

      {/* 프로필 설정 폼 */}
      <div className="w-full px-7 flex flex-col items-start mt-4">
        <p className="h-[42px] text-orange-500 text-[18px] font-semibold">
          매장 설정
        </p>

        {/* 대표 이미지 (수정됨: 로컬 이미지 제거) */}
        <div className="relative w-full h-[120px] mt-6 justify-center font-medium">
          <p className="absolute top-1/2 text-[15px] self-start leading-1 -translate-y-1/2">
            대표 이미지
          </p>
          <img
            src={addProfile}
            alt="Add Profile"
            className="w-[120px] h-[120px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full object-cover bg-gray-100"
          />
        </div>

        {/* 매장명 */}
        <div className="w-full mt-9">
          <p className="text-[15px] font-medium">매장명</p>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full border-b border-gray-300 mt-2 p-2 focus:outline-none"
          />
        </div>

        {/* 1. 매장 카테고리 (드롭다운) */}
        <div className="w-full mt-9 relative">
          <p className="text-[15px] font-medium">매장 카테고리</p>
          <div
            className="w-full h-[50px] border border-gray-300 mt-2 p-4 flex justify-between items-center cursor-pointer rounded-[10px]"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className={category ? 'text-black' : 'text-gray-400'}>
              {category || '카테고리 선택'}
            </span>
            {/* 아래 화살표 아이콘 */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-5 h-5 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>

          {/* 드롭다운 메뉴 */}
          {isDropdownOpen && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-[200px] overflow-y-auto">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setCategory(cat);
                    setIsDropdownOpen(false);
                  }}
                >
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. 대표 번호 */}
        <div className="w-full mt-9">
          <p className="text-[15px] font-medium">대표 번호</p>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder=""
            className="w-full h-[50px] rounded-[10px] border border-gray-300 mt-2 p-2 focus:outline-none"
          />
        </div>

        {/* 3. 영업 시간 */}
        <div className="w-full mt-9">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[15px] font-medium">영업 시간</p>
            <button
              onClick={handleCopyMondayTime}
              className="text-xs bg-gray-200 px-3 py-1 rounded-full text-gray-600 hover:bg-gray-300 transition-colors"
            >
              모두 동일
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {weeklyHours.map((item, index) => (
              <div key={item.day} className="flex items-center justify-between">
                <span className="w-8 text-sm font-medium text-gray-600">
                  {item.day}
                </span>
                <div className="flex items-center gap-2 w-[calc(100%-40px)]">
                  <input
                    type="time"
                    value={item.start}
                    onChange={(e) =>
                      handleTimeChange(index, 'start', e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  <span className="text-gray-400">~</span>
                  <input
                    type="time"
                    value={item.end}
                    onChange={(e) =>
                      handleTimeChange(index, 'end', e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. 스탬프 디자인 (이미지 첨부) - 수정됨: 로컬 이미지 제거 */}
        <div className="w-full flex flex-col items-center mt-12">
          <p className="text-[18px] text-orange-500 font-semibold mb-3 self-start">
            스탬프 설정
          </p>
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
        <div className="w-full mt-9 flex flex-row items-center justify-between">
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

        {/* 6. 리워드 보상 선택 */}
        <div className="w-full mt-9 flex flex-row items-center justify-between">
          <p className="text-[15px] font-medium">리워드 보상</p>
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

        {/* 저장 버튼 */}
        <button 
          onClick={handleSubmit}
          className="w-full h-[56px] mt-12 bg-orange-500 text-white rounded-[40px] font-bold text-lg cursor-pointer hover:bg-orange-600 transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  );
};