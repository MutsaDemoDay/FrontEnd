import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BackButton3 } from '../../components/BackButton3';
// [중요] fetchTotals 제거, fetchStats만 사용
import {
  fetchStats,
  fetchStoreName,
  type StatsResponse,
} from '../../api/Stats';

// --- UI 타입 정의 ---
type Tab = 'daily' | 'weekly' | 'monthly';

interface BarItem {
  label: string;
  value: number;
}

interface ChartData {
  titleLabel: string;
  totalLabel: string;
  subLabel: string;
  bars: BarItem[];
  highlightIndex: number;
  highlightValue: number;
}

// --- BarChart 컴포넌트 (UI는 그대로 유지) ---
const BarChart: React.FC<{ data: ChartData }> = ({ data }) => {
  const maxValue =
    data.bars.length > 0 ? Math.max(...data.bars.map((b) => b.value), 1) : 1;
  const isDense = data.bars.length > 10;

  const shouldShowLabel = (index: number, label: string) => {
    if (!isDense) return true;
    if (label.includes('일')) {
      const day = parseInt(label.replace('일', ''), 10);
      return day === 1 || day % 7 === 0;
    }
    if (label.includes('시')) {
      const hour = parseInt(label.replace(/[^0-9]/g, ''), 10);
      return hour % 6 === 0;
    }
    return index % 5 === 0;
  };

  return (
    <div className="w-full rounded-[24px] bg-(--fill-color1) px-6 py-5 shadow-sm">
      <div className="mb-6">
        <div className="text-xs text-gray-500">{data.titleLabel}</div>
        <div className="mt-1 text-3xl font-semibold text-gray-900">
          {data.totalLabel}
        </div>
        <div className="mt-1 text-[11px] text-gray-400">{data.subLabel}</div>
      </div>

      <div className="mb-2 h-[220px] rounded-2xl bg-(--fill-color1) py-4">
        <div className="flex h-full w-full items-end justify-between">
          {data.bars.map((bar, index) => {
            const ratio = bar.value / maxValue;
            const height = 20 + ratio * 130;
            const isHighlight = index === data.highlightIndex;
            const showLabel = shouldShowLabel(index, bar.label);

            return (
              <div
                key={`${bar.label}-${index}`}
                className="flex flex-1 flex-col items-center justify-end"
              >
                <div className="relative mb-2 w-full flex justify-center">
                  {isHighlight && (
                    <div className="absolute bottom-0 z-30 whitespace-nowrap rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-gray-800 shadow-sm ring-1 ring-black/5">
                      {data.highlightValue}건
                    </div>
                  )}
                </div>
                <div className="flex h-[160px] w-full flex-col items-center justify-end relative">
                  {isHighlight && (
                    <div className="absolute bottom-0 top-0 w-px bg-gray-200" />
                  )}
                  <div
                    className={`relative z-10 rounded-t-full transition-all duration-500 w-[70%] max-w-[16px] ${
                      isHighlight
                        ? 'bg-gradient-to-t from-[#FF8A3C] to-[#FFC37F]'
                        : 'bg-gradient-to-t from-[#FFD0A3] to-[#FFE7C9]'
                    }`}
                    style={{ height: `${height}px` }}
                  />
                </div>
                <div className="mt-2 h-4 w-full flex items-center justify-center">
                  <span
                    className={`text-[10px] text-gray-500 whitespace-nowrap overflow-visible ${
                      showLabel ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      position: isDense ? 'absolute' : 'static',
                      transform: isDense ? 'translateY(10px)' : 'none',
                    }}
                  >
                    {bar.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- 데이터 없음 UI ---
const NoMemberStats: React.FC = () => (
  <div className="mx-auto flex w-full flex-col bg-[#F7F7F7] px-4 pb-8 pt-6 h-[300px] items-center justify-center">
    <div className="text-gray-400 text-sm">데이터가 없습니다.</div>
  </div>
);

// --- 메인 페이지 컴포넌트 ---
const MemberStats: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('daily');

  const { data: storeName } = useQuery({
    queryKey: ['storeName'],
    queryFn: fetchStoreName,
  });

  // 1. React Query: fetchStats만 사용 ('totals' 관련 로직 완전 제거)
  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useQuery<StatsResponse>({
    // 탭이 바뀔 때마다 쿼리 키가 바뀌면서 데이터를 새로 가져옴
    queryKey: ['stats', storeName, activeTab],
    queryFn: () => fetchStats(storeName!, activeTab),
    enabled: !!storeName,
  });

  // 2. 데이터 변환 (API Response -> ChartData)
  const chartData: ChartData | null = useMemo(() => {
    // 유효성 검사
    if (!apiResponse || apiResponse.code !== 100 || !apiResponse.data)
      return null;

    const { data } = apiResponse;

    // API의 chartData를 BarItem 형식으로 매핑
    const bars: BarItem[] = data.chartData.map((item) => ({
      label: item.label,
      value: item.count,
    }));

    // 최댓값(Highlight) 찾기
    let maxIndex = 0;
    let maxValue = -1;

    // 데이터가 하나도 없을 경우 처리
    if (bars.length === 0) {
      return null;
    }

    bars.forEach((bar, idx) => {
      if (bar.value > maxValue) {
        maxValue = bar.value;
        maxIndex = idx;
      }
    });

    // 적립 통계는 '합계'를 보여주는 것이 일반적이므로 '총'으로 통일
    // (만약 기획상 주간/월간이 '평균'이어야 한다면 분기 처리 필요)
    const titleLabel = activeTab === 'daily' ? '총' : '평균';

    return {
      titleLabel,
      totalLabel: `${data.totalOrAvgCount}건`, // API가 계산해준 총합/평균값 사용
      subLabel: data.periodText, // API가 주는 기간 텍스트 사용
      bars,
      highlightIndex: maxIndex,
      highlightValue: maxValue,
    };
  }, [apiResponse]); // activeTab은 apiResponse에 이미 반영되므로 의존성 제거해도 됨

  // 3. 하단 설명 텍스트 동적 생성
  const description = useMemo(() => {
    if (!chartData || chartData.highlightValue === 0) {
      return '적립 내역이 존재하지 않습니다.';
    }

    const maxLabel = chartData.bars[chartData.highlightIndex].label;

    if (activeTab === 'daily') {
      // 예: "14시" -> "오늘 14시에..."
      return `오늘 ${maxLabel}에 가장 많은 적립이 발생했습니다.`;
    } else if (activeTab === 'weekly') {
      // 예: "월" -> "이번 주 월요일에..." (API 라벨이 '월요일' 전체가 아니라면 '요일' 붙임)
      const dayLabel = maxLabel.endsWith('요일') ? maxLabel : `${maxLabel}요일`;
      return `이번 주 ${dayLabel}에 적립이 가장 활발했습니다.`;
    } else {
      // 예: "15일" -> "이번 달 15일에..."
      return `이번 달 ${maxLabel}에 가장 많은 적립이 있었습니다.`;
    }
  }, [chartData, activeTab]);

  // --- 렌더링 ---

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full flex-col px-4 pb-8 pt-6 h-screen items-center justify-center">
        <p className="text-gray-500 text-sm">통계를 불러오는 중...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto flex w-full flex-col px-4 pb-8 pt-6 h-screen items-center justify-center">
        <p className="text-gray-500 text-sm">
          데이터를 불러오는데 실패했습니다.
        </p>
        <BackButton3 />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full flex-col px-4 pb-8 pt-6 ">
      <BackButton3 />
      <h1 className="text-[25px] text-(--fill-color6) font-semibold px-6 mt-2 mb-4">
        적립 통계
      </h1>

      {/* 탭 버튼 */}
      <div className="mb-4 flex rounded-full bg-(--fill-color1) p-1 text-xs">
        {(['daily', 'weekly', 'monthly'] as const).map((tab) => (
          <button
            key={tab}
            className={`flex-1 rounded-full p-2 text-center transition-all ${
              activeTab === tab
                ? 'bg-white font-semibold text-gray-900 shadow'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'daily' ? '일간' : tab === 'weekly' ? '주간' : '월간'}
          </button>
        ))}
      </div>

      {/* 차트 영역 */}
      {chartData ? (
        <>
          <BarChart data={chartData} />

          {/* 하단 설명 카드 */}
          <div className="mt-4 rounded-[24px] bg-(--fill-color1) px-6 py-5 shadow-sm">
            <div className="mb-2 text-xs font-semibold text-[#FF7A2E]">
              {activeTab === 'daily' ? '오늘의 리포트' : '기간별 분석'}
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
        </>
      ) : (
        <NoMemberStats />
      )}
    </div>
  );
};

export default MemberStats;
