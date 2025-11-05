import React from 'react';

export interface OwnerSignupFormData {
  id: string;
  password: string;
  passwordConfirm: string;
  phoneNumber: string;
  email: string;
  businessNumber: string;
  location: string;
}

export interface CustomerSignupFormData {
  id: string;
  password: string;
  passwordConfirm: string;
  phoneNumber: string;
  phoneNumberConfirm: string;
  email: string;
}

interface SignupInputProps {
  label: string;
  name: keyof OwnerSignupFormData | keyof CustomerSignupFormData;
  type: 'text' | 'password' | 'email';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  variant?: 'default' | 'customerPhone' | 'customerPhoneConfirm';
  onButtonClick?: () => void;
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
}: SignupInputProps) => {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={name} className="mb-2">
        {label}
      </label>

      {/* 1. 조건을 다시 두 variant를 모두 포함하도록 변경합니다. */}
      {variant === 'customerPhone' || variant === 'customerPhoneConfirm' ? (
        // 휴대폰 번호 또는 인증번호 입력창 (버튼이 있는 UI)
        <div className="flex flex-col">
          <div className="flex flex-row gap-5">
            <input
              id={name}
              name={name}
              type={type}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className={`border-[1px] border-gray-300 pl-3 rounded-[10px] w-full h-[48px] transition-all
                   }`}
            />
            <button
              type="button"
              onClick={onButtonClick}
              className="w-[68px] h-[48px] bg-gray-200 rounded-[10px] text-[12px] text-gray-700 shrink-0"
            >
              {/* variant에 따라 버튼 텍스트를 다르게 렌더링합니다. */}
              {variant === 'customerPhone' ? '인증번호' : '확인'}
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
            className={`border-none pl-3 bg-gray-200 rounded-[10px] w-full h-[48px] transition-all mb-4
                   }`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default SignupInput;