import React, { useState, useMemo } from 'react';
import wallet_logo from '../../assets/wallet_logo.png';
import reward_logo from '../../assets/reward_logo.png';
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

const USERNAME = ['김멋사'];
const WALLET_BENEFIT = ['초급 지갑 테마', '중급 지갑 테마'];
const REWARD_BENEFIT = ['"브루 수련생", "카페 수집가" 뱃지 획득', '중급 상장'];

// --- 프로그레스 바 컴포넌트 ---
const StampProgress = ({ current, max, level }: { current: number; max: number; level: number }) => {
  const size = 260;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const maxAngle = 260;
  const startAngle = 140;

  // [안전 장치] NaN 방지 로직 강화
  const safeMax = (Number.isFinite(max) && max > 0) ? max : 20; 
  const safeCurrent = Number.isFinite(current) ? current : 0;
  
  // UI에 표시될 레벨이 NaN이면 1로 처리
  const safeLevel = Number.isFinite(level) ? level : 1;

  // 진행률 계산: 5레벨 이상에서 current가 max를 넘어가도 1(100%)에서 멈추도록 Math.min 사용
  const progress = Math.min(Math.max(safeCurrent / safeMax, 0), 1);
  
  const rawDashOffset = circumference - progress * (maxAngle / 360) * circumference;
  const strokeDashoffset = Number.isFinite(rawDashOffset) ? rawDashOffset : circumference;
  
  const backgroundDashOffset = circumference - (maxAngle / 360) * circumference;
  const currentAngle = startAngle + progress * maxAngle;
  
  const safeCurrentAngle = Number.isFinite(currentAngle) ? currentAngle : startAngle;
  const knobX = size / 2 + radius * Math.cos((safeCurrentAngle * Math.PI) / 180);
  const knobY = size / 2 + radius * Math.sin((safeCurrentAngle * Math.PI) / 180);

  return (
    <div className="relative flex justify-center items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform overflow-visible">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF9E5E" />
            <stop offset="100%" stopColor="#FF6600" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E5E7EB" strokeWidth={strokeWidth} fill="none" strokeDasharray={circumference} strokeDashoffset={backgroundDashOffset} strokeLinecap="round" transform={`rotate(${startAngle} ${size / 2} ${size / 2})`} />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="url(#gradient)" strokeWidth={strokeWidth} fill="none" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" transform={`rotate(${startAngle} ${size / 2} ${size / 2})`} className="transition-all duration-500 ease-out" />
        {safeCurrent > 0 && (
          <circle cx={knobX} cy={knobY} r={strokeWidth / 1.6} fill="var(--main-color)" className="drop-shadow-md transition-all duration-500 ease-out" />
        )}
      </svg>
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-10">
        <div className="w-[180px] h-[180px] rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img src="https://placehold.co/200x200/png?text=User" alt="프로필" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="absolute bottom-4 left-4 font-bold text-gray-600 text-lg">Lv. {safeLevel}</div>
      <div className="absolute bottom-4 right-4 font-bold text-gray-400 text-lg">
        {safeLevel >= 5 ? 'MAX' : `Lv. ${safeLevel + 1}`}
      </div>
    </div>
  );
};

export const Reward = () => {
  const navigate = useNavigate();
  const [totalStampCount, setTotalStampCount] = useState<number>(0);

  // --- 핵심 로직 수정 ---
  const { userLevel, currentLevelStamp, nextLevelTarget } = useMemo(() => {
    // 0. 안전장치: totalStampCount가 혹시라도 NaN이면 0으로 처리
    const safeTotal = Number.isFinite(totalStampCount) ? totalStampCount : 0;

    // 1. 레벨 계산 (최대 5레벨)
    const calculatedLevel = Math.min(Math.floor(safeTotal / 20) + 1, 5);

    let currentProgress;
    
    // 2. 스탬프 계산 분기 처리
    if (calculatedLevel < 5) {
      // 1~4 레벨: 20개마다 0으로 초기화 (나머지 연산)
      // 예: 25개 -> 5개 (Lv2)
      currentProgress = safeTotal % 20;
    } else {
      // 5 레벨 (MAX): 초기화되지 않음. 5레벨 시작점(80개)부터 누적.
      // 예: 85개 -> 5개, 100개 -> 20개(꽉참), 105개 -> 25개(꽉참 유지)
      currentProgress = safeTotal - 80;
    }

    return { 
      userLevel: calculatedLevel, 
      currentLevelStamp: currentProgress, 
      nextLevelTarget: 20 // 목표는 항상 20개 단위 (UI 표시용)
    };
  }, [totalStampCount]);
  // --------------------

  const handleClick = () => {
    navigate('/reward/info');
  }

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
      console.log('스탬프 데이터:', data);
      
      setTotalStampCount(data.totalStampSum || 0);

      return data.completedStampNum; 
    } catch (error) {
      console.error('스탬프 수를 가져오는 중 오류 발생:', error);
      return 0;
    }
  };
  
  const handleFetchStamps = async () => {
    await getStampCount();
  };

  React.useEffect(() => {
    handleFetchStamps();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full px-5 pb-24">
      <div className="self-start mt-4">
        <h1 className="font-semibold text-[25px] text-(--fill-color6)">Reward</h1>
      </div>

      <div className="flex mt-10 text-[22px]">
        <p className="mr-0.5 font-bold text-(--main-color2)">{USERNAME[0]}</p>님은&nbsp;
        <p className="mr-0.5 font-bold text-(--main-color2)">{userLevel}레벨</p>이에요.
      </div>

      <div className="flex flex-col items-center justify-center w-[140px] h-[50px] shadow-xl rounded-[15px] bg-white mt-7 z-20 mb-10">
        <p className="text-[10px] text-(--main-color2)">이번 레벨 스탬프</p>
        <div className="flex flex-row justify-center items-baseline">
          <p className="font-bold text-[20px] text-(--main-color2)">
            {/* 5레벨 이상이고 20개 넘으면 그냥 20/20으로 고정해서 보여주거나, 실제 개수 보여주기 */}
            {/* 여기서는 실제 쌓인 개수를 보여줍니다 (예: 25 / 20) */}
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
            {/* 5레벨 달성 시 메시지 변경 */}
            {currentLevelStamp >= 20 ? "최고 레벨 마스터!" : "최고 레벨 도전 중!"}
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

      <div className="flex flex-col items-center justify-center bg-[#F4EBE6] w-full max-w-[360px] py-6 px-5 rounded-[20px] mt-10">
        <div className="flex flex-row items-center gap-2.5 self-start mb-2">
          <p className="flex text-[#5A3A28] font-bold text-[20px]">
            Current Benefit
          </p>
          <img src={question_icon} alt="" className='flex w-[16px] h-[16px]' onClick={handleClick}/>
        </div>
        <div className="flex flex-row items-center w-full bg-white rounded-[50px] mt-2 p-3 shadow-sm">
          <img src={wallet_logo} alt="지갑 로고" className="w-[40px] h-[40px]" />
          <p className="ml-3 text-[14px] font-medium text-gray-700">{WALLET_BENEFIT[0]}</p>
        </div>
        <div className="flex flex-row items-center w-full bg-white rounded-[50px] mt-2 p-3 shadow-sm">
          <img src={reward_logo} alt="상장 로고" className="w-[40px] h-[40px]" />
          <p className="ml-3 text-[14px] font-medium text-gray-700">{REWARD_BENEFIT[0]}</p>
        </div>
      </div>

      <div className="flex flex-col mt-12 font-semibold self-start text-[22px] mb-5">
        Top Stamper
      </div>
      
      <UserBottomBar />
    </div>
  );
};