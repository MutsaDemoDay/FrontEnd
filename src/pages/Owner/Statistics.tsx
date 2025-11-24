import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BackButton3 } from '../../components/BackButton3';
import { fetchStats, fetchStoreName, type StatsResponse } from '../../api/Stats'; // 위에서 만든 파일 import

// --- 기존 UI 타입 정의 ---
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

// --- BarChart 컴포넌트 (이전 코드와 동일, 생략 없이 사용하세요) ---
const BarChart: React.FC<{ data: ChartData }> = ({ data }) => {
  const maxValue =
    data.bars.length > 0 ? Math.max(...data.bars.map((b) => b.value), 1) : 1;
  const isDense = data.bars.length > 10;

  const shouldShowLabel = (index: number, label: string) => {
    if (!isDense) return true;
    if (label.includes('일')) {
      const day = parseInt(label.replace('일', ''), 10);
      return day === 1 || day % 7 === 0; // 1일, 7일, 14일...
    }
    if (label.includes('시')) {
      const hour = parseInt(label.replace(/[^0-9]/g, ''), 10);
      return hour % 6 === 0; // 0시, 6시...
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

  // 1. React Query로 데이터 Fetch
  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useQuery<StatsResponse>({
    queryKey: ['stats', storeName, activeTab],
    queryFn: () => fetchStats(storeName!, activeTab),
    enabled: !!storeName,
  });

  // 2. 데이터 변환 (API Response -> ChartData)
  const chartData: ChartData | null = useMemo(() => {
    if (!apiResponse || apiResponse.code !== 100 || !apiResponse.data) return null;

    const { data } = apiResponse;
    const bars: BarItem[] = data.chartData.map((item) => ({
      label: item.label, // API에서 "0시", "월" 등으로 오므로 그대로 사용
      value: item.count,
    }));

    // 최댓값(Highlight) 찾기
    let maxIndex = 0;
    let maxValue = -1;
    bars.forEach((bar, idx) => {
      if (bar.value > maxValue) {
        maxValue = bar.value;
        maxIndex = idx;
      }
    });

    // 탭별 제목 설정 (일간은 '총', 나머지는 '평균' - 기획에 따라 변경 가능)
    const titleLabel = activeTab === 'daily' ? '총' : '평균'; 

    return {
      titleLabel,
      totalLabel: `${data.totalOrAvgCount}건`,
      subLabel: data.periodText,
      bars,
      highlightIndex: maxIndex,
      highlightValue: maxValue,
    };
  }, [apiResponse, activeTab]);

  // 3. 하단 설명 텍스트 동적 생성
  const description = useMemo(() => {
    if (!chartData || chartData.highlightValue === 0) {
      return '적립 내역이 존재하지 않습니다.';
    }

    const maxLabel = chartData.bars[chartData.highlightIndex].label;

    if (activeTab === 'daily') {
      return `오늘 ${maxLabel}에 가장 많은 적립이 발생했습니다.`;
    } else if (activeTab === 'weekly') {
      return `이번 주 ${maxLabel}요일에 적립이 가장 활발했습니다.`;
    } else {
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
        <p className="text-gray-500 text-sm">데이터를 불러오는데 실패했습니다.</p>
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