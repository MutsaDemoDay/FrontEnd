import axios from 'axios';

// 1. API 응답 데이터 타입 정의
export interface ChartItemDto {
  label: string;
  count: number;
}

export interface StatsDataDto {
  type: 'daily' | 'weekly' | 'monthly';
  totalOrAvgCount: number;
  periodText: string;
  chartData: ChartItemDto[];
}

export interface StatsResponse {
  timestamp: string;
  code: number;
  message: string;
  data: StatsDataDto;
}

// 2. API 호출 함수
// 스탬프 적립 통계
export const fetchStats = async (
  storeName: string,
  type: 'daily' | 'weekly' | 'monthly'
) => {
  const apiUri = import.meta.env.VITE_API_URI;

  const { data } = await axios.get<StatsResponse>(
    `${apiUri}/v1/stamps/manager/statics`,
    {
      params: {
        storeName: storeName,
        type: type,
      },
    }
  );

  return data;
};

// 스탬프 등록 고객 통계
export const fetchTotals = async (
  storeName: string,
  type: 'weekly' | 'monthly'
) => {
  const apiUri = import.meta.env.VITE_API_URI;

  const { data } = await axios.get<StatsResponse>(
    `${apiUri}/v1/stamps/manager/totals`,
    {
      params: {
        storeName: storeName,
        type: type,
      },
    }
  );
  
  return data;
};

export const fetchStoreName = async (): Promise<string | null> => {
  const API_URI = import.meta.env.VITE_API_URI;
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const response = await axios.get(`${API_URI}/v1/managers/profile`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.code === 100 && response.data.data?.store) {
      return response.data.data.store.storeName;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching store name:', error);
    return null;
  }
};
