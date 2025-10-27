import { useState } from 'react';
import BackButton from '../../components/BackButton';
// 새로 만든 SignupInput 컴포넌트를 import 합니다.
import SignupInput, {
  type OwnerSignupFormData,
} from '../../components/SignupInput';

export const OwnerSignup = () => {
  const [errors, setErrors] = useState<Partial<OwnerSignupFormData>>({});
  const [formData, setFormData] = useState<OwnerSignupFormData>({
    id: '',
    password: '',
    passwordConfirm: '',
    phoneNumber: '',
    email: '',
    businessNumber: '',
    location: '',
  });

  const validateForm = () => {
    const newErrors: Partial<OwnerSignupFormData> = {}; // 1. 임시 에러 객체 생성
    let isValid = true; // 2. 유효성 플래그

    // 3. 모든 필드가 비어있는지 반복문으로 확인
    for (const key in formData) {
      if (!formData[key as keyof OwnerSignupFormData]) {
        newErrors[key as keyof OwnerSignupFormData] = '이 필드를 입력해주세요.';
        isValid = false; // 하나라도 비어있으면 폼은 유효하지 않음
      }
    }

    // 4. 특정 필드에 대한 추가 검사 (비밀번호 일치 여부)
    if (
      formData.password &&
      formData.passwordConfirm &&
      formData.password !== formData.passwordConfirm
    ) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
      isValid = false;
    }

    setErrors(newErrors); // 5. 발견된 에러들을 실제 상태에 업데이트
    return isValid; // 6. 최종 유효성 결과 반환 (true 또는 false)
  };

  const handleOwnerData = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="flex flex-col items-center h-screen">
      {/* 상단바 */}
      <div className="w-full flex flex-row items-center self-start mt-3 gap-4 px-6">
        <BackButton />
        <p>점주 회원가입</p>
      </div>

      {/* 구분선 */}
      <div className="w-screen h-[1px] mt-3 bg-gray-200" />

      {/* 입력 폼 */}
      <div className="flex items-start flex-col mt-10 gap-4 w-[332px]">
        <SignupInput
          label="아이디"
          name="id"
          type="text"
          value={formData.id}
          onChange={handleOwnerData}
          error={errors.id}
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
          label="휴대폰 번호"
          name="phoneNumber"
          type="text"
          value={formData.phoneNumber}
          onChange={handleOwnerData}
          error={errors.phoneNumber}
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
          label="사업자 등록번호"
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
          error={errors.location}
        />
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
