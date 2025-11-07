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
  address: string;
}

interface SignupInputProps {
  label: string;
  name: keyof OwnerSignupFormData | keyof CustomerSignupFormData;
  type: 'text' | 'password' | 'email';
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  variant?: 'default' | 'customerPhone' | 'customerPhoneConfirm' | 'address';
  onButtonClick?: () => void;
  readOnly?: boolean; // <--- 1. 여기에 readOnly prop 타입 추가
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
  readOnly, // <--- 2. props에서 readOnly 분해
}: SignupInputProps) => {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={name} className="mb-2">
        {label}
      </label>
      {variant === 'customerPhone' ||
      variant === 'customerPhoneConfirm' ||
      variant === 'address' ? (
        // 휴대폰 번호 또는 인증번호 입력창 또는 주소 입력창 (버튼이 있는 UI)
        <div className="flex flex-col">
          <div className="flex flex-row gap-5">
            <input
              id={name}
              name={name}
              type={type}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              readOnly={readOnly} // <--- 3. 'variant' input에 readOnly 적용
              className={`text-[14px] border border-gray-300 pl-3 rounded-[10px] w-full h-[48px] transition-all
                   }`}
            />
            <button
              type="button"
              onClick={onButtonClick}
              className="w-[68px] h-[48px] bg-gray-200 rounded-[10px] text-[12px] text-gray-700 shrink-0"
            >
              {/* variant에 따라 버튼 텍스트를 다르게 렌더링 */}
              {variant === 'customerPhone' ? '인증번호' : ''}
              {variant === 'customerPhoneConfirm' ? '확인' : ''}
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
            readOnly={readOnly} // <--- 3. 'default' input에 readOnly 적용
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