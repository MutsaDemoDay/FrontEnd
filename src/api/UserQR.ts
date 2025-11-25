import axios from 'axios';

export interface QrResponse {
  timestamp: string;
  code: number;
  message: string;
  data: string; // Base64 이미지
}

const BASE_URL = import.meta.env.VITE_API_URI;

export const fetchUserQr = async (email: string): Promise<QrResponse> => {
  try {
    // GET 요청은 params 객체를 사용하거나 URL에 직접 붙입니다.
    const response = await axios.get<QrResponse>(
      `${BASE_URL}/v1/qr/generate`,
      {
        params: { email: email } 
      }
    );
    return response.data;
  } catch (error) {
    console.error('QR 생성 실패:', error);
    throw error;
  }
};