import React from 'react';
import wallet_logo from '../../assets/wallet_logo.png';
import reward_logo from '../../assets/reward_logo.png';
import { UserBottomBar } from '../../components/UserBottomBar';
import question_icon from '../../assets/question_icon.png';
import { useNavigate } from 'react-router-dom';

const example_stores = [
  {
    storeName: '블루보틀 홍대점',
    storeAddress: '서울시 마포구 어울마당로 55',
    issuedDate: '2025-11-08',
  },
  {
    storeName: '블루보틀 홍대점',
    storeAddress: '서울시 마포구 어울마당로 55',
    issuedDate: '2025-11-08',
  },
  {
    storeName: '블루보틀 홍대점',
    storeAddress: '서울시 마포구 어울마당로 55',
    issuedDate: '2025-11-09',
  },
  {
    storeName: '블루보틀 홍대점',
    storeAddress: '서울시 마포구 어울마당로 55',
    issuedDate: '2025-11-09',
  },
];

const USERNAME = ['김멋사'];
const USER_LEVEL = 2;
const CURRENT_STAMP = example_stores.length;
const MAXIMUM_STAMP = 60;
const WALLET_BENEFIT = ['초급 지갑 테마', '중급 지갑 테마'];
const REWARD_BENEFIT = ['"브루 수련생", "카페 수집가" 뱃지 획득', '중급 상장'];

// --- 프로그레스 바 컴포넌트 (내부 정의) ---
const StampProgress = ({ current, max, level }: { current: number; max: number; level: number }) => {
  const size = 260; // 전체 크기
  const strokeWidth = 20; // 게이지 두께
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const maxAngle = 260;
  const startAngle = 140;

  const progress = Math.min(Math.max(current / max, 0), 1);
  const strokeDashoffset = circumference - progress * (maxAngle / 360) * circumference;
  const backgroundDashOffset = circumference - (maxAngle / 360) * circumference;

  // 끝부분 노브(동그라미) 위치 계산
  const currentAngle = startAngle + progress * maxAngle;
  const knobX = size / 2 + radius * Math.cos((currentAngle * Math.PI) / 180);
  const knobY = size / 2 + radius * Math.sin((currentAngle * Math.PI) / 180);

  return (
    <div className="relative flex justify-center items-center" style={{ width: size, height: size }}>
      {/* 1. SVG 게이지 */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform overflow-visible">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF9E5E" />
            <stop offset="100%" stopColor="#FF6600" />
          </linearGradient>
        </defs>
        {/* 배경 트랙 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB" // Tailwind gray-200
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={backgroundDashOffset}
          strokeLinecap="round"
          transform={`rotate(${startAngle} ${size / 2} ${size / 2})`}
        />
        {/* 진행 바 */}
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
        {/* 끝부분 노브 */}
        {current > 0 && (
          <circle
            cx={knobX}
            cy={knobY}
            r={strokeWidth / 1.6}
            fill="var(--main-color)" // Tailwind orange-600
            className="drop-shadow-md transition-all duration-500 ease-out"
          />
        )}
      </svg>

      {/* 2. 중앙 프로필 이미지 */}
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-10">
        <div className="w-[180px] h-[180px] rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img
            src="https://placehold.co/200x200/png?text=User" // 사용자 이미지 URL로 교체 필요
            alt="프로필"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 3. 레벨 텍스트 (좌우 하단) */}
      <div className="absolute bottom-4 left-4 font-bold text-gray-600 text-lg">
        Lv. {level}
      </div>
      <div className="absolute bottom-4 right-4 font-bold text-gray-400 text-lg">
        Lv. {level + 1}
      </div>
    </div>
  );
};


export const Reward = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/reward/info');
  }

  const handleFetchStamps = async () => {
    const stampCount = await getStampCount();
    console.log('현재 스탬프 수:', stampCount);
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

      const data = await response.json();
      console.log('스탬프 데이터:', data);

      return data.length; // 스탬프 수 반환
    } catch (error) {
      console.error('스탬프 수를 가져오는 중 오류 발생:', error);
    }
  };
  const [stampCount, setStampCount] = React.useState<number>(CURRENT_STAMP);

  React.useEffect(() => {
    handleFetchStamps().then((count) => {
      if (count !== undefined) {
        setStampCount(count);
      }
    });
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full px-5 pb-24"> {/* 하단 바 고려하여 pb 추가 */}
      <div className="self-start mt-4">
        <h1 className="font-semibold text-[25px] text-(--fill-color6)">Reward</h1>
      </div>

      <div className="flex mt-10 text-[22px]">
        <p className="mr-0.5 font-bold text-(--main-color2)">{USERNAME[0]}</p>님은&nbsp;
        <p className="mr-0.5 font-bold text-(--main-color2)">{USER_LEVEL}레벨</p>이에요.
      </div>

      <div className="flex flex-col items-center justify-center w-[140px] h-[50px] shadow-xl rounded-[15px] bg-white mt-7 z-20 mb-10">
        <p className="text-[10px] text-(--main-color2)">내가 모은 스탬프</p>
        <div className="flex flex-row justify-center items-baseline">
          <p className="font-bold text-[20px] text-(--main-color2)">
            {stampCount} / {MAXIMUM_STAMP}
          </p>
          <p className="font-medium text-[10px] ml-1 text-gray-500">Stamp</p>
        </div>
      </div>

      {/* 진척도 그림 영역 (수정됨) */}
      <div className="mt-[-20px]">
        <StampProgress 
          current={stampCount} 
          max={MAXIMUM_STAMP} 
          level={USER_LEVEL} 
        />
      </div>

      <div className="flex flex-row mt-2 font-medium text-gray-600">
        <p>다음 레벨까지&nbsp;</p>
        {/* Tailwind에서 CSS 변수 사용 시 [] 또는 config 필요. 여기선 색상 하드코딩 혹은 text-[var(--main-color)] 사용 권장 */}
        <p className="text-[var(--main-color)] font-bold">
          {MAXIMUM_STAMP - stampCount}스탬프&nbsp;
        </p>
        <p>남았어요!</p>
      </div>

      <div className="flex flex-col items-center justify-center bg-[#F4EBE6] w-full max-w-[360px] py-6 px-5 rounded-[20px] mt-10">
        <div className="flex flex-row items-center gap-2.5 self-start mb-2">
          <p className="flex text-[#5A3A28] font-bold text-[20px]">
            Current Benefit
          </p>
          <img src={question_icon} alt="" className='flex w-[16px] h-[16px]' onClick={handleClick}/>
        </div>
        <div className="flex flex-row items-center w-full bg-white rounded-[50px] mt-2 p-3 shadow-sm">
          <img
            src={wallet_logo}
            alt="지갑 로고"
            className="w-[40px] h-[40px]"
          />
          <p className="ml-3 text-[14px] font-medium text-gray-700">{WALLET_BENEFIT[0]}</p>
        </div>
        <div className="flex flex-row items-center w-full bg-white rounded-[50px] mt-2 p-3 shadow-sm">
          <img
            src={reward_logo}
            alt="상장 로고"
            className="w-[40px] h-[40px]"
          />
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