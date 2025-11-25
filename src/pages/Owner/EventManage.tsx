import React, { useState, useEffect } from 'react';
import { OwnerBottomBar } from '../../components/OwnerBottomBar';
import plus_icon from '../../assets/plus_icon.png';
import history_icon from '../../assets/history_icon.png';
import goto_icon from '../../assets/goto_icon.png';
import { useNavigate } from 'react-router-dom';

// 하위 객체 타입 (상점 정보)
interface JoinStoreList {
  storeName: string;
  storeAddress: string;
  menuNames: string[];
  storeId: number;
}

// 메인 응답 바디 타입
interface ActiveEventResponse {
  eventId: number;
  eventType: 'OPEN_EVENT' | 'SPECIAL_EVENT' | 'SNS_BONUS';
  buttonDescription: string;
  inPageDescription: string;
  startDate: string;
  endDate: string;
  joinStoreLists: JoinStoreList[];
}

export const EventManage = () => {
  const navigate = useNavigate();
  
  // [변경] 여러 이벤트를 담기 위해 배열 상태로 관리
  const [activeEvents, setActiveEvents] = useState<ActiveEventResponse[]>([]);

  const apiUri = import.meta.env.VITE_API_URI;

  useEffect(() => {
    const fetchAllEvents = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const eventTypes = ['OPEN_EVENT', 'SPECIAL_EVENT', 'SNS_BONUS'];

      try {
        const promises = eventTypes.map((type) =>
          fetch(`${apiUri}/v1/events/eventstores/ongoing/${type}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => res.json())
        );

        const results = await Promise.all(promises);

        // [변경] find 대신 모든 유효한 결과를 모아서 하나의 배열로 만듦 (flatMap 사용)
        const allFetchedEvents = results.flatMap((json) => {
          if (json.code === 100 && json.data) {
            // data가 배열이면 그대로 반환, 객체면 배열로 감싸서 반환
            return Array.isArray(json.data) ? json.data : [json.data];
          }
          return []; // 유효하지 않은 데이터는 빈 배열 반환 (flatMap이 제거해줌)
        });

        setActiveEvents(allFetchedEvents);

      } catch (error) {
        console.error('이벤트 목록을 불러오는데 실패했습니다:', error);
      }
    };

    fetchAllEvents();
  }, []);

  // 뱃지 텍스트 변환
  const getEventBadgeText = (type: string) => {
    switch (type) {
      case 'OPEN_EVENT':
        return 'OPEN EVENT';
      case 'SPECIAL_EVENT':
        return 'SPECIAL EVENT';
      case 'SNS_BONUS': // API 응답값에 맞춤 (SNS_BONUS)
      case 'SNS BONUS':
        return 'SNS BONUS';
      default:
        return '이벤트';
    }
  };

  return (
    <div className="flex flex-col w-full px-6 py-4 min-h-screen bg-white">
      <h1 className="text-[25px] text-(--fill-color6) font-normal mb-[110px] mt-4">
        Event
      </h1>

      <div className="w-full justify-center items-center flex flex-col gap-5">
        {/* 진행중인 이벤트 카드 */}
        {/* [변경] 높이를 유동적으로 변경 (h-[156px] -> min-h-[156px] h-auto) */}
        <div className="w-[340px] min-h-[156px] h-auto bg-(--fill-color1) rounded-[20px] p-2 flex flex-col shadow-sm">
          <div className="flex flex-row w-full p-2 mx-2 justify-between items-center mb-2">
            <p className="text-[14px] text-black font-medium">
              진행중인 이벤트
            </p>
            <img
              src={plus_icon}
              alt="이벤트 추가"
              className="w-[11.2px] h-[11.2px] mr-5 cursor-pointer hover:opacity-70"
              onClick={() => navigate('/owner/eventcreate')}
            />
          </div>

          <div className="flex-1 flex flex-col justify-center px-4 pb-4 gap-3 cursor-pointer"  onClick={() => navigate('/stamp/event')}>
            {activeEvents.length > 0 ? (
              // [변경] 배열을 순회하며 렌더링
              activeEvents.map((event, index) => (
                <div 
                  key={`${event.eventId}-${index}`} // 고유 key 설정
                  className='flex flex-col justify-center w-full h-10 bg-white rounded-[20px] px-4 shadow-sm'
                >
                  <h3 className="text-[12px] font-medium text-(--fill-color7) truncate">
                    {getEventBadgeText(event.eventType)} -{' '}
                    {event.buttonDescription}
                  </h3>
                  
                </div>
              ))
            ) : (
              <div className="text-center text-[13px] text-gray-400 py-4">
                현재 진행중인 이벤트가 없습니다.
                <br />
                우측 상단 버튼을 눌러 생성해주세요.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-[70px] justify-center items-center flex flex-row mt-5">
        <div
          className="w-[340px] h-full bg-(--fill-color1) rounded-[20px] flex flex-row items-center cursor-pointer shadow-sm hover:bg-gray-100 transition-colors"
          onClick={() => navigate('/owner/pastevent')}
        >
          <img src={history_icon} alt="" className="w-[28px] h-[28px] ml-5" />
          <p className="ml-4 text-[14px] text-black font-medium">지난 이벤트</p>
          <div className="flex-grow" />
          <img src={goto_icon} alt="" className="w-[40px] h-[40px] mr-5" />
        </div>
      </div>

      <OwnerBottomBar />
    </div>
  );
};