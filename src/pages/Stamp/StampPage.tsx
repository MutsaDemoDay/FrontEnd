import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Plus from '../../assets/plus.svg';
import ThreeDots from '../../assets/threedots.svg';
import Hamburger from '../../assets/hamburger.svg';
import StampSection from '../../components/StampSection';
import { type StampData } from '../../components/StampCard'; // StampCard는 사용 안하므로 타입만 import
import { UserBottomBar } from '../../components/UserBottomBar';
import Window from '../../components/Window';
import { fetchUserQr } from '../../api/UserQR';

// ✅ API 주소 설정
const apiUri = import.meta.env.VITE_API_URI;

// ✅ 이벤트 데이터 타입 정의
interface EventData {
  eventType: string;
  buttonDescription: string;
  startDate: string;
  endDate: string;
  buttonImageUrl: string;
}

// API 전체 응답 타입 (Event)
interface EventApiResponse {
  timestamp: string;
  code: number;
  message: string;
  data: EventData[];
}

// API 전체 응답 타입 (Account)
interface AccountApiResponse {
  code: number;
  message: string;
  data: {
    email: string;
    loginId: string;
    joinedAt: string;
  };
}

const StampPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // QR 모달 및 유저 정보 상태
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrImage, setQrImage] = useState<string>('');
  const [isLoadingQr, setIsLoadingQr] = useState(false);

  // ✅ 유저 이메일 상태 (API로 가져옴)
  const [userEmail, setUserEmail] = useState<string>('');

  // ✅ 스탬프 데이터 상태
  const [stamps, setStamps] = useState<StampData[]>([]);
  const [isLoadingStamps, setIsLoadingStamps] = useState(false);

  // ✅ 이벤트 데이터 상태
  const [events, setEvents] = useState<EventData[]>([]);

  // --------------------------------------------------------------------------
  // 1. [핵심] 유저 계정 정보(이메일) 가져오기
  // --------------------------------------------------------------------------
  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        // axios를 사용하여 계정 정보 조회
        const response = await axios.get<AccountApiResponse>(
          `${apiUri}/v1/mypage/account`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const resData = response.data;
        // 성공 조건 (code 0 or 200)
        if (resData.code === 0 || resData.code === 200 || resData.data) {
          console.log('✅ 유저 이메일 확보:', resData.data.email);
          setUserEmail(resData.data.email);
        } else {
          console.error('계정 정보 조회 실패:', resData.message);
        }
      } catch (error) {
        console.error('계정 정보 API 호출 에러:', error);
      }
    };

    fetchAccountInfo();
  }, []);

  // --------------------------------------------------------------------------
  // 2. 스탬프 데이터 가져오기
  // --------------------------------------------------------------------------
  useEffect(() => {
    const fetchStamps = async () => {
      setIsLoadingStamps(true);
      try {
        const token = localStorage.getItem('accessToken');
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

  // --------------------------------------------------------------------------
  // 3. 이벤트 목록 가져오기
  // --------------------------------------------------------------------------
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${apiUri}/v1/events/board`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
        });

        if (response.ok) {
          const json: EventApiResponse = await response.json();
          if (
            json.code === 0 ||
            json.code === 200 ||
            json.message.includes('정상')
          ) {
            setEvents(json.data);
          }
        }
      } catch (error) {
        console.error('Network error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // --------------------------------------------------------------------------
  // 4. QR 버튼 클릭 핸들러 (수정됨)
  // --------------------------------------------------------------------------
  const handleQrClick = async () => {
    // [수정] userId가 아니라 위에서 저장한 userEmail을 체크해야 합니다.
    if (!userEmail) {
      alert('사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setShowQrModal(true);
    setIsLoadingQr(true);
    setQrImage('');

    try {
      // [수정] 로그 및 API 호출 시 userEmail 사용
      console.log('QR 요청 이메일:', userEmail);

      // 확보한 이메일로 QR API 호출
      const res = await fetchUserQr(userEmail);

      if (res.code === 200 || res.code === 100) {
        setQrImage(res.data); // data: "data:image/png;base64,..."
      } else {
        alert(res.message || 'QR 생성에 실패했습니다.');
        setShowQrModal(false);
      }
    } catch (error) {
      console.error('QR Fetch Error:', error);
      alert('QR 코드를 불러오는 중 오류가 발생했습니다.');
      setShowQrModal(false);
    } finally {
      setIsLoadingQr(false);
    }
  };

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
              <div className="bg-white p-5 rounded-2xl shadow-2xl mb-6 w-[240px] h-[240px] flex items-center justify-center overflow-hidden">
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
                    QR을 불러올 수<br />
                    없습니다.
                  </div>
                )}
              </div>
              <div className="text-center space-y-1">
                {/* 조회한 유저 이메일 표시 */}
                <p className="text-white text-base font-medium">
                  {userEmail || '회원 정보 로딩중...'}
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

// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Plus from '../../assets/plus.svg';
// import ThreeDots from '../../assets/threedots.svg';
// import Hamburger from '../../assets/hamburger.svg';
// import StampSection from '../../components/StampSection';
// import { StampCard, type StampData } from '../../components/StampCard'; // StampData 타입 import
// import { UserBottomBar } from '../../components/UserBottomBar';
// import Window from '../../components/Window';
// import { fetchUserQr } from '../../api/UserQR';

// // ✅ API 주소 설정
// const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

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

//   // ✅ 스탬프 데이터 상태 (List, Grid 모드 공용)
//   const [stamps, setStamps] = useState<StampData[]>([]);
//   const [isLoadingStamps, setIsLoadingStamps] = useState(false);

//   // ✅ 이벤트 데이터 상태
//   const [events, setEvents] = useState<EventData[]>([]);

//   // ✅ 1. 스탬프 데이터 가져오기 (페이지 로드 시 무조건 실행)
//   useEffect(() => {
//     const fetchStamps = async () => {
//       setIsLoadingStamps(true);
//       try {
//         const token =
//           localStorage.getItem('token') || localStorage.getItem('accessToken');

//         const response = await fetch(`${apiUri}/v1/users/stamps`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: token ? `Bearer ${token}` : '',
//           },
//         });

//         if (response.ok) {
//           const data: StampData[] = await response.json();
//           setStamps(data);
//         } else {
//           console.error(`Error fetching stamps: ${response.status}`);
//           setStamps([]);
//         }
//       } catch (error) {
//         console.error('Network error:', error);
//         setStamps([]);
//       } finally {
//         setIsLoadingStamps(false);
//       }
//     };

//     fetchStamps();
//   }, []);

//   // ✅ 2. 이벤트 목록 가져오기
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

//           // 성공 조건 체크 (code 0, 200 혹은 메시지에 '정상' 포함)
//           if (
//             json.code === 0 ||
//             json.code === 200 ||
//             json.message.includes('정상')
//           ) {
//             setEvents(json.data);
//           } else {
//             console.error('Failed to fetch events:', json.message);
//           }
//         }
//       } catch (error) {
//         console.error('Network error fetching events:', error);
//       }
//     };

//     fetchEvents();
//   }, []);

//   // QR 버튼 클릭 핸들러
//   const handleQrClick = async () => {
//     setShowQrModal(true);
//     setIsLoadingQr(true);
//     setQrImage('');

//     try {
//       const userEmail = 'test@example.com';
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

//   // ✅ 대표 스탬프 선정 (첫 번째 데이터 사용)
//   const mainStamp = stamps.length > 0 ? stamps[0] : null;

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
//           </>
//         ) : (
//           <div className="mb-6">
//             <Window data={stamps} loading={isLoadingStamps} />
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
