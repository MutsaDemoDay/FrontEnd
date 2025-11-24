import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { OwnerBottomBar } from '../../components/OwnerBottomBar';
// [수정 1] fetchTotals 추가 import
import { fetchStats, fetchStoreName, fetchTotals } from '../../api/Stats';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const { data: storeName } = useQuery({
    queryKey: ['storeName'],
    queryFn: fetchStoreName,
  });

  const { data: todayStats } = useQuery({
    queryKey: ['stats', storeName, 'daily'],
    queryFn: () => fetchStats(storeName!, 'daily'),
    enabled: !!storeName,
  });

  const { data: currentStats } = useQuery({
    queryKey: ['dashboard-stats', storeName, activeTab],
    queryFn: () => {
      if (!storeName) return Promise.reject('No store name');

      if (activeTab === 'daily') {
        return fetchStats(storeName, 'daily');
      }
      
      return fetchTotals(storeName, activeTab);
    },
    enabled: !!storeName,
  });

  // 데이터 접근 로직 (응답 구조가 동일하므로 그대로 사용 가능)
  const todayCount = todayStats?.data?.totalOrAvgCount ?? 0;
  
  const currentCount = currentStats?.data?.totalOrAvgCount ?? 0;
  const currentDateText = currentStats?.data?.periodText ?? '';
  
  // 일간일 땐 '총', 주간/월간일 땐 fetchTotals를 썼으므로 역시 '총'이 맞음
  const labelText = '총'; 

  return (
    <div className="flex flex-col w-full px-6 py-4 min-h-screen">
      
      <h1 className="text-[25px] text-(--fill-color6) font-normal">
        Dashboard
      </h1>
      <p className="mt-10 text-[18px] text-(--main-color) font-semibold">
        오늘의 요약 카드
      </p>

      <div className="flex flex-col w-full gap-3">
        {/* 상단 2개 카드 영역 */}
        <div className="flex flex-row w-full justify-between mt-5 gap-3">
          
          {/* 1. 오늘 적립 카드 */}
          <div className="w-1/2 h-[140px] bg-(--fill-color1) text-(--fill-color7) rounded-[20px] p-4 flex flex-col justify-between shadow-sm">
            <p className="font-semibold text-[14px] text-gray-800">오늘 적립</p>
            <div className="flex flex-row self-end items-center text-center">
              <p className="text-[34px] font-semibold text-(--fill-color7)">{todayCount}</p>
              <p className="text-[14px] font-medium mx-1 text-[#5B5B5B]">건</p>
            </div>
          </div>

          {/* 2. 오늘 교환된 리워드 (Mock Data) */}
          <div className="w-1/2 h-[140px] bg-(--fill-color1) text-(--fill-color7) rounded-[20px] p-4 flex flex-col justify-between shadow-sm">
            <p className="font-semibold text-[14px] text-gray-800">오늘 교환된 리워드</p>
            <div className="flex flex-row self-end items-center text-center">
              <p className="text-[34px] font-semibold text-(--fill-color7)">5</p>
              <p className="text-[14px] font-medium mx-1 text-[#5B5B5B]">건</p>
            </div>
          </div>
        </div>

        {/* 3. 하단 적립 통계 카드 */}
        <div className="w-full h-[170px] flex flex-col p-5 bg-(--fill-color1) rounded-[24px] shadow-sm relative">
          
          {/* 카드 헤더: 제목 + 탭 버튼 */}
          <div className="flex flex-row justify-between items-start">
            <p className="text-[16px] text-(--fill-color7) font-bold">
              적립 통계
            </p>
            
            {/* 탭 버튼 그룹 */}
            <div className="flex flex-row gap-1 bg-white p-1 rounded-full shadow-sm">
              {(['daily', 'weekly', 'monthly'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-3 py-1 text-[12px] rounded-full transition-all overflow-auto
                    ${activeTab === tab 
                      ? 'border border-gray-400 font-semibold text-gray-800' 
                      : 'text-(--fill-color7) hover:text-gray-600'}
                  `}
                >
                  {tab === 'daily' ? '일간' : tab === 'weekly' ? '주간' : '월간'}
                </button>
              ))}
            </div>
          </div>

          {/* 통계 수치 표시 영역 */}
          <div className="mt-4">
            <p className="text-[12px] text-(--fill-color7) mb-1">{labelText}</p>
            <div className="flex flex-row items-baseline gap-1">
              <p className="text-[36px] font-bold text-(--fill-color7) leading-none">
                {currentCount}
              </p>
              <p className="text-[16px] font-medium text-[#5B5B5B]">건</p>
            </div>
            {/* 날짜 표시 */}
            <p className="text-[12px] text-(--fill-color5) mt-1">
              {currentDateText || '-'}
            </p>
          </div>

          {/* 그래프 보러가기 버튼 */}
          <div 
            className="absolute bottom-5 right-5 mb-10 flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/owner/statistics')} 
          >
            <span className="text-[12px] font-medium text-[#5B5B5B] ">그래프 보러가기</span>
            <div className="w-8 h-8 rounded-full bg-(--fill-color1) border border-gray-100 shadow-sm flex items-center justify-center">
              <svg 
                width="6" 
                height="10" 
                viewBox="0 0 6 10" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M1 9L5 5L1 1" 
                  stroke="#4B5563" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

        </div>
      </div>
      <OwnerBottomBar />
    </div>
  );
};