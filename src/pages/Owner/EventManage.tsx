// import React, { useState, useEffect } from 'react';
// import { OwnerBottomBar } from '../../components/OwnerBottomBar';
// import plus_icon from '../../assets/plus_icon.png';
// import history_icon from '../../assets/history_icon.png';
// import goto_icon from '../../assets/goto_icon.png';
// import { useNavigate } from 'react-router-dom';

// // 하위 객체 타입 (상점 정보)
// interface JoinStoreList {
//   storeName: string;
//   storeAddress: string;
//   menuNames: string[];
//   storeId: number;
// }

// // 메인 응답 바디 타입
// interface ActiveEventResponse {
//   eventId: number;
//   eventType: 'OPEN_EVENT' | 'SPECIAL_EVENT' | 'SNS_BONUS';
//   buttonDescription: string;
//   inPageDescription: string;
//   startDate: string;
//   endDate: string;
//   joinStoreLists: JoinStoreList[];
// }

// export const EventManage = () => {
//   const navigate = useNavigate();
//   const [activeEvents, setActiveEvents] = useState<ActiveEventResponse[]>([]);
//   const apiUri = import.meta.env.VITE_API_URI;

//   useEffect(() => {
//     const fetchAllEvents = async () => {
//       const token = localStorage.getItem('accessToken');
//       if (!token) return;

//       const eventTypes = ['OPEN_EVENT', 'SPECIAL_EVENT', 'SNS_BONUS'];

//       try {
//         const promises = eventTypes.map((type) =>
//           fetch(`${apiUri}/v1/events/eventstores/ongoing/${type}`, {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${token}`,
//             },
//           }).then((res) => res.json())
//         );

//         const results = await Promise.all(promises);

//         const allFetchedEvents = results.flatMap((json) => {
//           if (json.code === 100 && json.data) {
//             return Array.isArray(json.data) ? json.data : [json.data];
//           }
//           return [];
//         });

//         setActiveEvents(allFetchedEvents);
//       } catch (error) {
//         console.error('이벤트 목록을 불러오는데 실패했습니다:', error);
//       }
//     };

//     fetchAllEvents();
//   }, []);

//   const getEventBadgeText = (type: string) => {
//     switch (type) {
//       case 'OPEN_EVENT':
//         return 'OPEN EVENT';
//       case 'SPECIAL_EVENT':
//         return 'SPECIAL EVENT';
//       case 'SNS_BONUS':
//       case 'SNS BONUS':
//         return 'SNS BONUS';
//       default:
//         return '이벤트';
//     }
//   };

//   return (
//     <div className="flex flex-col w-full px-6 py-4 min-h-screen bg-white">
//       <h1 className="text-[25px] text-(--fill-color6) font-normal mb-[110px] mt-4">
//         Event
//       </h1>

//       <div className="w-full justify-center items-center flex flex-col gap-5">
//         {/* 진행중인 이벤트 카드 */}
//         <div className="w-[340px] min-h-[156px] h-auto bg-(--fill-color1) rounded-[20px] p-2 flex flex-col shadow-sm">
//           <div className="flex flex-row w-full p-2 mx-2 justify-between items-center mb-2">
//             <p className="text-[14px] text-black font-medium">
//               진행중인 이벤트
//             </p>
//             <img
//               src={plus_icon}
//               alt="이벤트 추가"
//               className="w-[11.2px] h-[11.2px] mr-5 cursor-pointer hover:opacity-70"
//               onClick={() => navigate('/owner/eventcreate')}
//             />
//           </div>

//           {/* 기존 onClick 제거 후 개별 아이템에 적용 */}
//           <div className="flex-1 flex flex-col justify-center px-4 pb-4 gap-3">
//             {activeEvents.length > 0 ? (
//               activeEvents.map((event, index) => (
//                 <div
//                   key={`${event.eventId}-${index}`}
//                   // [변경] 클릭 시 해당 이벤트 타입의 페이지로 이동하도록 수정
//                   // 주의: 라우터 설정에 맞게 경로를 수정하세요. (예: /event/:eventType)
//                   onClick={() => navigate(`/event/${event.eventType}`)}
//                   className="flex flex-col justify-center w-full h-10 bg-white rounded-[20px] px-4 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
//                 >
//                   <h3 className="text-[12px] font-medium text-(--fill-color7) truncate">
//                     {event.buttonDescription}
//                   </h3>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center text-[13px] text-gray-400 py-4">
//                 현재 진행중인 이벤트가 없습니다.
//                 <br />
//                 우측 상단 버튼을 눌러 생성해주세요.
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="w-full h-[70px] justify-center items-center flex flex-row mt-5">
//         <div
//           className="w-[340px] h-full bg-(--fill-color1) rounded-[20px] flex flex-row items-center cursor-pointer shadow-sm hover:bg-gray-100 transition-colors"
//           onClick={() => navigate('/owner/pastevent')}
//         >
//           <img src={history_icon} alt="" className="w-[28px] h-[28px] ml-5" />
//           <p className="ml-4 text-[14px] text-black font-medium">지난 이벤트</p>
//           <div className="flex-grow" />
//           <img src={goto_icon} alt="" className="w-[40px] h-[40px] mr-5" />
//         </div>
//       </div>

//       <OwnerBottomBar />
//     </div>
//   );
// };

import React, { useState, useEffect } from 'react';
import { OwnerBottomBar } from '../../components/OwnerBottomBar';
import history_icon from '../../assets/history_icon.png';
import goto_icon from '../../assets/goto_icon.png';
import { useNavigate } from 'react-router-dom';

// API 응답 데이터 타입 정의 (카테고리 조회)
interface EventCategory {
  eventType: string;
  available: boolean;
  description: string;
  startDate: string;
  endDate: string;
}

interface CategoriesResponse {
  availableCategories: EventCategory[];
}

export const EventManage = () => {
  const navigate = useNavigate();
  // 참여 가능한 이벤트 목록 상태
  const [availableEvents, setAvailableEvents] = useState<EventCategory[]>([]);
  const apiUri = import.meta.env.VITE_API_URI;

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        // [변경] 참여 가능한 이벤트 카테고리 조회
        const response = await fetch(`${apiUri}/v1/events/categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await response.json();

        if (json.code === 100 && json.data) {
          const data: CategoriesResponse = json.data;
          setAvailableEvents(data.availableCategories || []);
        }
      } catch (error) {
        console.error('이벤트 목록을 불러오는데 실패했습니다:', error);
      }
    };

    fetchCategories();
  }, [apiUri]);

  return (
    <div className="flex flex-col w-full px-6 py-4 min-h-screen bg-white">
      <h1 className="text-[25px] text-(--fill-color6) font-normal mb-[110px] mt-4">
        Event
      </h1>

      <div className="w-full justify-center items-center flex flex-col gap-5">
        {/* 참여 가능한 이벤트 카드 */}
        <div className="w-[340px] min-h-[156px] h-auto bg-(--fill-color1) rounded-[20px] p-2 flex flex-col shadow-sm">
          <div className="flex flex-row w-full p-2 mx-2 justify-between items-center mb-2">
            <p className="text-[14px] text-black font-medium">
              진행중인 이벤트 (참여 가능)
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-center px-4 pb-4 gap-3">
            {availableEvents.length > 0 ? (
              availableEvents.map((event, index) => (
                <div
                  key={`${event.eventType}-${index}`}
                  // [변경] 클릭 시 EventCreate 페이지로 이동하며 선택된 이벤트 정보를 state로 전달
                  onClick={() =>
                    navigate('/owner/eventcreate', {
                      state: { selectedEvent: event },
                    })
                  }
                  className="flex flex-col justify-center w-full min-h-[40px] py-2 bg-white rounded-[10px] px-4 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-row justify-between items-center">
                    <h3 className="text-[12px] font-medium text-(--fill-color7) truncate w-[90%]">
                      {event.description}
                    </h3>
                    {/* 화살표 아이콘 등 추가 가능 */}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(event.startDate).toLocaleDateString()} ~{' '}
                    {new Date(event.endDate).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center text-[13px] text-gray-400 py-4">
                현재 참여 가능한 이벤트가 없습니다.
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
