// src/pages/KakaoCallback.tsx (신규 파일)

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const accessToken = params.get('accessToken') || params.get('token');

      // 백엔드가 토큰을 URL 파라미터로 전달한 경우
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        navigate('/stamp');
        return;
      }

      // 백엔드가 code를 전달한 경우 (백엔드 API 호출 필요)
      if (code) {
        try {
          const apiUri = import.meta.env.VITE_API_URI;
          
          // sessionStorage에서 redirectUri 가져오기 (있으면 전달, 없으면 생략)
          const redirectUri = sessionStorage.getItem('kakaoRedirectUri');
          
          // redirectUri가 있으면 쿼리 파라미터로 전달, 없으면 code만 전달
          const url = redirectUri 
            ? `${apiUri}/v1/auth/kakao?code=${code}&redirectUri=${encodeURIComponent(redirectUri)}`
            : `${apiUri}/v1/auth/kakao?code=${code}`;
          
          const response = await fetch(url, { method: 'GET' });
          
          // 사용 후 sessionStorage에서 제거
          if (redirectUri) {
            sessionStorage.removeItem('kakaoRedirectUri');
          }

          if (!response.ok) {
            throw new Error('백엔드에서 토큰 발급에 실패했습니다.');
          }

          const json = await response.json();

          const { accessToken: token } = json.data; 

          if (token) {
            localStorage.setItem('accessToken', token);
            navigate('/stamp');
          } else {
            throw new Error('토큰을 받지 못했습니다.');
          }

        } catch (error) {
          console.error('로그인 처리 중 오류 발생:', error);
          navigate('/'); // 에러 발생 시 로그인 페이지로
        }
        return;
      }

      // code도 token도 없는 경우
      console.error('인가 코드 또는 토큰을 받지 못했습니다.');
      navigate('/'); // 오류 시 로그인 페이지로
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div>로그인 처리 중입니다. 잠시만 기다려주세요...</div>
    </div>
  );
};