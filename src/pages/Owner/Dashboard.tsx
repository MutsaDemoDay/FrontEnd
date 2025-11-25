import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { OwnerBottomBar } from '../../components/OwnerBottomBar';
// [API] fetchTotals 추가
import { fetchStats, fetchStoreName, fetchTotals } from '../../api/Stats';
import goto_icon from '../../assets/goto_icon.png';

export const Dashboard = () => {
  const navigate = useNavigate();

  // 1. 적립 통계 탭 (daily | weekly | monthly)
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // 2. 등록 고객 수 통계 탭 (weekly | monthly) - 일간 제외
  const [customerActiveTab, setCustomerActiveTab] = useState<'weekly' | 'monthly'>('weekly');

  // 1. 가게 이름 조회
  const { data: storeName } = useQuery({
    queryKey: ['storeName'],
    queryFn: fetchStoreName,
  });

  // 2. [오늘의 요약] 오늘 적립 통계 (항상 daily)
  const { data: todayStats } = useQuery({
    queryKey: ['stats', storeName, 'daily-fixed'],
    queryFn: () => fetchStats(storeName!, 'daily'),
    enabled: !!storeName,
  });

  // 3. [적립 통계] 선택된 탭 데이터
  const { data: currentStats } = useQuery({
    queryKey: ['dashboard-stats', storeName, activeTab],
    queryFn: () => {
      if (!storeName) return Promise.reject('No store name');
      return fetchStats(storeName, activeTab);
    },
    enabled: !!storeName,
  });

  // 4. [등록 고객 수 통계] 선택된 탭 데이터 (API 연동 완료)
  const { data: customerStats } = useQuery({
    queryKey: ['dashboard-customers', storeName, customerActiveTab],
    queryFn: () => {
      if (!storeName) return Promise.reject('No store name');
      // 새로 만든 fetchTotals API 호출
      return fetchTotals(storeName, customerActiveTab);
    },
    enabled: !!storeName,
  });

  // [Variable] 데이터 가공
  const todayCount = todayStats?.data?.totalOrAvgCount ?? 0;

  // 적립 통계 데이터
  const currentCount = currentStats?.data?.totalOrAvgCount ?? 0;
  const currentDateText = currentStats?.data?.periodText ?? '';

  // 등록 고객 통계 데이터 (Response 구조: data -> data -> totalOrAvgCount)
  const customerCount = customerStats?.data?.totalOrAvgCount ?? 0;
  const customerDateText = customerStats?.data?.periodText ?? '';

  const labelText = '총';

  return (
    <div className="flex flex-col w-full px-6 py-4 min-h-screen pb-[80px]">
      <h1 className="text-[25px] text-(--fill-color6) font-normal">
        Dashboard
      </h1>
      <p className="mt-10 text-[18px] text-(--main-color) font-semibold">
        오늘의 요약 카드
      </p>

      <div className="flex flex-col w-full gap-3">
        {/* --- [Section 1] 상단 요약 카드들 --- */}
        <div className="flex flex-row w-full justify-between mt-5 gap-3">
          {/* 오늘 적립 카드 */}
          <div className="w-1/2 h-[140px] bg-(--fill-color1) text-(--fill-color7) rounded-[20px] p-4 flex flex-col justify-between shadow-sm">
            <p className="font-semibold text-[14px] text-gray-800">오늘 적립</p>
            <div className="flex flex-row self-end items-center text-center">
              <p className="text-[34px] font-semibold text-(--fill-color7)">
                {todayCount}
              </p>
              <p className="text-[14px] font-medium mx-1 text-[#5B5B5B]">건</p>
            </div>
          </div>

          {/* 오늘 교환된 리워드 */}
          <div className="w-1/2 h-[140px] bg-(--fill-color1) text-(--fill-color7) rounded-[20px] p-4 flex flex-col justify-between shadow-sm">
            <p className="font-semibold text-[14px] text-gray-800">
              오늘 교환된 리워드
            </p>
            <div className="flex flex-row self-end items-center text-center">
              <p className="text-[34px] font-semibold text-(--fill-color7)">
                5
              </p>
              <p className="text-[14px] font-medium mx-1 text-[#5B5B5B]">건</p>
            </div>
          </div>
        </div>

        {/* --- [Section 2] 적립 통계 카드 --- */}
        <div className="w-full h-[170px] flex flex-col p-5 bg-(--fill-color1) rounded-[24px] shadow-sm relative">
          <div className="flex flex-row justify-between items-start">
            <p className="text-[16px] text-(--fill-color7) font-bold">
              적립 통계
            </p>

            <div className="flex flex-row gap-1 bg-white p-1 rounded-full shadow-sm">
              {(['daily', 'weekly', 'monthly'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-3 py-1 text-[12px] rounded-full transition-all
                    ${
                      activeTab === tab
                        ? 'border border-gray-400 font-semibold text-gray-800'
                        : 'text-(--fill-color7) hover:text-gray-600'
                    }
                  `}
                >
                  {tab === 'daily'
                    ? '일간'
                    : tab === 'weekly'
                    ? '주간'
                    : '월간'}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[12px] text-(--fill-color7) mb-1">{labelText}</p>
            <div className="flex flex-row items-baseline gap-1">
              <p className="text-[36px] font-bold text-(--fill-color7) leading-none">
                {currentCount}
              </p>
              <p className="text-[16px] font-medium text-[#5B5B5B]">건</p>
            </div>
            <p className="text-[12px] text-(--fill-color5) mt-1">
              {currentDateText || '-'}
            </p>
          </div>

          <div
            className="absolute bottom-5 right-5 flex items-center gap-2 cursor-pointer mb-10"
            onClick={() => navigate('/owner/statistics')}
          >
            <span className="text-[12px] font-medium text-[#5B5B5B]">
              그래프 보러가기
            </span>
            <img src={goto_icon} alt="" className="w-10 h-10" />
          </div>
        </div>

        <p className="mt-10 text-[18px] text-(--main-color) font-semibold">
          단골 현황
        </p>
        {/* --- [Section 3] 등록 고객 수 통계 카드 --- */}
        <div className="w-full h-[170px] flex flex-col p-5 bg-(--fill-color1) rounded-[24px] shadow-sm relative">
          <div className="flex flex-row justify-between items-start">
            <p className="text-[16px] text-(--fill-color7) font-bold">
              등록 고객 수 통계
            </p>

            {/* 탭 버튼: weekly, monthly만 표시 */}
            <div className="flex flex-row gap-1 bg-white p-1 rounded-full shadow-sm">
              {(['weekly', 'monthly'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCustomerActiveTab(tab)}
                  className={`
                    px-3 py-1 text-[12px] rounded-full transition-all
                    ${
                      customerActiveTab === tab
                        ? 'border border-gray-400 font-semibold text-gray-800'
                        : 'text-(--fill-color7) hover:text-gray-600'
                    }
                  `}
                >
                  {tab === 'weekly' ? '주간' : '월간'}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[12px] text-(--fill-color7) mb-1">{labelText}</p>
            <div className="flex flex-row items-baseline gap-1">
              <p className="text-[36px] font-bold text-(--fill-color7) leading-none">
                {customerCount}
              </p>
              <p className="text-[16px] font-medium text-[#5B5B5B]">명</p>
            </div>
            <p className="text-[12px] text-(--fill-color5) mt-1">
              {customerDateText || '-'}
            </p>
          </div>

          <div
            className="absolute bottom-5 right-5 flex items-center gap-2 cursor-pointer mb-10"
            onClick={() => navigate('/owner/statistics')}
          >
            <span className="text-[12px] font-medium text-[#5B5B5B]">
              그래프 보러가기
            </span>
            <img src={goto_icon} alt="" className="w-10 h-10" />
          </div>
        </div>
      </div>

      <OwnerBottomBar />
    </div>
  );
};
