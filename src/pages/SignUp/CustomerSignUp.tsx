/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import BackButton from '../../components/BackButton';
import SignupInput, {
  type CustomerSignupFormData,
} from '../../components/SignupInput'; 
import { useNavigate } from 'react-router-dom';
import { AddressModal } from '../../components/AddressModal.tsx';

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
        `${import.meta.env.VITE_API_URI}/v1/auth/user/join`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            loginId: formData.id,
            password: formData.password,
            passwordConfirm: formData.passwordConfirm,
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
          placeholder="인증번호"
          emailForVerification={formData.email}
        />

        <div className="flex flex-col items-start w-full mt-10 gap-2.5">
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
            onButtonClick={handleAddressSearch} // 이 부분은 동일
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