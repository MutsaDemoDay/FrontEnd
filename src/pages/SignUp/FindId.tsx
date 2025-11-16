/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { sendEmailVerificationCode, verifyEmailCode } from '../../api/EmailVerify';
import { useState } from 'react';

export const FindId = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-row items-center self-start mt-3 gap-4 px-6">
        <BackButton />
        <p className="text-[16px]">아이디 찾기</p>
      </div>

      {/* 구분선 */}
      <div className="w-screen h-px mt-3 bg-gray-200" />

      <div className="flex flex-row w-full justify-center items-center h-[60px] text-[12px]">
        <div className="flex h-full items-center justify-center w-1/2 border-b-2">
          개인회원
        </div>
        <div className="flex h-full items-center justify-center w-1/2 border-b border-gray-500">
          점주회원
        </div>
      </div>

      <div className="w-full h-[248px] px-6">
        <p className="self-start mt-10 text-[20px]">
          가입자명과 이메일을
          <br />
          입력해 주세요.
        </p>

        <div className="flex flex-col mt-10 w-full items-center">
          <div className="flex flex-col items-center w-full text-[12px]">
            <input
              type="text"
              placeholder="가입자명"
              className="w-full border border-gray-400 rounded-[10px] p-3"
            />
            <div className="flex flex-row gap-4 mt-2 w-full">
              <input
                type="email"
                placeholder="이메일 주소 입력"
                className="w-full h-[48px] border-gray-400 rounded-[10px] border p-3"
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="w-[72px] h-[48px] p-2 rounded-[10px] bg-gray-200 text-[12px] text-[#5B5B5B] cursor-pointer" onClick={() => sendEmailVerificationCode(email)}>
                인증번호 전송
              </button>
            </div>

            <div className="flex flex-row gap-4 mt-2 w-full">
              <input
                type="text"
                placeholder="인증번호 입력"
                className="w-full h-[48px] border-gray-400 rounded-[10px] border p-3"
                onChange={(e) => setCode(e.target.value)}
              />
              <button className="w-[72px] h-[48px] p-2 rounded-[10px] bg-gray-200 text-[12px] text-[#5B5B5B] cursor-pointer" onClick={() => verifyEmailCode(email, code)}>
                확인
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed w-full h-[56px] text-[20px] font-semibold px-6 bottom-10 cursor-pointer">
        <button className="w-full rounded-[40px] bg-(--main-color) text-white p-3" onClick={() => navigate('/find-id-confirm')}>
          다음
        </button>
      </div>
    </div>
  );
};
