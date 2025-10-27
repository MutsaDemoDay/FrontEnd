import { useState } from 'react';
import BackButton from '../../components/BackButton';
import SignupInput, {
  type CustomerSignupFormData,
} from '../../components/SignupInput';

export const CustomerSignup = () => {
  const [errors, setErrors] = useState<Partial<CustomerSignupFormData>>({});
  const [formData, setFormData] = useState<CustomerSignupFormData>({
    id: '',
    password: '',
    passwordConfirm: '',
    phoneNumber: '',
    phoneNumberConfirm: '',
    email: '',
  });

  const validateForm = () => {
    const newErrors: Partial<CustomerSignupFormData> = {}; // 임시 에러
    let isValid = true; // 유효성 플래그

    // 빈 필드 유효성 검사
    for (const key in formData) {
      if (!formData[key as keyof CustomerSignupFormData]) {
        newErrors[key as keyof CustomerSignupFormData] =
          '필수 입력 사항입니다.';
        isValid = false; // 하나라도 비어있으면 폼은 유효하지 않음
      }
    }

    // 비밀번호 일치 여부
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
      alert('가입 절차를 진행합니다!');
    } else {
      console.log(errors, '폼 유효성 검사 실패');
    }
  };

  const handlePhoneVerification = () => {
    // 여기에 휴대폰 인증 로직 추가
    alert('인증번호가 발송되었습니다!');
  };

  const handlePhoneConfirm = () => {
    // 여기에 인증번호 확인 로직 추가
    alert('인증번호가 확인되었습니다!');
  };

  return (
    <div className="flex flex-col items-center h-screen">
      {/* 상단바 */}
      <div className="flex flex-row items-center self-start mt-3 gap-4 px-6">
        <BackButton />
        <p>개인 회원가입</p>
      </div>

      {/* 구분선 */}
      <div className="w-screen h-[1px] mt-3 bg-gray-200" />

      {/* 입력 폼 */}
      <div className="flex items-start flex-col mt-10 w-[332px]">
        <SignupInput
          label="휴대폰"
          name="phoneNumber"
          type="text"
          value={formData.phoneNumber}
          onChange={handleCustomerData}
          error={errors.phoneNumber}
          variant="customerPhone"
          onButtonClick={handlePhoneVerification}
        />
        <SignupInput
          label=""
          name="phoneNumberConfirm"
          type="text"
          value={formData.phoneNumberConfirm}
          onChange={handleCustomerData}
          error={errors.phoneNumberConfirm}
          variant="customerPhoneConfirm"
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
            label="이메일"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleCustomerData}
            error={errors.email}
          />
        </div>
      </div>

      {/* 회원가입 버튼 */}
      <div className="flex justify-center mt-6">
        <button
          className="bg-[#F3F3F3] text-black rounded-[40px] w-[316px] h-[50px] font-bold"
          onClick={handleSubmit}
        >
          가입하기
        </button>
      </div>
    </div>
  );
};
