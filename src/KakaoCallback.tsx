// src/pages/KakaoCallback.tsx (신규 파일)

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (!code) {
        console.error('인가 코드를 받지 못했습니다.');
        navigate('/'); // 오류 시 로그인 페이지로
        return;
      }

      try {
        const apiUri = import.meta.env.VITE_API_URI;

        const response = await fetch(
          `${apiUri}/v1/auth/kakao?code=${code}`,
          { method: 'GET' }
        );

        if (!response.ok) {
          throw new Error('백엔드에서 토큰 발급에 실패했습니다.');
        }

        const json = await response.json();

        const { accessToken } = json.data; 

        localStorage.setItem('accessToken', accessToken);
        // localStorage.setItem('refreshToken', refreshToken);

        navigate('/stamp');

      } catch (error) {
        console.error('로그인 처리 중 오류 발생:', error);
        navigate('/'); // 에러 발생 시 로그인 페이지로
      }
    };

    fetchToken();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div>로그인 처리 중입니다. 잠시만 기다려주세요...</div>
    </div>
  );
};