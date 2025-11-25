import axios from 'axios';

export interface ScanResponse {
  timestamp: string;
  code: number;
  message: string;
  data: string;
}

const BASE_URL = import.meta.env.VITE_API_URI;

/**
 * [Owner] 최종 스탬프 적립 요청
 * POST /v1/qr/scan
 * 파라미터: storeId, userId, stampCount
 */
export const requestStampEarn = async (
  storeId: number,
  userId: string, // QR에서 읽은 유저 ID (Login ID)
  stampCount: number
): Promise<ScanResponse> => {
  try {
    console.log(
      `[API] 적립 요청: storeId=${storeId}, userId=${userId}, count=${stampCount}`
    );

    // 쿼리 파라미터 방식으로 전송 (명세에 따름)
    const response = await axios.post<ScanResponse>(
      `${BASE_URL}/v1/qr/scan`,
      {}, // POST body가 없다면 빈 객체
      {
        params: {
          storeId,
          userId,
          stampCount,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('스탬프 적립 요청 실패:', error);
    throw error;
  }
};