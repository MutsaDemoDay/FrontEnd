// src/pages/KakaoCallback.tsx (신규 파일)

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      // ✅ 1. URL에서 카카오가 준 'code'를 꺼냅니다.
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (!code) {
        console.error('인가 코드를 받지 못했습니다.');
        navigate('/'); // 오류 시 로그인 페이지로
        return;
      }

      try {
        const apiUri = import.meta.env.VITE_API_URI; // (예: https://daango.store/api)

        // ✅ 2. 백엔드의 *두 번째* API 호출 (로그인 완료 요청)
        //    이 'code'를 백엔드로 보내 최종 토큰을 받습니다.
        const response = await fetch(
          `${apiUri}/v1/auth/kakao?code=${code}`,
          { method: 'GET' }
        );

        if (!response.ok) {
          throw new Error('백엔드에서 토큰 발급에 실패했습니다.');
        }

        const json = await response.json();

        // ✅ 3. API 명세서의 두 번째 응답 ("data": {"id": ..., "accessToken": ...})
        const { accessToken } = json.data; 
        // const { accessToken, refreshToken } = json.data; // (리프레시 토큰이 있다면 같이)

        // ✅ 4. 받은 최종 토큰(JWT)을 로컬 스토리지에 저장
        localStorage.setItem('accessToken', accessToken);
        // localStorage.setItem('refreshToken', refreshToken);

        // ✅ 5. 로그인이 끝났으므로 메인 페이지로 이동
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