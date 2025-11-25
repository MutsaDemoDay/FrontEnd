import axios from 'axios';

export interface ScanResponse {
  timestamp: string;
  code: number;
  message: string;
  data: string;
}

const BASE_URL = import.meta.env.VITE_API_URI;

/**
 * [Owner] 스탬프 적립 요청
 * QR에서 읽은 loginId를 userId 필드에 담아 Body로 보냅니다.
 * POST /v1/qr/scan
 * Body: { "storeId": 1, "userId": "user_login_id" }
 */
export const scanQrCode = async (
  storeId: string | number,
  scannedLoginId: string
): Promise<ScanResponse> => {
  try {
    console.log(
      `스탬프 적립 요청: storeId=${storeId}, userId(from QR)=${scannedLoginId}`
    );

    const requestBody = {
      storeId: Number(storeId), // 숫자로 변환
      userId: scannedLoginId, // QR에서 읽은 로그인 아이디
    };

    const response = await axios.post<ScanResponse>(
      `${BASE_URL}/v1/qr/scan`,
      requestBody
    );

    return response.data;
  } catch (error) {
    console.error('스탬프 적립 요청 실패:', error);
    throw error;
  }
};
