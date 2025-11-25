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
 * POST /v1/qr/scan?storeId=1&userId=1&stampCount=2
 */
export const requestStampEarn = async (
  storeId: number,
  userId: string | number, // QR에서 읽은 유저 ID (예: "1")
  stampCount: number
): Promise<ScanResponse> => {
  try {
    console.log(
      `[API] 적립 요청: storeId=${storeId}, userId=${userId}, count=${stampCount}`
    );

    const response = await axios.post<ScanResponse>(
      `${BASE_URL}/v1/qr/scan`,
      {}, // POST body는 비움
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