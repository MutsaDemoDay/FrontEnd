import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

export const FindPassword = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-row items-center self-start mt-3 gap-4 px-6">
        <BackButton />
        <p className="text-[16px]">비밀번호 찾기</p>
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
      
      <div className="w-full h-[248px] px-10">
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
              className="w-full border border-(--fill-color3) rounded-[10px] p-3"
            />
            <input
              type="text"
              placeholder="아이디 입력"
              className="w-full border border-(--fill-color3) rounded-[10px] p-3 mt-2"
            />
            <div className="flex flex-row gap-4 mt-2 w-full">
              <input
                type="email"
                placeholder="이메일 주소 입력"
                className="w-full h-[48px] border-(--fill-color3) rounded-[10px] border p-3"
              />
              <button className="w-[72px] h-[48px] p-2 rounded-[10px] bg-gray-200 text-[12px] text-[#5B5B5B] cursor-pointer">
                인증번호 전송
              </button>
            </div>

            <div className="flex flex-row gap-4 mt-2 w-full">
              <input
                type="text"
                placeholder="인증번호 입력"
                className="w-full h-[48px] border-(--fill-color3) rounded-[10px] border p-3"
              />
              <button className="w-[72px] h-[48px] p-2 rounded-[10px] bg-gray-200 text-[12px] text-[#5B5B5B] cursor-pointer">
                확인
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed w-full h-[56px] text-[20px] font-semibold px-6 bottom-10 cursor-pointer">
        <button
          className="w-full rounded-[40px] bg-(--main-color) text-white p-3"
          onClick={() => navigate('/find-id-confirm')}
        >
          다음
        </button>
      </div>
    </div>
  );
};
