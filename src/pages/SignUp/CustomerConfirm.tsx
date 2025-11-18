import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import addProfile from '../../assets/addProfile.png';
import { useEffect, useState } from 'react';
import SignupInput from '../../components/SignupInput';
import { AddressModal } from '../../components/AddressModal.tsx';
import {
  StoreSearchModal,
  type Store,
} from '../../components/StoreSearchModal';

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

  const handleSkipClick = () => {
    navigate('/customer/onboarding');
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

  // 성별 버튼 클릭 핸들러
  const handleGenderClick = (gender: 'male' | 'female') => {
    setProfileData({
      ...profileData,
      gender: gender,
    });
  };

  // '확인' 버튼 클릭 핸들러
  const handleConfirmClick = () => {
    console.log('프로필이 저장되었습니다:', profileData);
    // todo: profileData를 서버로 전송하는 API 로직
    // ...
    navigate('/onboarding/customer');
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
    setSelectedSlotIndex(index); // 몇 번째 슬롯이 클릭되었는지 저장
    setIsStoreSearchModalOpen(true); // 가게 검색 모달 열기
  };

  // 가게 검색 모달 닫기
  const handleCloseStoreSearchModal = () => {
    setIsStoreSearchModalOpen(false);
  };

  // 가게 검색 모달에서 가게 선택 시
  const handleStoreSelect = (store: Store) => {
    // 1. UI 상태 업데이트
    const newFavoriteStores = [...favoriteStores];
    newFavoriteStores[selectedSlotIndex] = store;
    setFavoriteStores(newFavoriteStores);

    // 2. profileData의 favStoreId (ID 배열) 업데이트
    const newFavStoreIds = newFavoriteStores
      .filter((s): s is Store => s !== null) // null이 아닌 가게만 필터링
      .map((s) => s.storeId); // 가게 ID만 추출

    setProfileData((prev) => ({
      ...prev,
      favStoreId: newFavStoreIds,
    }));

    setIsStoreSearchModalOpen(false); // 모달 닫기
  };

  // '...' 버튼 클릭 (가게 삭제)
  const handleRemoveShop = (index: number) => {
    // 1. UI 상태 업데이트 (해당 슬롯을 null로)
    const newFavoriteStores = [...favoriteStores];
    newFavoriteStores[index] = null;
    setFavoriteStores(newFavoriteStores);

    // 2. profileData의 favStoreId (ID 배열) 업데이트
    const newFavStoreIds = newFavoriteStores
      .filter((s): s is Store => s !== null)
      .map((s) => s.storeId);

    setProfileData((prev) => ({
      ...prev,
      favStoreId: newFavStoreIds,
    }));
  };

    useEffect(() => {
    // 주소 모달 또는 가게 검색 모달 중 하나라도 열려있는지 확인
    const isModalOpen = isAddressModalOpen || isStoreSearchModalOpen;

    if (isModalOpen) {
      // 모달이 열리면 body의 스크롤을 막음
      document.body.style.overflow = 'hidden';
    } else {
      // 모달이 닫히면 body 스크롤을 복원
      document.body.style.overflow = 'auto';
    }

    // 컴포넌트가 언마운트될 때(페이지를 벗어날 때) 스크롤을 복원
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isAddressModalOpen, isStoreSearchModalOpen]); // 두 모달의 상태가 변경될 때마다 이 effect가 실행됨

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

        {/* --- 단골 가게 등록 (동적 렌더링) --- */}
        <p className="mt-8 font-semibold">단골 가게 등록</p>
        <div className="w-full mt-2.5 space-y-3">
          {favoriteStores.map((store, index) =>
            store ? (
              // 가게가 선택된 슬롯
              <div
                key={index}
                className="w-full h-[48px] border border-gray-300 rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-sm">{store.storeName}</p>
                  <p className="text-gray-500 text-xs">{store.address}</p>
                </div>
                <button
                  onClick={() => handleRemoveShop(index)} // 삭제 핸들러 연결
                  className="text-gray-400 text-xl"
                >
                  ...
                </button>
              </div>
            ) : (
              // 빈 슬롯 ('+' 버튼)
              <button
                key={index}
                className="w-full h-[48px] border border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-3xl"
                onClick={() => handleAddShopClick(index)} // 추가 핸들러 연결
              >
                +
              </button>
            )
          )}
        </div>

        <button
          className="w-full h-[56px] bg-gray-300 text-white font-bold rounded-lg mt-12"
          onClick={handleConfirmClick}
        >
          확인
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