import axios from 'axios';

export interface QrResponse {
  timestamp: string;
  code: number;
  message: string;
  data: string; // "data:image/png;base64,..."
}

const BASE_URL = import.meta.env.VITE_API_URI;

// email을 파라미터로 받아 QR 생성 요청
export const fetchUserQr = async (email: string): Promise<QrResponse> => {
  try {
    console.log(`QR 요청 (GET): ${BASE_URL}/v1/qr/generate?email=${email}`);

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
