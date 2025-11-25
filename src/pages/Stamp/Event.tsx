/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // URL 파라미터 사용을 위해 추가
import BackButton from '../../components/BackButton';

// -------------------- 1. 타입 정의 --------------------
interface JoinStoreList {
  storeId: number;
  storeName: string;
  storeAddress: string;
  menuNames: string[];
}

interface EventData {
  eventId: number;
  eventType: 'OPEN_EVENT' | 'SPECIAL_EVENT' | 'SNS_BONUS';
  buttonDescription: string;
  inPageDescription: string;
  startDate: string;
  endDate: string;
  joinStoreLists: JoinStoreList[];
}

// -------------------- 2. 상수 및 헬퍼 --------------------
const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000&auto=format&fit=crop',
];

const getEventTitle = (type: string) => {
  switch (type) {
    case 'OPEN_EVENT':
      return 'OPEN EVENT';
    case 'SPECIAL_EVENT':
      return 'SPECIAL EVENT';
    case 'SNS_BONUS':
      return 'SNS BONUS';
    default:
      return 'EVENT';
  }
};

export const Event = () => {
  const { eventType } = useParams<{ eventType: string }>(); // URL에서 이벤트 타입 추출
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  // --- API 호출 로직 ---
  useEffect(() => {
    const fetchEvent = async () => {
      // eventType이 없으면 로직 수행 안 함
      if (!eventType) {
        setLoading(false);
        return;
      }

      const apiUri = import.meta.env.VITE_API_URI;
      const token = localStorage.getItem('accessToken');

      try {
        // 특정 타입(eventType) 하나만 호출
        const response = await fetch(
          `${apiUri}/v1/events/eventstores/ongoing/${eventType}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token || ''}`,
            },
          }
        );

        const json = await response.json();

        if (json.code === 100 && json.data) {
          // 데이터가 배열로 오더라도 단일 페이지이므로 첫 번째 요소만 사용하거나,
          // 객체로 온다면 그대로 사용
          const data = Array.isArray(json.data) ? json.data[0] : json.data;
          setEventData(data);
        } else {
          setEventData(null);
        }
      } catch (error) {
        console.error('이벤트 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventType]);

  // 설명 텍스트 파싱
  const renderDescription = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <span key={j} className="font-bold text-black">
                {part.slice(2, -2)}
              </span>
            );
          }
          return part;
        })}
        <br />
      </React.Fragment>
    ));
  };

  return (
    // 전체 페이지 컨테이너
    <div className="w-full h-screen bg-white flex flex-col mx-auto relative shadow-lg overflow-hidden">
      {/* 1. 상단 고정 헤더 */}
      <header className="w-full px-5 pt-6 pb-4 bg-white z-20 shrink-0">
        <div className="mb-4">
          <BackButton />
        </div>
        <h1 className="text-[26px] font-bold text-[#333]">Event</h1>
      </header>

      {/* 2. 메인 콘텐츠 */}
      <div className="flex-1 w-full min-h-0 relative bg-[#FFAB76]">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-white">
            이벤트 정보를 불러오는 중입니다...
          </div>
        ) : !eventData ? (
          <div className="w-full h-full flex items-center justify-center text-white font-medium">
            현재 진행중인 {getEventTitle(eventType || '')}가 없습니다.
          </div>
        ) : (
          // 단일 슬라이드 형태가 아닌, 스크롤 가능한 단일 페이지 뷰
          <div className="w-full h-full overflow-y-auto pt-6 pb-24 flex flex-col items-center custom-scrollbar">
            {/* 흰색 둥근 아치형 카드 */}
            <div
              className="bg-white px-5 pt-16 pb-12 flex flex-col items-center shadow-sm w-[332px]"
              style={{
                borderTopLeftRadius: '166px',
                borderTopRightRadius: '166px',
                minHeight: '80%',
              }}
            >
              {/* 이벤트 타이틀 & 설명 */}
              <div className="text-center mb-10 w-full">
                <h2 className="text-[#FF6B00] text-2xl font-extrabold tracking-tight mb-3 mt-8">
                  {getEventTitle(eventData.eventType)}
                </h2>

                <p className="text-gray-500 text-[12px] leading-6 mb-5">
                  {renderDescription(eventData.inPageDescription)}
                </p>

                <div className="inline-flex items-center bg-[#FF6B00] text-white px-4 py-1.5 rounded-full shadow-md">
                  <span className="text-[10px] font-bold mr-2">기간</span>
                  <span className="opacity-60 text-[10px] mr-2">|</span>
                  <span className="text-[10px] font-medium">
                    {eventData.startDate} ~ {eventData.endDate}
                  </span>
                </div>
              </div>

              {/* 가게 목록 리스트 */}
              <div className="w-full flex flex-col gap-5">
                {eventData.joinStoreLists &&
                  eventData.joinStoreLists.map((store, index) => {
                    const randomImage = IMAGE_POOL[index % IMAGE_POOL.length];
                    return (
                      <div
                        key={store.storeId}
                        className={`flex w-full bg-white rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.06)] overflow-hidden p-3 gap-3 border border-gray-50 ${
                          index % 2 !== 0 ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        <div className="w-[90px] h-[90px] flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                          <img
                            src={randomImage}
                            alt={store.storeName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div
                          className={`flex flex-col justify-center flex-1 ${
                            index % 2 !== 0
                              ? 'items-end text-right'
                              : 'items-start text-left'
                          }`}
                        >
                          <h3 className="font-bold text-[14px] text-[#FF6B00] mb-1">
                            {store.storeName}
                          </h3>
                          <p className="text-gray-400 text-[10px] mb-2 font-light">
                            {store.storeAddress}
                          </p>
                          <div
                            className={`flex flex-col ${
                              index % 2 !== 0 ? 'items-end' : 'items-start'
                            }`}
                          >
                            <span className="text-[#FF6B00] text-[10px] font-bold mb-0.5">
                              대표메뉴
                            </span>
                            <p className="text-gray-500 text-[10px] font-light">
                              {store.menuNames.join(', ')}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
