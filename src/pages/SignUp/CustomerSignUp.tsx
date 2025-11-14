/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import BackButton from '../../components/BackButton';
import SignupInput, {
  type CustomerSignupFormData,
} from '../../components/SignupInput';
import { useNavigate } from 'react-router-dom';
import type { KakaoAddress } from '../../components/KakaoAddress';
import road_search_button from '../../assets/road_search_button.png';

type AddressModalProps = {
  onClose: () => void;
  onSelect: (data: { address: string; x: string; y: string }) => void;
};

const AddressModal = ({ onClose, onSelect }: AddressModalProps) => {
  const [searchQuery, setSearchQuery] = useState<string | number>('');
  const geocoderRef = useRef<any | null>(null);
  const [searchResults, setSearchResults] = useState<KakaoAddress[]>([]);

  useEffect(() => {
    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      geocoderRef.current = new window.kakao.maps.services.Geocoder();
    } else {
      console.error('Kakao Maps script가 로드되지 않았습니다.');
    }
  }, []);

  const onSearchMap = () => {
    if (searchQuery.trim() === '') {
      alert('검색어를 입력해주세요.');
      return;
    }
    if (!geocoderRef.current) {
      alert('지도 검색 기능이 아직 준비되지 않았습니다.');
      return;
    }
    geocoderRef.current.addressSearch(
      searchQuery,
      (result: KakaoAddress[], status: any) => {
        if (status === (window.kakao as any).maps.services.Status.OK) {
          setSearchResults(result);
        } else if (
          status === (window.kakao as any).maps.services.Status.ZERO_RESULT
        ) {
          alert('검색 결과가 없습니다.');
          setSearchResults([]);
        } else {
          alert('주소 검색 중 오류가 발생했습니다.');
        }
      }
    );
  };

  const handleAddressSelect = (address: KakaoAddress) => {
    setSearchResults([]);

    const addressString =
      address.road_address?.address_name ||
      address.address?.address_name ||
      address.address_name;

    onSelect({
      address: addressString,
      x: address.x, // 경도 (longitude)
      y: address.y, // 위도 (latitude)
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 backdrop-brightness-75"
      onClick={onClose}
    >
      <div
        className="absolute w-screen bottom-0 top-[30%] bg-white p-6 flex flex-col rounded-t-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="self-start mb-4 text-lg font-bold">주소검색</h2>

        <div className="flex items-center w-full gap-2 mb-4 text-gray-500">
          <input
            type="text"
            className="pl-5 rounded-[10px] w-full h-10 bg-gray-100"
            placeholder="지번, 도로명, 건물명으로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearchMap();
            }}
          />
          <img
            src={road_search_button}
            onClick={onSearchMap}
            className="flex shrink-0 text-white rounded-[10px] h-10 cursor-pointer"
            alt="검색"
          />
        </div>

        <div className="flex-1 w-full overflow-y-auto">
          {searchResults.length > 0 && (
            <ul className="w-full bg-white rounded-[10px] shadow-lg border border-gray-200 overflow-hidden">
              {searchResults.map((address, index) => (
                <li
                  key={index}
                  className="p-3 text-sm text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleAddressSelect(address)}
                >
                  <div className="font-medium text-gray-800">
                    {address.road_address?.address_name || address.address_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    [지번] {address.address?.address_name || ''}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={onClose}
          className="px-4 py-2 mt-4 bg-gray-200 rounded hover:bg-gray-300"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export const CustomerSignup = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<
    Partial<Record<keyof CustomerSignupFormData, string>>
  >({});
  const [formData, setFormData] = useState<CustomerSignupFormData>({
    id: '',
    password: '',
    passwordConfirm: '',
    email: '',
    emailConfirm: '',
    address: '',
    latitude: 0,
    longitude: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CustomerSignupFormData, string>> = {};
    let isValid = true;

    for (const key in formData) {
      if (!formData[key as keyof CustomerSignupFormData]) {
        newErrors[key as keyof CustomerSignupFormData] =
          '필수 입력 사항입니다.';
        isValid = false;
      }
    }

    if (
      formData.password &&
      formData.passwordConfirm &&
      formData.password !== formData.passwordConfirm
    ) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCustomerData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      console.log(errors, '폼 유효성 검사 실패');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/auth/user/join`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            loginId: formData.id,
            password: formData.password,
            email: formData.email,
            address: formData.address,
            latitude: formData.latitude,
            longitude: formData.longitude,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
      console.error('서버 에러 상세:', errorData);
      throw new Error(errorData.message || '회원가입 요청이 거절되었습니다.');
      }

      console.log('가입 데이터:', formData);
      alert('가입이 완료되었습니다!');
      navigate('/signup/customer-confirm'); // 가입 완료 페이지로 이동
    } catch (error: any) {
      console.error('회원가입 오류:', error);
      alert(error.message);
    }
  }

  const handleAddressSearch = () => {
    setIsModalOpen(true);
  };
  

  const handleAddressSelect = (data: {
    address: string;
    x: string;
    y: string;
  }) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      address: data.address,
      longitude: parseFloat(data.x),
      latitude: parseFloat(data.y),
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      address: undefined,
    }));
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center h-screen">
      <div className="flex flex-row items-center self-start mt-3 gap-4 px-6">
        <BackButton />
        <p>개인 회원가입</p>
      </div>
      <div className="w-screen h-px mt-3 bg-gray-200" />
      <div className="flex items-start flex-col mt-10 w-[332px]">
        {/* 1. 이메일 입력창 */}
        <SignupInput
          label="이메일"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleCustomerData}
          error={errors.email}
          variant="email"
          // onButtonClick 제거됨 (내부 로직 사용)
          placeholder="이메일 주소 입력"
        />

        {/* 2. 인증번호 입력창 */}
        <SignupInput
          label=""
          name="emailConfirm"
          type="text"
          value={formData.emailConfirm}
          onChange={handleCustomerData}
          error={errors.emailConfirm}
          variant="emailConfirm"
          // onButtonClick 제거됨 (내부 로직 사용)
          placeholder="인증번호"
          emailForVerification={formData.email} // [중요] 검증할 이메일 주소 전달
        />

        <div className="flex flex-col items-start w-full gap-4 mt-10 ">
          <SignupInput
            label="아이디"
            name="id"
            type="text"
            value={formData.id}
            onChange={handleCustomerData}
            error={errors.id}
          />
          <SignupInput
            label="비밀번호"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleCustomerData}
            error={errors.password}
            placeholder="10-20자의 영문, 숫자 포함"
          />
          <SignupInput
            label="비밀번호 확인"
            name="passwordConfirm"
            type="password"
            value={formData.passwordConfirm}
            onChange={handleCustomerData}
            error={errors.passwordConfirm}
          />
          <SignupInput
            label="주소지"
            name="address"
            type="text"
            value={formData.address}
            readOnly={true}
            error={errors.address}
            variant="address"
            onButtonClick={handleAddressSearch} // 주소 찾기는 외부 핸들러 사용
            placeholder="지번, 도로명, 건물명으로 검색"
          />
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          className="bg-(--main-color) text-white rounded-[40px] w-[316px] h-[50px] font-bold"
          onClick={handleSubmit}
        >
          가입하기
        </button>
      </div>

      {isModalOpen && (
        <AddressModal
          onClose={handleCloseModal}
          onSelect={handleAddressSelect}
        />
      )}
    </div>
  );
};
