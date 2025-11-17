/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

export interface OwnerSignupFormData {
  loginId: string;
  password: string;
  passwordConfirm: string;
  email: string;
  businessNumber: string;
  location: string;
  latitude: number;
  longitude: number;
}

export interface CustomerSignupFormData {
  loginId: string;
  password: string;
  passwordConfirm: string;
  email: string;
  emailConfirm: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

interface SignupInputProps {
  label: string;
  name: keyof OwnerSignupFormData | keyof CustomerSignupFormData;
  type: 'text' | 'password' | 'email';
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  variant?: 'default' | 'address' | 'email' | 'emailConfirm';
  onButtonClick?: () => void;
  readOnly?: boolean;
  emailForVerification?: string;
}

async function sendEmailVerificationCode(email: string) {
  if (!email) {
    alert('이메일을 입력해주세요.');
    return;
  }
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URI}/v1/auth/email/send`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    );
    if (!response.ok) {
      throw new Error('인증번호 전송에 실패했습니다. 다시 시도해주세요.');
    }
    alert('인증번호가 전송되었습니다!');
  } catch (error: any) {
    console.error('인증번호 전송 오류:', error);
    alert(error.message);
  }
}

async function verifyEmailCode(email: string, code: string) {
  if (!email || !code) {
    alert('이메일과 인증번호를 모두 확인해주세요.');
    return;
  }
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URI}/v1/auth/email/verify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      }
    );
    if (!response.ok) {
      throw new Error('인증에 실패했습니다. 인증번호를 확인해주세요.');
    }
    alert('이메일 인증이 완료되었습니다!');
  } catch (error: any) {
    console.error('이메일 인증 오류:', error);
    alert(error.message);
  }
}

const SignupInput = ({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  error,
  variant = 'default',
  onButtonClick,
  readOnly,
  emailForVerification,
}: SignupInputProps) => {
  const handleButtonClick = () => {
    if (variant === 'email') {
      sendEmailVerificationCode(value);
    } else if (variant === 'emailConfirm') {
      if (emailForVerification) {
        verifyEmailCode(emailForVerification, value); // emailForVerification - 부모 컴포넌트에서 전달된 이메일 주소, value - 입력된 인증번호
      } else {
        console.error('검증할 이메일 주소가 전달되지 않았습니다.');
      }
    } else if (onButtonClick) {
      onButtonClick();
    }
  };

  return (
    <div className="flex flex-col w-full">
      <label htmlFor={name} className="mb-2 text-[15px] text-[#5B5B5B]">
        {label}
      </label>
      {variant === 'address' ||
      variant === 'email' ||
      variant === 'emailConfirm' ? (
        // 이메일 또는 인증번호 입력창 또는 주소 입력창 (버튼이 있는 UI)
        <div className="flex flex-col">
          <div className="flex flex-row gap-5">
            <input
              id={name}
              name={name}
              type={type}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              readOnly={readOnly}
              className="text-[14px] border border-gray-300 pl-3 rounded-[10px] w-full h-[48px] transition-all"
            />
            <button
              type="button"
              onClick={handleButtonClick}
              className="w-[68px] h-[48px] bg-(--fill-color6) rounded-[10px] text-[12px] text-white shrink-0 cursor-pointer hover:bg-gray-300 active:bg-(--fill-color3) transition-colors"
            >
              {/* variant에 따라 버튼 텍스트를 다르게 렌더링 */}
              {variant === 'email' ? (
                <>
                  인증번호
                  <br />
                  전송
                </>
              ) : (
                ''
              )}
              {variant === 'emailConfirm' ? '확인' : ''}
              {variant === 'address' ? '주소 찾기' : ''}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      ) : (
        // 'default' variant일 경우 (버튼이 없는 UI)
        <div>
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            className="border-none pl-4 bg-(--fill-color1) rounded-[10px] w-full h-[48px] transition-all mb-4 text-[14px]"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default SignupInput;
