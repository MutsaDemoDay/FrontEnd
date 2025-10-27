import { useNavigate } from "react-router-dom";

export const FirstPage = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <div className="flex flex-col mt-12 items-center">
      {/* 로고, 앱이름, 부가설명 */}
      <div className="flex flex-col w-[200px] h-[300px] items-center">
        <div className="w-[200px] h-[200px] rounded-[50px] bg-gray-300" />
        <p className="mt-5 font-bold text-[34px]">앱이름</p>
        <p className="mt-1 text-gray-400 text-[16px]">부가설명</p>
      </div>

      {/* 아이디, 비밀번호 */}
      <div className="flex flex-col w-[320px] mt-12">
        <input
          className="bg-[#F3F3F3] rounded-[40px] h-[50px] pl-5 mb-2"
          placeholder="아이디"
        />
        <input
          className="bg-[#F3F3F3] rounded-[40px] h-[50px] pl-5 mb-3"
          placeholder="비밀번호"
          type="password"
        />
        <button className="bg-[#F3F3F3] text-black rounded-[40px] h-[50px] font-bold">
          로그인
        </button>
      </div>

      {/* 소셜 로그인 */}
      <div className="flex flex-row justify-center w-[300px] mt-7 space-x-5 text-sm text-gray-400">
        <p className="">카카오톡 로그인</p>
        <p className="">네이버 로그인</p>
        <p className="">구글 로그인</p>
      </div>

      {/* 회원가입, 아이디/비밀번호 찾기 */}
      <div className="flex flex-row justify-between w-[300px] mt-10 text-sm text-gray-400">
        <p className="">아이디 찾기</p>
        <p className="">비밀번호 찾기</p>
        <p className="cursor-pointer" onClick={handleSignUpClick}>회원가입</p>
      </div>
    </div>
  );
};
