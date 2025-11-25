import axios from 'axios';

// 백엔드 응답 데이터 타입 정의
export interface QrResponse {
  timestamp: string;
  code: number;
  message: string;
  data: string;
}

const BASE_URL = import.meta.env.VITE_API_URI;

// API 호출 함수
export const fetchUserQr = async (email: string): Promise<QrResponse> => {
  try {
    console.log(
      `Requesting (GET) to: ${BASE_URL}/v1/qr/generate?email=${email}`
    );

    const response = await axios.get<QrResponse>(`${BASE_URL}/v1/qr/generate`, {
      params: {
        email: email,
      },
    });
    return response.data;
  } catch (error) {
    console.error('QR 코드 불러오기 실패:', error);
    throw error;
  }
};
