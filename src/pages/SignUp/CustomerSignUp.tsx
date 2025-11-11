/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'; // <--- useEffect 추가
import BackButton from '../../components/BackButton';
import SignupInput, {
  type CustomerSignupFormData,
} from '../../components/SignupInput';
import { useNavigate } from 'react-router-dom';
import type { KakaoAddress } from '../../components/KakaoAddress';
import road_search_button from '../../assets/road_search_button.png';

type AddressModalProps = {
  onClose: () => void;
  onSelect: (address: string) => void;
};

const AddressModal = ({ onClose, onSelect }: AddressModalProps) => {
  const [searchQuery, setSearchQuery] = useState<string | number>('');
  const geocoderRef = useRef<any | null>(null); // kakao.maps.services.Geocoder
  const [searchResults, setSearchResults] = useState<KakaoAddress[]>([]);

  // Geocoder 초기화
  useEffect(() => {
    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      geocoderRef.current = new window.kakao.maps.services.Geocoder();
    } else {
      console.error('Kakao Maps script가 로드되지 않았습니다.');
      alert(
        '주소 검색 기능을 불러오는 데 실패했습니다. 페이지를 새로고침 해주세요.'
      );
    }
  }, []);

  const onSearchMap = () => {
    if (searchQuery.trim() === '') {
      alert('검색어를 입력해주세요.');
      return;
    }
    if (!geocoderRef.current) {
      alert(
        '지도 검색 기능이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.'
      );
      console.warn('Geocoder is not ready yet.', geocoderRef.current);
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
    onSelect(
      address.road_address?.address_name ||
        address.address?.address_name ||
        address.address?.region_1depth_name ||
        address.address?.region_2depth_name ||
        address.address?.region_3depth_name ||
        address.address_name ||
        address.x ||
        address.y
    );
    console.log('Selected address:', address);
  };

  return (
    <div
      className="fixed inset-0 z-50 backdrop-brightness-75"
      onClick={onClose} // 밖을 클릭하면 닫기
    >
      {/* 2. 모달 컨텐츠 (Request 2): 화면 하단 70% 차지 */}
      <div
        className="absolute w-screen bottom-0 top-[30%] // <--- 30% 지점에서 시작
                   bg-white p-6 flex flex-col rounded-t-xl" // <--- 상단만 둥글게
        onClick={(e) => e.stopPropagation()} // 모달 안 클릭 시 닫힘 방지
      >
        <h2 className="self-start mb-4 text-lg font-bold">주소검색</h2>

        {/* 검색창 (기존과 동일) */}
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
            className="flex shrink-0 text-white rounded-[10px] h-10"
          />
        </div>

        {/* 3. 검색 결과 (레이아웃 개선): 남은 공간을 채우고, 스크롤 가능하게 */}
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

        {/* 닫기 버튼: 스크롤 영역과 관계없이 항상 하단에 고정 */}
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
  const [errors, setErrors] = useState<Partial<CustomerSignupFormData>>({});
  const [formData, setFormData] = useState<CustomerSignupFormData>({
    id: '',
    password: '',
    passwordConfirm: '',
    email: '',
    emailConfirm: '',
    address: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<CustomerSignupFormData> = {};
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('가입 데이터:', formData);
      alert('가입이 완료되었습니다!');
      navigate('/signup/customer-confirm');
    } else {
      console.log(errors, '폼 유효성 검사 실패');
    }
  };

  const handlePhoneVerification = () => {
    alert('인증번호가 발송되었습니다!');
  };

  const handlePhoneConfirm = () => {
    alert('인증번호가 확인되었습니다!');
  };

  const handleAddressSearch = () => {
    setIsModalOpen(true);
  };

  const handleAddressSelect = (selectedAddress: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      address: selectedAddress,
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
        <SignupInput
          label="이메일"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleCustomerData}
          error={errors.email}
          variant="email"
          onButtonClick={handlePhoneVerification}
          placeholder='이메일 주소 입력'
        />
        <SignupInput
          label=""
          name="emailConfirm"
          type="text"
          value={formData.emailConfirm}
          onChange={handleCustomerData}
          error={errors.emailConfirm}
          variant="emailConfirm"
          placeholder="인증번호"
          onButtonClick={handlePhoneConfirm}
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
            placeholder='10-20자의 영문, 숫자 포함'
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
            readOnly={true} // 직접 입력 방지
            error={errors.address}
            variant="address"
            onButtonClick={handleAddressSearch} // 모달 열기
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
