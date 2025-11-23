/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton.tsx';
import addProfile from '../../assets/addProfile.png';
import { useEffect, useState, useRef } from 'react'; // useRef 추가
import SignupInput from '../../components/SignupInput.tsx';
import { AddressModal } from '../../components/AddressModal.tsx';
import {
  StoreSearchModal,
  type Store,
} from '../../components/StoreSearchModal.tsx';

type UserProfileProps = {
  nickname: string;
  gender: 'male' | 'female';
  favStoreId: number[];
  address: string;
  latitude: number;
  longitude: number;
};

export const CustomerConfirm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null); // 파일 인풋 제어용 Ref

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이미지 파일 상태 (API 전송용)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  // 이미지 미리보기 URL 상태 (화면 표시용)
  const [previewUrl, setPreviewUrl] = useState<string>(addProfile);

  const handleSkipClick = () => {
    navigate('/onboarding/customer');
  };

  const [profileData, setProfileData] = useState<UserProfileProps>({
    nickname: '',
    gender: 'male',
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

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isStoreSearchModalOpen, setIsStoreSearchModalOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);

  // --- [추가] 이미지 변경 핸들러 ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file); // 전송할 파일 저장
      // 미리보기 URL 생성
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
    }
  };

  // --- [추가] 프로필 이미지 클릭 시 파일 선택창 열기 ---
  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleGenderClick = (gender: 'male' | 'female') => {
    setProfileData({
      ...profileData,
      gender: gender,
    });
  };

  // 확인버튼 클릭 핸들러
  const handleConfirmClick = async () => {
    // 1. 필수 값 검증
    if (!profileData.address || profileData.latitude === 0) {
      alert('주소를 입력해주세요.');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인 정보가 없습니다.');
      navigate('/');
      return;
    }

    try {
      const formData = new FormData();

      const jsonPayload = {
        address: profileData.address,
        latitude: profileData.latitude,
        longitude: profileData.longitude,
        gender: profileData.gender === 'male' ? 'MALE' : 'FEMALE',
        favStoreId: profileData.favStoreId,
      };

      formData.append(
        'data',
        new Blob([JSON.stringify(jsonPayload)], { type: 'application/json' })
      );

      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/v1/auth/user/onboarding`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server Error:', errorData);
        throw new Error(errorData.message || '프로필 저장에 실패했습니다.');
      }

      console.log('프로필 저장 성공!');
      navigate('/onboarding/customer');

    } catch (error: any) {
      console.error('Onboarding Error:', error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddressSearch = () => setIsAddressModalOpen(true);

  const handleAddressSelect = (data: {
    address: string;
    x: string;
    y: string;
  }) => {
    setProfileData((prev) => ({
      ...prev,
      address: data.address,
      longitude: parseFloat(data.x),
      latitude: parseFloat(data.y),
    }));
    setIsAddressModalOpen(false);
  };

  const handleCloseAddressModal = () => setIsAddressModalOpen(false);

  const handleAddShopClick = (index: number) => {
    setSelectedSlotIndex(index);
    setIsStoreSearchModalOpen(true);
  };

  const handleCloseStoreSearchModal = () => setIsStoreSearchModalOpen(false);

  const handleStoreSelect = (store: Store) => {
    const newFavoriteStores = [...favoriteStores];
    newFavoriteStores[selectedSlotIndex] = store;
    setFavoriteStores(newFavoriteStores);

    const newFavStoreIds = newFavoriteStores
      .filter((s): s is Store => s !== null)
      .map((s) => s.storeId);

    setProfileData((prev) => ({ ...prev, favStoreId: newFavStoreIds }));
    setIsStoreSearchModalOpen(false);
  };

  const handleRemoveShop = (index: number) => {
    const newFavoriteStores = [...favoriteStores];
    newFavoriteStores[index] = null;
    setFavoriteStores(newFavoriteStores);

    const newFavStoreIds = newFavoriteStores
      .filter((s): s is Store => s !== null)
      .map((s) => s.storeId);

    setProfileData((prev) => ({ ...prev, favStoreId: newFavStoreIds }));
  };

  useEffect(() => {
    const isModalOpen = isAddressModalOpen || isStoreSearchModalOpen;
    document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isAddressModalOpen, isStoreSearchModalOpen]);

  return (
    <div className="flex flex-col items-center pb-24">
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

      <div className="w-screen h-px mt-3 bg-gray-200" />

      <div className="w-full max-w-md px-10 flex flex-col items-start">
        <p className="text-[30px] mt-12 text-gray-700 font-semibold">
          회원가입을 환영합니다!
        </p>
        <p className="text-[20px] mt-2 text-gray-700">
          내 프로필 채우기를 시작하세요.
        </p>

        {/* --- [수정] 프로필 이미지 영역 --- */}
        <div
          className="w-[120px] h-[120px] rounded-full mt-12 mx-auto cursor-pointer relative overflow-hidden"
          onClick={handleProfileImageClick} // 클릭 이벤트 연결
        >
          {/* 이미지를 object-cover로 설정하여 꽉 차게 표시 */}
          <img
            src={previewUrl}
            alt="프로필 추가"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 숨겨진 파일 인풋 */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden" // 화면엔 보이지 않음
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

        {/* ... (나머지 UI 코드는 기존과 동일) ... */}

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
          className="w-full h-[56px] bg-(--main-color) text-white font-bold rounded-[40px] mt-12"
          onClick={handleConfirmClick}
          disabled={isSubmitting}
        >
          {isSubmitting ? '저장 중...' : '확인'}
        </button>
      </div>

      {isAddressModalOpen && (
        <AddressModal
          onClose={handleCloseAddressModal}
          onSelect={handleAddressSelect}
        />
      )}
      {isStoreSearchModalOpen && (
        <StoreSearchModal
          onClose={handleCloseStoreSearchModal}
          onSelect={handleStoreSelect}
        />
      )}
    </div>
  );
};
