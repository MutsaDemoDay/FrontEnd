/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import main_logo from '../assets/main_logo.png';
import kakako_logo from '../assets/kakao_logo.png';

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
      const frontendRedirectUri = 'http://localhost:3000/oauth/kakao/callback';

      const apiUri = import.meta.env.VITE_API_URI;

      const response = await fetch(
        `${apiUri}/v1/auth/login?redirectUri=${encodeURIComponent(
          frontendRedirectUri
        )}`
      );

      if (!response.ok) {
        throw new Error('백엔드에서 카카오 URL을 가져오는데 실패했습니다.');
      }

      const json = await response.json();
      const kakaoAuthUrl = json.data;

      if (!kakaoAuthUrl) {
        throw new Error("API 응답에 'data' 필드가 없습니다.");
      }

      sessionStorage.setItem('kakaoRedirectUri', frontendRedirectUri);

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
        alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
        throw new Error(
          '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.'
        );
      }

      const responseData = await response.json();
      const resultData = responseData.data || responseData;

      if (resultData.accessToken) {
        // 1. 토큰 저장
        localStorage.setItem('accessToken', resultData.accessToken);
        localStorage.setItem('refreshToken', resultData.refreshToken);
        
        // 2. 온보딩 완료 여부 확인
        // (유저 타입에 상관없이 본인의 온보딩이 끝났으면 true라고 가정)
        const isUserOnboarded = resultData.userOnboarded;
        const isManagerOnboarded = resultData.managerOnboarded;
        
        // 온보딩이 이미 완료된 경우 해당 페이지로 이동
        if (isUserOnboarded) {
          navigate('/stamp');
          return;
        } else if (isManagerOnboarded) {
          navigate('/owner/dashboard');
          return;
        }

        // 3. 온보딩 미완료 시: userType에 따른 분기 처리
        const userType = resultData.userType; // "USER" | "MANAGER"

        if (userType === 'USER') {
          navigate('/signup/customer-confirm');
        } else if (userType === 'MANAGER') {
          navigate('/shop-profile');
        } else {
          // userType이 없거나 이상한 값일 경우 예외 처리
          console.error('알 수 없는 유저 타입:', userType);
          alert('로그인 정보에 오류가 있습니다. 관리자에게 문의하세요.');
        }

      } else {
        console.error('토큰을 찾을 수 없습니다.', resultData);
        alert('로그인 처리에 실패했습니다. (토큰 없음)');
      }
    } catch (error) {
      console.error('로그인 처리 중 오류 발생:', error);
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
          <p className="text-center mt-1 text-(--fill-color6) text-[12px]">
            소상공인과 고객을 연결하는
            <br />
            스탬프 기반 리워드 플랫폼
          </p>
        </div>
      </div>

      {/* 아이디, 비밀번호 */}
      <form className="flex flex-col w-[320px] mt-20 " onSubmit={handleLogin}>
        <input
          className="bg-[#F3F3F3] rounded-[40px] h-[50px] pl-5 mb-2 "
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
      <div className="flex flex-row justify-center w-[300px] mt-7 space-x-5 text-sm text-(--fill-color7)">
        <div className='flex flex-col items-center justify-center cursor-pointer gap-3' onClick={handleKakaoLogin}>
          <img src={kakako_logo} alt="Kakao Logo" className='rounded-full w-[48px] h-[48px]' />
          <p className="cursor-pointer text-[10px]">
          카카오톡으로 로그인
        </p>
        </div>
        
      </div>

      {/* 회원가입, 아이디/비밀번호 찾기 */}
      <div className="flex flex-row justify-between w-[280px] mt-10 text-sm text-(--fill-color6)">
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