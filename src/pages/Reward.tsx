import wallet_logo from '../assets/wallet_logo.png';
import reward_logo from '../assets/reward_logo.png';
import { UserBottomBar } from '../components/UserBottomBar';

const USERNAME = ['김멋사'];
const USER_LEVEL = '2';
const CURRENT_STAMP = 50;
const MAXIMUM_STAMP = 60;
const WALLET_BENEFIT = ['초급 지갑 테마', '중급 지갑 테마'];
const REWARD_BENEFIT = ['"브루 수련생", "카페 수집가" 뱃지 획득', '중급 상장'];

export const Reward = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full px-5">
      <div className="self-start mt-4">
        <h1 className="font-semibold text-[25px]">Reward</h1>
      </div>

      <div className="flex mt-14 text-[22px]">
        <p className="mr-0.5 font-semibold">{USERNAME[0]}</p>님은&nbsp;
        <p className="mr-0.5 font-semibold">{USER_LEVEL}레벨</p>이에요.
      </div>

      <div className="flex flex-col items-center justify-center w-[140px] h-[50px] shadow rounded-[10px] bg-white mt-7">
        <p className="text-[10px]">내가 모은 스탬프</p>
        <div className="flex flex-row justify-center items-baseline">
          <p className="font-semibold text-[20px]">
            {CURRENT_STAMP} / {MAXIMUM_STAMP} &nbsp;
          </p>
          <p className="font-medium text-[10px]">Stamp</p>
        </div>
      </div>

      <div className="flex w-[192px] h-[154px] mt-5 bg-gray-100 items-center justify-center">
        여따가 진척도 그림 넣으면 됨
      </div>

      <div className="flex flex-row mt-5">
        <p>다음 레벨까지&nbsp;</p>
        <p className="text-(--main-color)">
          {MAXIMUM_STAMP - CURRENT_STAMP}스탬프&nbsp;
        </p>
        <p>남았어요!</p>{' '}
      </div>

      <div className="flex flex-col items-center justify-center bg-[#F4EBE6] w-[360px] h-[220px] p-5 rounded-[20px] mt-12">
        <div className="flex self-start">
          <p className="text-(--main-color2) font-semibold text-[20px]">
            Current Benefit
          </p>
        </div>
        <div className="flex flex-row items-center-safe w-[326px] h-[64px] bg-white rounded-[50px] mt-4` p-3">
          <img
            src={wallet_logo}
            alt="지갑 로고"
            className="w-[44px] h-[44px] "
          />
          <p className='ml-2 text-[14px]'>{WALLET_BENEFIT[0]}</p>
        </div>
        <div className="flex flex-row items-center-safe w-[326px] h-[64px] bg-white rounded-[50px] mt-2 p-3">
          <img
            src={reward_logo}
            alt="상장 로고"
            className="w-[44px] h-[44px] "
          />
          <p className='ml-2 text-[14px]'>{REWARD_BENEFIT[0]}</p>
        </div>
      </div>

      <div className='flex flex-col mt-20 font-semibold self-start text-[25px]'>Top Stamper</div>
      <UserBottomBar />
    </div>
  );
};
