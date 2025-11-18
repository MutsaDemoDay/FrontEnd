/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import BackButton from '../../components/BackButton';
import SignupInput, {
  type OwnerSignupFormData,
} from '../../components/SignupInput';
import { useNavigate } from 'react-router-dom';
import { AddressModal } from '../../components/AddressModal';


export const OwnerSignup = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof OwnerSignupFormData, string>>>({});

  const [formData, setFormData] = useState<OwnerSignupFormData>({
    loginId: '',
    password: '',
    passwordConfirm: '',
    email: '',
    businessNumber: '',
    location: '',
    latitude: 0,
    longitude: 0,
  });

  const validateForm = () => {
    const newErrors: Partial<Record<keyof OwnerSignupFormData, string>> = {};
    let isValid = true;

    for (const key in formData) {
      if (!formData[key as keyof OwnerSignupFormData]) {
        newErrors[key as keyof OwnerSignupFormData] = '이 필드를 입력해주세요.';
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

  const handleOwnerData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  async function handleSubmit (e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      console.log(errors, '폼 유효성 검사 실패');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/v1/auth/manager/join`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            loginId: formData.loginId,
            password: formData.password,
            passwordConfirm: formData.passwordConfirm,
            email: formData.email,
            businessNum: formData.businessNumber,
            address: formData.location,
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
      navigate('/signup/owner-success');
    } catch (error: any) {
      console.error('회원가입 오류:', error);
      alert(error.message);
    }
  };

  const handleAddressSearch = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddressSelect = (data: {
    address: string;
    x: string;
    y: string;
  }) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      location: data.address,
      longitude: parseFloat(data.x), 
      latitude: parseFloat(data.y),
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      location: undefined,
    }));
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center h-screen">
      <div className="w-full flex flex-row items-center self-start mt-3 gap-4 px-6">
        <BackButton />
        <p>점주 회원가입</p>
      </div>
      <div className="w-screen h-px mt-3 bg-gray-200" />

      {/* 입력 폼 */}
      <div className="flex items-start flex-col mt-10 gap-4 w-[332px]">
        <SignupInput
          label="아이디"
          name="loginId"
          type="text"
          value={formData.loginId}
          onChange={handleOwnerData}
          error={errors.loginId}
        />
        <SignupInput
          label="비밀번호"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleOwnerData}
          error={errors.password}
        />
        <SignupInput
          label="비밀번호 확인"
          name="passwordConfirm"
          type="password"
          value={formData.passwordConfirm}
          onChange={handleOwnerData}
          error={errors.passwordConfirm}
        />
        <SignupInput
          label="이메일"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleOwnerData}
          error={errors.email}
        />
        <SignupInput
          label="사업자등록번호"
          name="businessNumber"
          type="text"
          value={formData.businessNumber}
          onChange={handleOwnerData}
          error={errors.businessNumber}
        />
        <SignupInput
          label="가게 주소"
          name="location"
          type="text"
          value={formData.location}
          onChange={handleOwnerData} 
          readOnly={true}
          error={errors.location}
          variant="address"
          onButtonClick={handleAddressSearch}
          placeholder="지번, 도로명, 건물명으로 검색"
        />
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