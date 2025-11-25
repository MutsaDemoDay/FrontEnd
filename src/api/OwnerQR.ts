// src/api/OwnerQR.ts
import axios from 'axios';

// 백엔드 응답 데이터 타입 정의
export interface ScanResponse {
  timestamp: string;
  code: number;
  message: string;
  data: string;
}

// .env 파일에서 API 주소 가져오기
const BASE_URL = import.meta.env.VITE_API_URI;

/**
 * QR 코드 스캔 후 스탬프 적립 요청
 * POST /v1/qr/scan?storeId={storeId}&userId={userId}
 * @param storeId 가게 고유 ID
 * @param userId QR코드에서 인식된 사용자 ID
 */
export const scanQrCode = async (storeId: string | number, userId: string): Promise<ScanResponse> => {
  try {
    console.log(
      `Requesting (POST) to: ${BASE_URL}/v1/qr/scan?storeId=${storeId}&userId=${userId}`
    );

    // ✅ 요청: POST 메서드 사용, 쿼리 파라미터로 전달
    const response = await axios.post<ScanResponse>(
      `${BASE_URL}/v1/qr/scan?storeId=${storeId}&userId=${userId}`
    );
    return response.data;
  } catch (error) {
    console.error('스탬프 적립 요청 실패:', error);
    throw error;
  }
};