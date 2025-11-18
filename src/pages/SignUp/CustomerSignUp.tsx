/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import BackButton from '../../components/BackButton';
import SignupInput, {
  type CustomerSignupFormData,
} from '../../components/SignupInput';
import { useNavigate } from 'react-router-dom';

export const CustomerSignup = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<
    Partial<Record<keyof CustomerSignupFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CustomerSignupFormData>({
    loginId: '',
    password: '',
    passwordConfirm: '',
    email: '',
    emailConfirm: '',
    nickname: '',
  });

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CustomerSignupFormData, string>> = {};
    let isValid = true;

    // 이메일 정규식 (간단한 예시)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.loginId) {
      newErrors.loginId = '필수 입력 사항입니다.';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = '필수 입력 사항입니다.';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = '필수 입력 사항입니다.';
      isValid = false;
    } else if (formData.password.length <= 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
      isValid = false;
    }

    if (formData.password !== formData.passwordConfirm) {
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

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/v1/auth/user/join`,
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
            nickname: formData.nickname,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('서버 에러 상세:', errorData);
        throw new Error(errorData.message || '회원가입 요청이 거절되었습니다.');
      }

      const responseData = await response.json();
      const { accessToken, refreshToken } = responseData;

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        console.log('가입 성공 및 자동 로그인 처리 완료');

        alert('가입이 완료되었습니다!');
        navigate('/signup/customer-confirm');
      } else {
        throw new Error('회원가입은 성공했으나 토큰을 받지 못했습니다.');
      }
    } catch (error: any) {
      console.error('회원가입 오류:', error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

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
            name="loginId"
            type="text"
            value={formData.loginId}
            onChange={handleCustomerData}
            error={errors.loginId}
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
            label="닉네임"
            name="nickname"
            type="text"
            value={formData.nickname}
            onChange={handleCustomerData}
            error={errors.nickname}
            placeholder="1-10자 이내"
          />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-(--main-color) text-white rounded-[40px] w-[316px] h-[50px] font-bold"
            disabled={isSubmitting}
          >
            가입하기
          </button>
        </div>
      </form>
    </div>
  );
};