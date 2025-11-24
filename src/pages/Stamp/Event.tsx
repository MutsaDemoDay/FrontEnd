/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
// @ts-ignore
import 'swiper/css';
// @ts-expect-error
import 'swiper/css/pagination';

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
    case 'OPEN_EVENT': return 'OPEN EVENT';
    case 'SPECIAL_EVENT': return 'SPECIAL EVENT';
    case 'SNS_BONUS': return 'SNS BONUS';
    default: return 'EVENT';
  }
};

export const Event = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  // --- API 호출 로직 (이전과 동일) ---
  useEffect(() => {
    const fetchAllEvents = async () => {
      const apiUri = import.meta.env.VITE_API_URI;
      const token = localStorage.getItem('accessToken');
      const eventTypes = ['OPEN_EVENT', 'SPECIAL_EVENT', 'SNS_BONUS'];

      try {
        const promises = eventTypes.map((type) =>
          fetch(`${apiUri}/v1/events/eventstores/ongoing/${type}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token || ''}`,
            },
          }).then((res) => res.json())
        );

        const results = await Promise.all(promises);

        const allFetchedEvents = results.flatMap((json) => {
          if (json.code === 100 && json.data) {
            return Array.isArray(json.data) ? json.data : [json.data];
          }
          return [];
        });

        setEvents(allFetchedEvents);
      } catch (error) {
        console.error('이벤트 목록 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, []);

  // 설명 텍스트 파싱
  const renderDescription = (text: string) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <span key={j} className="font-bold text-black">{part.slice(2, -2)}</span>;
          }
          return part;
        })}
        <br />
      </React.Fragment>
    ));
  };

  return (
    // 전체 페이지 컨테이너: 헤더 + 바디(Swiper) + 하단바 구조
    <div className="w-full h-screen bg-white flex flex-col mx-auto relative shadow-lg overflow-hidden">
      
      {/* 1. 상단 고정 헤더 */}
      <header className="w-full px-5 pt-6 pb-4 bg-white z-20 shrink-0">
        <div className="mb-4">
          <BackButton />
        </div>
        <h1 className="text-[26px] font-bold text-[#333]">Event</h1>
      </header>

      {/* 2. 메인 콘텐츠 (Swiper 영역) */}
      <div className="flex-1 w-full min-h-0 relative">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            이벤트 정보를 불러오는 중입니다...
          </div>
        ) : events.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            현재 진행중인 이벤트가 없습니다.
          </div>
        ) : (
          <>
            <Swiper
              className="w-full h-full"
              modules={[Pagination]}
              slidesPerView={1}
              // 온보딩 페이지와 동일한 페이지네이션 설정
              pagination={{
                el: '.swiper-pagination-custom',
                clickable: true,
                bulletClass: 'swiper-pagination-bullet custom-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active custom-bullet-active',
              }}
            >
              {events.map((eventData, eventIndex) => (
                <SwiperSlide key={`${eventData.eventId}-${eventIndex}`} className="w-full h-full">
                  {/* 슬라이드 내부 컨테이너: 
                    - 배경색: 오렌지 (#FFAB76)
                    - overflow-y-auto: 내용이 길면 내부에서 스크롤됨 
                  */}
                  <div className="w-full h-full bg-[#FFAB76] overflow-y-auto pt-6 pb-24 flex flex-col items-center custom-scrollbar">
                    
                    {/* 흰색 둥근 아치형 카드 */}
                    <div
                      className="bg-white px-5 pt-16 pb-12 flex flex-col items-center shadow-sm w-[332px]"
                      style={{
                        borderTopLeftRadius: '166px',
                        borderTopRightRadius: '166px',
                        minHeight: '80%', // 내용이 적어도 어느 정도 높이 유지
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
                        {eventData.joinStoreLists.map((store, index) => {
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
                              <div className={`flex flex-col justify-center flex-1 ${index % 2 !== 0 ? 'items-end text-right' : 'items-start text-left'}`}>
                                <h3 className="font-bold text-[14px] text-[#FF6B00] mb-1">{store.storeName}</h3>
                                <p className="text-gray-400 text-[10px] mb-2 font-light">{store.storeAddress}</p>
                                <div className={`flex flex-col ${index % 2 !== 0 ? 'items-end' : 'items-start'}`}>
                                  <span className="text-[#FF6B00] text-[10px] font-bold mb-0.5">대표메뉴</span>
                                  <p className="text-gray-500 text-[10px] font-light">{store.menuNames.join(', ')}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* 페이지네이션 (점) 위치 설정 - 온보딩 스타일 참고 */}
            <div className="swiper-pagination-custom absolute !bottom-[80px] left-0 right-0 z-10 flex justify-center gap-2 pointer-events-none" />
          </>
        )}
      </div>

      {/* 페이지네이션 커스텀 스타일 (JSX 내부에 style 태그로 추가하거나 CSS 파일에 추가) */}
      <style>{`
        .custom-bullet {
          width: 8px;
          height: 8px;
          background-color: #ddd; /* 비활성 색상 */
          border-radius: 50%;
          display: inline-block;
          margin: 0 4px;
          opacity: 1;
          transition: all 0.3s;
        }
        .custom-bullet-active {
          background-color: #FF6B00; /* 활성 색상 (주황색) */
          width: 20px; /* 활성시 길어지게 하거나 크기 변경 */
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};