/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import main_logo from '../assets/main_logo.png';

export const FirstPage = () => {
  const [loginData, setLoginData] = useState({
    loginId: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleFindIdClick = () => {
    navigate('/find-id');
  };

  const handlePasswordFindClick = () => {
    navigate('/find-password');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleKakaoLogin = async () => {
    try {
      // ✅ 1. 프론트엔드의 콜백 컴포넌트 주소
      //    (Vite 기본 포트 5173 또는 3000 등, 2단계에서 만들 컴포넌트 경로)
      const frontendRedirectUri = 'http://localhost:3000/oauth/kakao/callback';

      const apiUri = import.meta.env.VITE_API_URI; // (예: https://daango.store/api)

      // ✅ 2. 백엔드의 *첫 번째* API 호출 (로그인 시작 요청)
      //    이때 프론트엔드 콜백 주소를 백엔드에 알려줍니다.
      const response = await fetch(
        `${apiUri}/v1/auth/login?redirectUri=${frontendRedirectUri}`
      );

      if (!response.ok) {
        throw new Error('백엔드에서 카카오 URL을 가져오는데 실패했습니다.');
      }

      // ✅ 3. 백엔드가 "카카오로 가라"고 알려준 URL을 JSON에서 꺼냄
      //    (명세서의 "data" 필드 값)
      const json = await response.json();
      const kakaoAuthUrl = json.data;

      if (!kakaoAuthUrl) {
        throw new Error("API 응답에 'data' 필드가 없습니다.");
      }

      // ✅ 4. 사용자를 실제 카카오 로그인 페이지로 보냄
      window.location.href = kakaoAuthUrl;
    } catch (error) {
      console.error('카카오 로그인 시작 중 오류:', error);
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/v1/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            loginId: loginData.loginId,
            password: loginData.password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.'
        );
      }

      const data = await response.json();
      console.log('로그인 성공:', data);

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      navigate('/stamp');
    } catch (error: any) {
      console.error('로그인 오류:', error);
    }
  }

  return (
    <div className="flex flex-col mt-12 items-center">
      {/* 로고, 앱이름, 부가설명 */}
      <div className="flex flex-col w-[200px] h-[300px] items-center">
        <img
          src={main_logo}
          alt="Main Logo"
          className="w-[160px] h-[160px] rounded-[50px] bg-gray-300"
        />

        <p className="mt-5 font-bold text-[28px] text-(--main-color)">당고</p>
        <div className="flex flex-col items-center">
          <p className="text-center mt-1 text-gray-400 text-[12px]">
            소상공인과 고객을 연결하는
            <br />
            스탬프 기반 리워드 플랫폼
          </p>
        </div>
      </div>

      {/* 아이디, 비밀번호 */}
      <form className="flex flex-col w-[320px] mt-20" onSubmit={handleLogin}>
        <input
          className="bg-[#F3F3F3] rounded-[40px] h-[50px] pl-5 mb-2"
          placeholder="아이디"
          value={loginData.loginId}
          name="loginId"
          onChange={handleChange}
        />
        <input
          className="bg-[#F3F3F3] rounded-[40px] h-[50px] pl-5 mb-3"
          placeholder="비밀번호"
          type="password"
          value={loginData.password}
          name="password"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-(--main-color) text-white rounded-[40px] h-[50px] font-bold cursor-pointer"
        >
          로그인
        </button>
      </form>

      {/* 소셜 로그인 */}
      <div className="flex flex-row justify-center w-[300px] mt-7 space-x-5 text-sm text-gray-400">
        <p className="cursor-pointer" onClick={handleKakaoLogin}>
          카카오톡 로그인
        </p>
      </div>

      {/* 회원가입, 아이디/비밀번호 찾기 */}
      <div className="flex flex-row justify-between w-[280px] mt-10 text-sm text-gray-400">
        <p className="cursor-pointer" onClick={handleFindIdClick}>
          아이디 찾기
        </p>
        <p className="cursor-pointer" onClick={handlePasswordFindClick}>
          비밀번호 찾기
        </p>
        <p className="cursor-pointer" onClick={handleSignUpClick}>
          회원가입
        </p>
      </div>
    </div>
  );
};
