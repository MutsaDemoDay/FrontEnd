// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Plus from '../../assets/plus.svg';
// import ThreeDots from '../../assets/threedots.svg';
// import Hamburger from '../../assets/hamburger.svg';
// import StampSection from '../../components/StampSection';
// import { StampCard } from '../../components/StampCard';
// import { UserBottomBar } from '../../components/UserBottomBar';
// import Window from '../../components/Window';
// import { fetchUserQr } from '../../api/UserQR';

// // ✅ API 주소 설정
// const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

// // ✅ 스탬프 데이터 타입
// interface StampData {
//   storeName: string;
//   currentCount: number;
//   maxCount: number;
//   stampImageUrl: string;
// }

// // ✅ 이벤트 데이터 타입 정의
// interface EventData {
//   eventType: string;
//   buttonDescription: string;
//   startDate: string;
//   endDate: string;
//   buttonImageUrl: string;
// }

// // API 전체 응답 타입
// interface EventApiResponse {
//   timestamp: string;
//   code: number;
//   message: string;
//   data: EventData[];
// }

// const StampPage = () => {
//   const navigate = useNavigate();
//   const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

//   // QR 모달 상태
//   const [showQrModal, setShowQrModal] = useState(false);
//   const [qrImage, setQrImage] = useState<string>('');
//   const [isLoadingQr, setIsLoadingQr] = useState(false);

//   // ✅ Grid 모드 데이터 상태
//   const [gridStamps, setGridStamps] = useState<StampData[]>([]);
//   const [isLoadingStamps, setIsLoadingStamps] = useState(false);

//   // ✅ 이벤트 데이터 상태
//   const [events, setEvents] = useState<EventData[]>([]);

//   // ✅ 이벤트 목록 가져오기 (수정된 버전)
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const token =
//           localStorage.getItem('token') || localStorage.getItem('accessToken');

//         const response = await fetch(`${apiUri}/v1/events/board`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: token ? `Bearer ${token}` : '',
//           },
//         });

//         if (response.ok) {
//           const json: EventApiResponse = await response.json();

//           // 🔍 디버깅: 실제 서버 응답 확인용 로그
//           console.log('📌 Event API Response:', json);

//           // ✅ 조건 수정: code가 0, 200 이거나, 메시지에 '정상'이 포함되면 성공 처리
//           if (
//             json.code === 0 ||
//             json.code === 200 ||
//             json.message.includes('정상')
//           ) {
//             setEvents(json.data);
//           } else {
//             console.error(
//               'Failed to fetch events (Code mismatch):',
//               json.message
//             );
//             // 필요하다면 여기서도 setEvents([]) 처리를 할 수 있습니다.
//           }
//         } else {
//           console.error(`Error fetching events: ${response.status}`);
//         }
//       } catch (error) {
//         console.error('Network error fetching events:', error);
//       }
//     };

//     fetchEvents();
//   }, []);

//   // ✅ viewMode가 'grid'일 때 스탬프 API 호출
//   useEffect(() => {
//     if (viewMode === 'grid') {
//       const fetchGridStamps = async () => {
//         setIsLoadingStamps(true);
//         try {
//           const token =
//             localStorage.getItem('token') ||
//             localStorage.getItem('accessToken');

//           const response = await fetch(`${apiUri}/v1/users/stamps`, {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: token ? `Bearer ${token}` : '',
//             },
//           });

//           if (response.ok) {
//             const data: StampData[] = await response.json();
//             setGridStamps(data);
//           } else {
//             console.error(`Error fetching stamps: ${response.status}`);
//             setGridStamps([]);
//           }
//         } catch (error) {
//           console.error('Network error:', error);
//           setGridStamps([]);
//         } finally {
//           setIsLoadingStamps(false);
//         }
//       };

//       fetchGridStamps();
//     }
//   }, [viewMode]);

//   // QR 버튼 클릭 핸들러
//   const handleQrClick = async () => {
//     setShowQrModal(true);
//     setIsLoadingQr(true);
//     setQrImage('');

//     try {
//       const userEmail = 'test@example.com';
//       // 실제로는 로그인된 유저 정보를 가져와야 함
//       const res = await fetchUserQr(userEmail);
//       if (res.code === 200 || res.code === 100) {
//         setQrImage(res.data);
//       } else {
//         alert(res.message || 'QR 실패');
//         setShowQrModal(false);
//       }
//     } catch (error) {
//       console.log(error);
//       alert('QR 에러');
//       setShowQrModal(false);
//     } finally {
//       setIsLoadingQr(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen bg-gray-50 pb-[80px]">
//       {/* Header */}
//       <header className="flex items-center justify-between px-5 py-4 bg-gray-50 sticky top-0 z-10">
//         <h1 className="text-xl font-bold text-gray-800">My Stamp</h1>
//         <div className="flex items-center space-x-3">
//           <button
//             onClick={() => navigate('/stampsetting')}
//             className="p-1 text-gray-500 hover:text-gray-800"
//           >
//             <img src={Plus} alt="Plus" className="w-6 h-6" />
//           </button>
//           <button className="p-1 text-gray-500 hover:text-gray-800">
//             <img src={ThreeDots} alt="ThreeDots" className="w-6 h-6" />
//           </button>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="px-5">
//         {/* View Mode Toggle */}
//         <div className="flex justify-center mb-4">
//           <div className="flex bg-black rounded-full p-1 w-[80px] relative">
//             <button
//               onClick={() => setViewMode('list')}
//               className={`flex-1 flex justify-center items-center rounded-full py-1 transition-all ${
//                 viewMode === 'list' ? 'bg-[#FF6B00]' : 'bg-transparent'
//               }`}
//             >
//               <img src={Hamburger} alt="List Mode" className="w-4 h-4" />
//             </button>
//             <button
//               onClick={() => setViewMode('grid')}
//               className={`flex-1 flex justify-center items-center rounded-full py-1 transition-all ${
//                 viewMode === 'grid' ? 'bg-[#FF6B00]' : 'bg-transparent'
//               }`}
//             >
//               <img src={ThreeDots} alt="Grid Mode" className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* List / Grid View Content */}
//         {viewMode === 'list' ? (
//           <>
//             <div className="mb-6 flex justify-center">
//               <StampSection />
//             </div>
//             <div className="mb-6">
//               <StampCard />
//             </div>
//           </>
//         ) : (
//           <div className="mb-6">
//             <Window data={gridStamps} loading={isLoadingStamps} />
//           </div>
//         )}

//         {/* Buttons */}
//         <div className="grid grid-cols-2 gap-4 mb-10">
//           <button
//             onClick={() => navigate('/stamphistory')}
//             className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 transition"
//           >
//             <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
//               <img src={ThreeDots} alt="History" className="w-6 h-6" />
//             </div>
//             <span className="text-sm font-medium text-gray-700">
//               스탬프 히스토리
//             </span>
//           </button>

//           <button
//             onClick={handleQrClick}
//             className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 transition"
//           >
//             <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
//               <img src={ThreeDots} alt="stamp" className="w-6 h-6" />
//             </div>
//             <span className="text-sm font-medium text-gray-700">
//               스탬프 찍기
//             </span>
//           </button>
//         </div>

//         {/* Events Section */}
//         <section>
//           <h2 className="text-lg font-bold text-gray-800 mb-4">Event</h2>
//           <div className="space-y-3">
//             {events.length > 0 ? (
//               events.map((event, index) => (
//                 <div
//                   key={index}
//                   onClick={() => navigate('/stamp/event')}
//                   className="bg-gray-100 rounded-2xl p-5 flex justify-between items-center cursor-pointer hover:bg-gray-200 transition"
//                 >
//                   <div className="flex-1 pr-4">
//                     <h3 className="text-[#FF6B00] font-bold text-sm mb-1">
//                       {event.eventType.replace(/_/g, ' ')}
//                     </h3>
//                     <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed mb-2">
//                       {event.buttonDescription}
//                     </p>
//                     <p className="text-[10px] text-gray-400">
//                       {event.startDate} ~ {event.endDate}
//                     </p>
//                   </div>
//                   <div className="w-20 h-20 bg-white rounded-lg shadow-sm overflow-hidden flex-shrink-0 flex items-center justify-center">
//                     {event.buttonImageUrl &&
//                     event.buttonImageUrl !== 'string' ? (
//                       <img
//                         src={event.buttonImageUrl}
//                         alt={event.eventType}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <span className="text-xs text-gray-300">IMG</span>
//                     )}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-400 text-sm py-4">
//                 진행 중인 이벤트가 없습니다.
//               </p>
//             )}
//           </div>
//         </section>
//       </main>

//       {/* QR Modal */}
//       {showQrModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <div
//             className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
//             onClick={() => setShowQrModal(false)}
//           ></div>
//           <div className="relative z-10 w-[393px] h-full flex flex-col items-center justify-center pointer-events-none">
//             <button
//               className="absolute top-6 right-6 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition backdrop-blur-md pointer-events-auto"
//               onClick={() => setShowQrModal(false)}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5 text-white"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2.5}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//             <div className="pointer-events-auto flex flex-col items-center w-full">
//               <div className="bg-white p-5 rounded-2xl shadow-2xl mb-6 w-[240px] h-[240px] flex items-center justify-center">
//                 {isLoadingQr ? (
//                   <div className="text-gray-400 text-sm animate-pulse">
//                     QR 생성 중...
//                   </div>
//                 ) : qrImage ? (
//                   <img
//                     src={qrImage}
//                     alt="User QR Code"
//                     className="w-full h-full object-contain"
//                   />
//                 ) : (
//                   <div className="text-red-400 text-sm text-center">
//                     이미지를
//                     <br />
//                     불러올 수 없습니다.
//                   </div>
//                 )}
//               </div>
//               <div className="text-center space-y-1">
//                 <p className="text-white text-base font-medium">
//                   회원ID: abceq01234
//                 </p>
//                 <p className="text-gray-300 text-xs">QR코드 유효시간 01:00</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Footer */}
//       <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100">
//         <UserBottomBar />
//       </div>
//     </div>
//   );
// };

// export default StampPage;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Plus from '../../assets/plus.svg';
import ThreeDots from '../../assets/threedots.svg';
import Hamburger from '../../assets/hamburger.svg';
import StampSection from '../../components/StampSection';
import { StampCard, type StampData } from '../../components/StampCard'; // StampData 타입 import
import { UserBottomBar } from '../../components/UserBottomBar';
import Window from '../../components/Window';
import { fetchUserQr } from '../../api/UserQR';

// ✅ API 주소 설정
const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

// ✅ 이벤트 데이터 타입 정의
interface EventData {
  eventType: string;
  buttonDescription: string;
  startDate: string;
  endDate: string;
  buttonImageUrl: string;
}

// API 전체 응답 타입
interface EventApiResponse {
  timestamp: string;
  code: number;
  message: string;
  data: EventData[];
}

const StampPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // QR 모달 상태
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrImage, setQrImage] = useState<string>('');
  const [isLoadingQr, setIsLoadingQr] = useState(false);

  // ✅ 스탬프 데이터 상태 (List, Grid 모드 공용)
  const [stamps, setStamps] = useState<StampData[]>([]);
  const [isLoadingStamps, setIsLoadingStamps] = useState(false);

  // ✅ 이벤트 데이터 상태
  const [events, setEvents] = useState<EventData[]>([]);

  // ✅ 1. 스탬프 데이터 가져오기 (페이지 로드 시 무조건 실행)
  useEffect(() => {
    const fetchStamps = async () => {
      setIsLoadingStamps(true);
      try {
        const token =
          localStorage.getItem('token') || localStorage.getItem('accessToken');

        const response = await fetch(`${apiUri}/v1/users/stamps`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
        });

        if (response.ok) {
          const data: StampData[] = await response.json();
          setStamps(data);
        } else {
          console.error(`Error fetching stamps: ${response.status}`);
          setStamps([]);
        }
      } catch (error) {
        console.error('Network error:', error);
        setStamps([]);
      } finally {
        setIsLoadingStamps(false);
      }
    };

    fetchStamps();
  }, []);

  // ✅ 2. 이벤트 목록 가져오기
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token =
          localStorage.getItem('token') || localStorage.getItem('accessToken');

        const response = await fetch(`${apiUri}/v1/events/board`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
        });

        if (response.ok) {
          const json: EventApiResponse = await response.json();

          // 성공 조건 체크 (code 0, 200 혹은 메시지에 '정상' 포함)
          if (
            json.code === 0 ||
            json.code === 200 ||
            json.message.includes('정상')
          ) {
            setEvents(json.data);
          } else {
            console.error('Failed to fetch events:', json.message);
          }
        }
      } catch (error) {
        console.error('Network error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // QR 버튼 클릭 핸들러
  const handleQrClick = async () => {
    setShowQrModal(true);
    setIsLoadingQr(true);
    setQrImage('');

    try {
      const userEmail = 'test@example.com';
      const res = await fetchUserQr(userEmail);
      if (res.code === 200 || res.code === 100) {
        setQrImage(res.data);
      } else {
        alert(res.message || 'QR 실패');
        setShowQrModal(false);
      }
    } catch (error) {
      console.log(error);
      alert('QR 에러');
      setShowQrModal(false);
    } finally {
      setIsLoadingQr(false);
    }
  };

  // ✅ 대표 스탬프 선정 (첫 번째 데이터 사용)
  const mainStamp = stamps.length > 0 ? stamps[0] : null;

  return (
    <div className="relative min-h-screen bg-gray-50 pb-[80px]">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 bg-gray-50 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800">My Stamp</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/stampsetting')}
            className="p-1 text-gray-500 hover:text-gray-800"
          >
            <img src={Plus} alt="Plus" className="w-6 h-6" />
          </button>
          <button className="p-1 text-gray-500 hover:text-gray-800">
            <img src={ThreeDots} alt="ThreeDots" className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5">
        {/* View Mode Toggle */}
        <div className="flex justify-center mb-4">
          <div className="flex bg-black rounded-full p-1 w-[80px] relative">
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 flex justify-center items-center rounded-full py-1 transition-all ${
                viewMode === 'list' ? 'bg-[#FF6B00]' : 'bg-transparent'
              }`}
            >
              <img src={Hamburger} alt="List Mode" className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex-1 flex justify-center items-center rounded-full py-1 transition-all ${
                viewMode === 'grid' ? 'bg-[#FF6B00]' : 'bg-transparent'
              }`}
            >
              <img src={ThreeDots} alt="Grid Mode" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List / Grid View Content */}
        {viewMode === 'list' ? (
          <>
            <div className="mb-6 flex justify-center">
              <StampSection />
            </div>
          </>
        ) : (
          <div className="mb-6">
            <Window data={stamps} loading={isLoadingStamps} />
          </div>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <button
            onClick={() => navigate('/stamphistory')}
            className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 transition"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
              <img src={ThreeDots} alt="History" className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              스탬프 히스토리
            </span>
          </button>

          <button
            onClick={handleQrClick}
            className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 transition"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
              <img src={ThreeDots} alt="stamp" className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              스탬프 찍기
            </span>
          </button>
        </div>

        {/* Events Section */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Event</h2>
          <div className="space-y-3">
            {events.length > 0 ? (
              events.map((event, index) => (
                <div
                  key={index}
                  onClick={() => navigate('/stamp/event')}
                  className="bg-gray-100 rounded-2xl p-5 flex justify-between items-center cursor-pointer hover:bg-gray-200 transition"
                >
                  <div className="flex-1 pr-4">
                    <h3 className="text-[#FF6B00] font-bold text-sm mb-1">
                      {event.eventType.replace(/_/g, ' ')}
                    </h3>
                    <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed mb-2">
                      {event.buttonDescription}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {event.startDate} ~ {event.endDate}
                    </p>
                  </div>
                  <div className="w-20 h-20 bg-white rounded-lg shadow-sm overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {event.buttonImageUrl &&
                    event.buttonImageUrl !== 'string' ? (
                      <img
                        src={event.buttonImageUrl}
                        alt={event.eventType}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-300">IMG</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 text-sm py-4">
                진행 중인 이벤트가 없습니다.
              </p>
            )}
          </div>
        </section>
      </main>

      {/* QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
            onClick={() => setShowQrModal(false)}
          ></div>
          <div className="relative z-10 w-[393px] h-full flex flex-col items-center justify-center pointer-events-none">
            <button
              className="absolute top-6 right-6 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition backdrop-blur-md pointer-events-auto"
              onClick={() => setShowQrModal(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="pointer-events-auto flex flex-col items-center w-full">
              <div className="bg-white p-5 rounded-2xl shadow-2xl mb-6 w-[240px] h-[240px] flex items-center justify-center">
                {isLoadingQr ? (
                  <div className="text-gray-400 text-sm animate-pulse">
                    QR 생성 중...
                  </div>
                ) : qrImage ? (
                  <img
                    src={qrImage}
                    alt="User QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-red-400 text-sm text-center">
                    이미지를
                    <br />
                    불러올 수 없습니다.
                  </div>
                )}
              </div>
              <div className="text-center space-y-1">
                <p className="text-white text-base font-medium">
                  회원ID: abceq01234
                </p>
                <p className="text-gray-300 text-xs">QR코드 유효시간 01:00</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100">
        <UserBottomBar />
      </div>
    </div>
  );
};

export default StampPage;
