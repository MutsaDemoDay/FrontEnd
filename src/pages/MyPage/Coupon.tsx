import React, { useState, useRef } from 'react';
import BackButton from '../../components/BackButton';
import { UserBottomBar } from '../../components/UserBottomBar';

const Coupon: React.FC = () => {
  // 1. 입력된 코드를 저장할 state (최대 4자리)
  const [code, setCode] = useState<string>('');

  // 2. 숨겨진 input 요소에 접근하기 위한 ref
  const inputRef = useRef<HTMLInputElement>(null);

  // 3. 입력 컨테이너 클릭 시 숨겨진 input에 포커스
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  // 4. 입력 값 변경 핸들러 (숫자만 입력 가능, 최대 4글자)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 허용
    if (value.length <= 4) {
      setCode(value);

      // (옵션) 4자리가 모두 입력되었을 때의 액션 (예: API 호출)
      if (value.length === 4) {
        console.log('입력 완료:', value);
        // TODO: 여기서 검증 API 호출 로직 추가
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* 헤더 */}
      <header className="flex items-center p-4 border-b border-gray-100 h-14">
        <BackButton />
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-20">
        <h2 className="text-xl font-bold text-gray-800 mb-10 leading-snug">
          매장 직원이 확인코드를
          <br />
          누르게 해주세요.
        </h2>

        {/* 실제 입력을 받는 숨겨진 Input 
            opacity-0으로 화면엔 안 보이지만, 포커스되면 모바일 키패드가 올라옵니다.
        */}
        <input
          ref={inputRef}
          type="tel" // 모바일에서 숫자 키패드 호출
          value={code}
          onChange={handleChange}
          className="absolute opacity-0 mr-1 ml-1 w-1 h-1 pointer-events-none"
          maxLength={4}
        />

        {/* 확인 코드 입력 박스 (클릭 시 input에 포커스) */}
        <div
          onClick={handleContainerClick}
          className="w-full mr-2 ml-2 max-w-xs bg-white rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.05)] p-8 mb-12 border border-gray-50 cursor-pointer"
        >
          <div className="flex justify-between items-center">
            {/* 4개의 입력 칸을 반복문으로 렌더링 */}
            {[0, 1, 2, 3].map((index) => {
              const digit = code[index];
              const isFocused = index === code.length; // 현재 입력해야 할 칸인지 확인
              const isFilled = index < code.length; // 이미 입력된 칸인지 확인

              return (
                <div
                  key={index}
                  className={`
                    w-12 h-16 rounded-lg flex items-center justify-center text-2xl transition-all duration-200
                    ${
                      isFocused
                        ? 'border-2 border-orange-400 bg-white' // 현재 입력 중 (주황 테두리)
                        : 'border border-gray-300 bg-white' // 대기 상태
                    }
                  `}
                >
                  {/* 입력된 값은 '*'로 표시, 없으면 공백 */}
                  {isFilled ? (
                    <span className="text-gray-400 text-3xl pt-2">*</span>
                  ) : (
                    ''
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="space-y-2">
          <h3 className="text-gray-800 font-bold text-base">
            카페드림 리워드 쿠폰
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            스탬프를 다 채워 달성한
            <br />
            리워드 쿠폰입니다.
          </p>
          <p className="text-sm text-blue-500 font-semibold pt-1">
            기한: 2024.01.01까지
          </p>
        </div>
      </div>

      <UserBottomBar />
    </div>
  );
};

export default Coupon;
