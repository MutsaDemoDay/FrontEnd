import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import addProfile from "../../assets/addProfile.png";
import { useState } from 'react';
import type { UserProfileProps } from '../../components/UserProfile';

export const CustomerConfirm = () => {
  const navigate = useNavigate();

  const handleSkipClick = () => {
    navigate('/customer/onboarding');
  };

  const [profileData, setProfileData] = useState<UserProfileProps>({
    nickname: '',
    gender: 'male',
    profileImageUrl: '',
    regularShopAddresses: [],
  });

  // 닉네임 input 핸들러
  const handleProfileData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  // 성별 버튼 클릭 핸들러
  const handleGenderClick = (gender: 'male' | 'female') => {
    setProfileData({
      ...profileData,
      gender: gender,
    });
  };

  // '확인' 버튼 클릭 핸들러
  const handleConfirmClick = () => {
    //todo: 프로필 저장 로직 작성
    console.log('프로필이 저장되었습니다.');
    navigate('/onboarding/customer');
  };

  // '단골 가게 추가' 클릭 핸들러 (임시)
  const handleAddShopClick = () => {
    console.log('단골 가게 추가 로직 실행');
  };
  
  const exampleShop = {
    name: '카페나무',
    address: '서울 마포구 와우산로 94 홍문관 1층 (상수동)',
  };

  return (
    <div className="flex flex-col items-center pb-24">
      {/* 상단바 */}
      <div className="flex flex-row items-center self-start mt-3 gap-4 px-6 w-full">
        <BackButton />
        <p className="font-semibold">프로필 채우기</p>
        <p 
          className="ml-auto text-gray-400 cursor-pointer" // 'absolute' 대신 'ml-auto'로 변경
          onClick={handleSkipClick}
        >
          건너뛰기
        </p>
      </div>

      {/* 구분선 */}
      <div className="w-screen h-px mt-3 bg-gray-200" />

      <div className="w-full max-w-md px-10 flex flex-col items-start">
        <p className="text-[30px] mt-12 text-gray-700 font-semibold">
          회원가입을 환영합니다!
        </p>
        <p className="text-[20px] mt-2 text-gray-700">
          내 프로필 채우기를 시작하세요.
        </p>
        
        <div className="w-[120px] h-[120px] rounded-full mt-12 mx-auto cursor-pointer">
            <img src={addProfile} alt="프로필 추가"/>
        </div>

        <p className='mt-[18px] font-semibold'>닉네임</p>
        <input 
          type="text"
          name="nickname"
          value={profileData.nickname}
          onChange={handleProfileData}
          className='focus-within:outline-none border-b mt-2.5 border-gray-300 w-full'
          placeholder='닉네임을 입력하세요'
        />

        {/* --- 성별 --- */}
        <p className='mt-[18px] font-semibold'>성별</p>
        <div className='flex flex-row mt-2.5 space-x-4 w-full'>
          <button 
            className={`flex-1 h-[48px] border rounded-lg transition-all ${
              profileData.gender === 'male' 
                ? 'border-blue-500 text-blue-500 font-semibold'
                : 'border-gray-300 text-gray-500'
            }`}
            onClick={() => handleGenderClick('male')}
          >
            남
          </button>
          <button 
            className={`flex-1 h-[48px] border rounded-lg transition-all ${
              profileData.gender === 'female' 
                ? 'border-blue-500 text-blue-500 font-semibold'
                : 'border-gray-300 text-gray-500'
            }`}
            onClick={() => handleGenderClick('female')}
          >
            여
          </button>
        </div>

        <p className='mt-8 font-semibold'>단골 가게 등록</p>
        <div className="w-full mt-2.5 space-y-3">
          <div className="w-full h-[48px] border border-gray-300 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{exampleShop.name}</p>
              <p className="text-gray-500 text-xs">{exampleShop.address}</p>
            </div>
            <button className="text-gray-400 text-xl">...</button>
          </div>

          <button 
            className="w-full h-[48px] border border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-3xl"
            onClick={handleAddShopClick}
          >
            +
          </button>

          <button 
            className="w-full h-[48px] border border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-3xl"
            onClick={handleAddShopClick}
          >
            +
          </button>
        </div>

        <button 
          className="w-full h-[56px] bg-gray-300 text-white font-bold rounded-lg mt-12"
          onClick={handleConfirmClick}
        >
          확인
        </button>
      </div>
    </div>
  );
};