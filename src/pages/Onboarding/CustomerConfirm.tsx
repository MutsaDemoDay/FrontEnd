/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton.tsx';
import addProfile from '../../assets/addProfile.png';
import { useEffect, useState } from 'react';
import SignupInput from '../../components/SignupInput.tsx';
import { AddressModal } from '../../components/AddressModal.tsx';
import {
  StoreSearchModal,
  type Store,
} from '../../components/StoreSearchModal.tsx';

type UserProfileProps = {
  nickname: string;
  gender: 'male' | 'female';
  profileImageUrl: string;
  favStoreId: number[];
  address: string;
  latitude: number;
  longitude: number;
};

export const CustomerConfirm = () => {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false); // 중복 제출 방지용 상태

  const handleSkipClick = () => {
    navigate('/onboarding/customer');
  };

  const [profileData, setProfileData] = useState<UserProfileProps>({
    nickname: '',
    gender: 'male',
    profileImageUrl: '',
    favStoreId: [],
    address: '',
    latitude: 0,
    longitude: 0,
  });

  const [favoriteStores, setFavoriteStores] = useState<(Store | null)[]>([
    null,
    null,
    null,
  ]);

  // 주소 모달 상태
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  // 가게 검색 모달 상태
  const [isStoreSearchModalOpen, setIsStoreSearchModalOpen] = useState(false);
  // 현재 선택된 단골 가게 슬롯 인덱스
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);

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

  // ---------------------------------------------------------
  // [수정됨] '확인' 버튼 클릭 핸들러 (API 연동)
  // ---------------------------------------------------------
  const handleConfirmClick = async () => {
    // 1. 필수 데이터 검증 (주소가 없으면 진행 불가)
    if (!profileData.address || profileData.latitude === 0) {
      alert('주소를 입력해주세요.');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    // 2. 토큰 가져오기
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
      navigate('/login');
      return;
    }

    try {
      // 3. API 요청 보내기
      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/v1/auth/user/onboarding`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // 인증 토큰 추가
          },
          body: JSON.stringify({
            // 서버 요구사항에 맞춰 대문자로 변환 ('male' -> 'MALE')
            gender: profileData.gender === 'male' ? 'MALE' : 'FEMALE',
            address: profileData.address,
            latitude: profileData.latitude,
            longitude: profileData.longitude,
            favStoreId: profileData.favStoreId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '프로필 저장에 실패했습니다.');
      }

      console.log('프로필 저장 성공');
      
      navigate('/onboarding/customer'); 

    } catch (error: any) {
      console.error('Onboarding Error:', error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 주소 관련 핸들러 ---
  const handleAddressSearch = () => {
    setIsAddressModalOpen(true);
  };

  const handleAddressSelect = (data: {
    address: string;
    x: string; // 경도
    y: string; // 위도
  }) => {
    setProfileData((prevProfileData) => ({
      ...prevProfileData,
      address: data.address,
      longitude: parseFloat(data.x),
      latitude: parseFloat(data.y),
    }));
    setIsAddressModalOpen(false);
  };

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  // '+' 버튼 클릭 시
  const handleAddShopClick = (index: number) => {
    setSelectedSlotIndex(index);
    setIsStoreSearchModalOpen(true);
  };

  // 가게 검색 모달 닫기
  const handleCloseStoreSearchModal = () => {
    setIsStoreSearchModalOpen(false);
  };

  // 가게 검색 모달에서 가게 선택 시
  const handleStoreSelect = (store: Store) => {
    const newFavoriteStores = [...favoriteStores];
    newFavoriteStores[selectedSlotIndex] = store;
    setFavoriteStores(newFavoriteStores);

    const newFavStoreIds = newFavoriteStores
      .filter((s): s is Store => s !== null)
      .map((s) => s.storeId);

    setProfileData((prev) => ({
      ...prev,
      favStoreId: newFavStoreIds,
    }));

    setIsStoreSearchModalOpen(false);
  };

  // '...' 버튼 클릭 (가게 삭제)
  const handleRemoveShop = (index: number) => {
    const newFavoriteStores = [...favoriteStores];
    newFavoriteStores[index] = null;
    setFavoriteStores(newFavoriteStores);

    const newFavStoreIds = newFavoriteStores
      .filter((s): s is Store => s !== null)
      .map((s) => s.storeId);

    setProfileData((prev) => ({
      ...prev,
      favStoreId: newFavStoreIds,
    }));
  };

  useEffect(() => {
    const isModalOpen = isAddressModalOpen || isStoreSearchModalOpen;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isAddressModalOpen, isStoreSearchModalOpen]);

  return (
    <div className="flex flex-col items-center pb-24">
      {/* 상단바 */}
      <div className="flex flex-row items-center self-start mt-3 gap-4 px-6 w-full">
        <BackButton />
        <p className="font-semibold">프로필 채우기</p>
        <p
          className="ml-auto text-gray-400 cursor-pointer"
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
          <img src={addProfile} alt="프로필 추가" />
        </div>

        <p className="mt-[18px] font-semibold">닉네임</p>
        <input
          type="text"
          name="nickname"
          value={profileData.nickname}
          onChange={handleProfileData}
          className="focus-within:outline-none border-b mt-2.5 border-gray-300 w-full"
          placeholder="닉네임을 입력하세요"
        />

        {/* --- 성별 --- */}
        <p className="mt-[18px] font-semibold">성별</p>
        <div className="flex flex-row mt-2.5 space-x-4 w-full">
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

        {/* --- 주소지 --- */}
        <div className="w-full mt-6">
          <SignupInput
            label="주소지"
            name="address"
            type="text"
            value={profileData.address}
            readOnly={true}
            variant="address"
            onButtonClick={handleAddressSearch}
            placeholder="지번, 도로명, 건물명으로 검색"
          />
        </div>

        {/* --- 단골 가게 등록 --- */}
        <p className="mt-8 font-semibold">단골 가게 등록</p>
        <div className="w-full mt-2.5 space-y-3">
          {favoriteStores.map((store, index) =>
            store ? (
              <div
                key={index}
                className="w-full h-[48px] border border-gray-300 rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-sm">{store.storeName}</p>
                  <p className="text-gray-500 text-xs">{store.address}</p>
                </div>
                <button
                  onClick={() => handleRemoveShop(index)}
                  className="text-gray-400 text-xl"
                >
                  ...
                </button>
              </div>
            ) : (
              <button
                key={index}
                className="w-full h-[48px] border border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-3xl"
                onClick={() => handleAddShopClick(index)}
              >
                +
              </button>
            )
          )}
        </div>

        <button
          className="w-full h-[56px] bg-gray-300 text-white font-bold rounded-lg mt-12"
          onClick={handleConfirmClick}
          disabled={isSubmitting} // 제출 중 클릭 방지
        >
          {isSubmitting ? '저장 중...' : '확인'}
        </button>
      </div>

      {/* 주소 모달 */}
      {isAddressModalOpen && (
        <AddressModal
          onClose={handleCloseAddressModal}
          onSelect={handleAddressSelect}
        />
      )}

      {/* 가게 검색 모달 */}
      {isStoreSearchModalOpen && (
        <StoreSearchModal
          onClose={handleCloseStoreSearchModal}
          onSelect={handleStoreSelect}
        />
      )}
    </div>
  );
};