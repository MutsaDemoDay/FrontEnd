import React, { useState, useMemo } from 'react';
import wallet_logo from '../../assets/wallet_logo.png';
import reward_logo from '../../assets/reward_logo.png';
import review_logo from '../../assets/review_theme_icon.png'; // 리뷰 아이콘이 없다면 reward_logo 등을 임시 사용하거나 import 필요
import { UserBottomBar } from '../../components/UserBottomBar';
import question_icon from '../../assets/question_icon.png';
import { useNavigate } from 'react-router-dom';

// API 응답 데이터 타입 정의
interface StampHistoryResponse {
  totalStampSum: number;
  completedStampNum: number;
  completedStamps: {
    storeName: string;
    storeAddress: string;
    issuedDate: string;
  }[];
}

// 레벨별 혜택 데이터 (RewardInfo.tsx와 데이터 동기화)
const LEVEL_BENEFITS = [
  {
    level: 1,
    wallet: '기본 지갑 테마',
    badge: '"원두 탐험가" 뱃지 획득',
    extra: null,
  },
  {
    level: 2,
    wallet: '초급 지갑 테마',
    badge: '"브루 수련생" "카페 수집가" 뱃지 획득',
    extra: null,
  },
  {
    level: 3,
    wallet: '중급 지갑 테마',
    badge: '"라떼 장인" "오늘의 드립러" 뱃지 획득',
    extra: '리뷰 상위권 노출',
  },
  {
    level: 4,
    wallet: '고급 지갑 테마',
    badge: '"로스트 마스터" "커피 연금술사" 뱃지 획득',
    extra: '리뷰 상위권 노출',
  },
  {
    level: 5,
    wallet: '특별 지갑 테마',
    badge: '"전설의 바리스타" "카페 그랜드마스터" 뱃지 획득',
    extra: '리뷰 상위권 노출',
  },
];

const USERNAME = ['김멋사'];

// --- 프로그레스 바 컴포넌트 (변경 없음) ---
const StampProgress = ({
  current,
  max,
  level,
}: {
  current: number;
  max: number;
  level: number;
}) => {
  const size = 260;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const maxAngle = 260;
  const startAngle = 140;

  const safeMax = Number.isFinite(max) && max > 0 ? max : 20;
  const safeCurrent = Number.isFinite(current) ? current : 0;
  const safeLevel = Number.isFinite(level) ? level : 1;
  const progress = Math.min(Math.max(safeCurrent / safeMax, 0), 1);

  const rawDashOffset =
    circumference - progress * (maxAngle / 360) * circumference;
  const strokeDashoffset = Number.isFinite(rawDashOffset)
    ? rawDashOffset
    : circumference;
  const backgroundDashOffset = circumference - (maxAngle / 360) * circumference;
  const currentAngle = startAngle + progress * maxAngle;
  const safeCurrentAngle = Number.isFinite(currentAngle)
    ? currentAngle
    : startAngle;
  const knobX =
    size / 2 + radius * Math.cos((safeCurrentAngle * Math.PI) / 180);
  const knobY =
    size / 2 + radius * Math.sin((safeCurrentAngle * Math.PI) / 180);

  return (
    <div
      className="relative flex justify-center items-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform overflow-visible"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF9E5E" />
            <stop offset="100%" stopColor="#FF6600" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={backgroundDashOffset}
          strokeLinecap="round"
          transform={`rotate(${startAngle} ${size / 2} ${size / 2})`}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(${startAngle} ${size / 2} ${size / 2})`}
          className="transition-all duration-500 ease-out"
        />
        {safeCurrent > 0 && (
          <circle
            cx={knobX}
            cy={knobY}
            r={strokeWidth / 1.6}
            fill="var(--main-color)"
            className="drop-shadow-md transition-all duration-500 ease-out"
          />
        )}
      </svg>
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-10">
        <div className="w-[180px] h-[180px] rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img
            src="https://placehold.co/200x200/png?text=User"
            alt="프로필"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="absolute bottom-4 left-4 font-bold text-gray-600 text-lg">
        Lv. {safeLevel}
      </div>
      <div className="absolute bottom-4 right-4 font-bold text-gray-400 text-lg">
        {safeLevel >= 5 ? 'MAX' : `Lv. ${safeLevel + 1}`}
      </div>
    </div>
  );
};

export const Reward = () => {
  const navigate = useNavigate();
  const [totalStampCount, setTotalStampCount] = useState<number>(0);

  // --- [New] Benefit View Toggle State ---
  const [isNextBenefit, setIsNextBenefit] = useState<boolean>(false);

  // --- 핵심 로직 ---
  const { userLevel, currentLevelStamp, nextLevelTarget } = useMemo(() => {
    const safeTotal = Number.isFinite(totalStampCount) ? totalStampCount : 0;
    const calculatedLevel = Math.min(Math.floor(safeTotal / 20) + 1, 5);

    let currentProgress;
    if (calculatedLevel < 5) {
      currentProgress = safeTotal % 20;
    } else {
      currentProgress = safeTotal - 80;
    }

    return {
      userLevel: calculatedLevel,
      currentLevelStamp: currentProgress,
      nextLevelTarget: 20,
    };
  }, [totalStampCount]);

  // --- [New] 화면에 보여줄 레벨과 데이터 계산 ---
  const displayLevel = isNextBenefit ? userLevel + 1 : userLevel;
  // 5레벨(MAX)을 넘어가려 하면 5레벨 데이터 유지 (또는 예외처리)
  const targetLevelData =
    LEVEL_BENEFITS.find((d) => d.level === Math.min(displayLevel, 5)) ||
    LEVEL_BENEFITS[0];

  const handleClickInfo = () => {
    navigate('/reward/info');
  };

  // --- [New] 토글 핸들러 ---
  const handleToggleBenefit = () => {
    // 5레벨(MAX)이면 다음 혜택이 없으므로 토글 불가
    if (userLevel >= 5) return;
    setIsNextBenefit((prev) => !prev);
  };

  const getStampCount = async () => {
    const apiUrl = import.meta.env.VITE_API_URI;
    try {
      const response = await fetch(`${apiUrl}/v1/users/stamps/history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('네트워크 응답이 올바르지 않습니다.');
      }

      const data: StampHistoryResponse = await response.json();
      setTotalStampCount(data.totalStampSum || 0);
      return data.completedStampNum;
    } catch (error) {
      console.error('스탬프 수를 가져오는 중 오류 발생:', error);
      return 0;
    }
  };

  React.useEffect(() => {
    getStampCount();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full px-5 pb-24">
      <div className="self-start mt-4">
        <h1 className="font-semibold text-[25px] text-(--fill-color6)">
          Reward
        </h1>
      </div>

      <div className="flex mt-10 text-[22px]">
        <p className="mr-0.5 font-bold text-(--main-color2)">{USERNAME[0]}</p>
        님은&nbsp;
        <p className="mr-0.5 font-bold text-(--main-color2)">{userLevel}레벨</p>
        이에요.
      </div>

      <div className="flex flex-col items-center justify-center w-[140px] h-[50px] shadow-xl rounded-[15px] bg-white mt-7 z-20 mb-10">
        <p className="text-[10px] text-(--main-color2)">이번 레벨 스탬프</p>
        <div className="flex flex-row justify-center items-baseline">
          <p className="font-bold text-[20px] text-(--main-color2)">
            {currentLevelStamp} / {nextLevelTarget}
          </p>
          <p className="font-medium text-[10px] ml-1 text-gray-500">Stamp</p>
        </div>
      </div>

      <div className="mt-[-20px]">
        <StampProgress
          current={currentLevelStamp}
          max={nextLevelTarget}
          level={userLevel}
        />
      </div>

      <div className="flex flex-row mt-2 font-medium text-gray-600">
        {userLevel >= 5 ? (
          <p className="text-[var(--main-color)] font-bold">
            최고 레벨 마스터!
          </p>
        ) : (
          <>
            <p>다음 레벨까지&nbsp;</p>
            <p className="text-[var(--main-color)] font-bold">
              {Math.max(nextLevelTarget - currentLevelStamp, 0)}스탬프&nbsp;
            </p>
            <p>남았어요!</p>
          </>
        )}
      </div>

      {/* --- [New] Benefit Card Section --- */}
      <div
        className={`relative flex flex-col items-center justify-center w-full max-w-[360px] py-6 px-5 rounded-[20px] mt-10 transition-colors duration-300
          ${isNextBenefit ? 'bg-[#8E7B6D]' : 'bg-[#F4EBE6]'} 
        `}
      >
        {/* 화살표 버튼 (Max Level이 아닐 때만 표시) */}
        {userLevel < 5 && (
          <button
            onClick={handleToggleBenefit}
            className={`absolute top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center transition-all duration-300
              ${isNextBenefit ? 'left-[-15px]' : 'right-[-15px]'}
            `}
          >
            {/* SVG Arrow Icons */}
            {isNextBenefit ? (
              // Back (Left) Arrow
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="#5A3A28"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            ) : (
              // Next (Right) Arrow
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="#5A3A28"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            )}
          </button>
        )}

        <div className="flex flex-row items-center gap-2.5 self-start mb-2">
          <p
            className={`font-bold text-[20px] transition-colors duration-300 ${
              isNextBenefit ? 'text-white' : 'text-[#5A3A28]'
            }`}
          >
            {isNextBenefit ? 'Next Benefit' : 'Current Benefit'}
          </p>
          <img
            src={question_icon}
            alt="info"
            className="flex w-[16px] h-[16px] cursor-pointer"
            onClick={handleClickInfo}
            // Next 상태일 때 아이콘 색상이 잘 안보이면 filter 등으로 조정 가능
            style={isNextBenefit ? { filter: 'brightness(0) invert(1)' } : {}}
          />
        </div>

        {/* 혜택 1: 지갑 테마 */}
        <div className="flex flex-row items-center w-full bg-white rounded-[50px] mt-2 p-3 shadow-sm min-h-[64px]">
          <img
            src={wallet_logo}
            alt="지갑 로고"
            className="w-[40px] h-[40px]"
          />
          <p className="ml-3 text-[14px] font-medium text-gray-700 break-keep">
            {targetLevelData.wallet}
          </p>
        </div>

        {/* 혜택 2: 뱃지 */}
        <div className="flex flex-row items-center w-full bg-white rounded-[50px] mt-2 p-3 shadow-sm min-h-[64px]">
          <img
            src={reward_logo}
            alt="상장 로고"
            className="w-[40px] h-[40px]"
          />
          <p className="ml-3 text-[14px] font-medium text-gray-700 break-keep">
            {targetLevelData.badge}
          </p>
        </div>

        {/* 혜택 3: 추가 혜택 (있을 경우에만 표시) */}
        {targetLevelData.extra && (
          <div className="flex flex-row items-center w-full bg-white rounded-[50px] mt-2 p-3 shadow-sm min-h-[64px]">
            {/* review_logo가 없으면 reward_logo나 다른 아이콘 사용 */}
            <img
              src={review_logo || reward_logo}
              alt="리뷰 로고"
              className="w-[40px] h-[40px]"
            />
            <p className="ml-3 text-[14px] font-medium text-gray-700 break-keep">
              {targetLevelData.extra}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col mt-12 font-semibold self-start text-[22px] mb-5">
        Top Stamper
      </div>

      <UserBottomBar />
    </div>
  );
};
