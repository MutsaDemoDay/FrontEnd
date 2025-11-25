// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import BackButton from '../../components/BackButton';
// import PlusIcon from '../../assets/plus.svg';
// import GarbageIcon from '../../assets/garbage.svg';
// import EmptyStar from '../../assets/emptystar.svg';
// import YellowStar from '../../assets/yellowstar.svg';
// import DeleteStampModal from '../../components/DeleteStampModal';

// // API 주소 설정
// const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

// // UI에 표시할 스탬프 아이템 타입
// interface StampItem {
//   id: number;
//   name: string;
//   countDisplay: string;
//   currentCount: number;
//   maxCount: number;
//   isFavorite: boolean;
//   theme: 'standard' | 'text' | 'green' | 'yellow';
// }

// // GET 요청 시 서버 응답 데이터 타입
// // (목록 조회 시 찜 여부인 isFavorite가 넘어온다고 가정하고 추가했습니다)
// interface StampResponseDto {
//   storeName: string;
//   currentCount: number;
//   maxCount: number;
//   stampImageUrl: string;
//   stampId?: number;
//   isFavorite?: boolean; // 서버 응답에 찜 상태 필드 추가 필요
// }

// // DELETE, POST 등 일반적인 응답 타입
// interface CommonApiResponse {
//   timestamp: string;
//   code: number;
//   message: string;
//   data: object;
// }

// const StampSetting = () => {
//   const navigate = useNavigate();

//   // 상태 관리
//   const [stamps, setStamps] = useState<StampItem[]>([]);
//   const [isDeleteMode, setIsDeleteMode] = useState(false);
//   const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // --- API 연동: 스탬프 목록 조회 (GET) ---
//   useEffect(() => {
//     const fetchStamps = async () => {
//       const token = localStorage.getItem('accessToken');

//       if (!token) {
//         console.warn('로그인 토큰이 없습니다.');
//         return;
//       }

//       try {
//         const response = await axios.get<StampResponseDto[]>(
//           `${apiUri}/v1/users/stamps`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );

//         const data = response.data;

//         // DTO -> UI State 변환
//         const formattedStamps: StampItem[] = data.map((item, index) => ({
//           id: item.stampId || index,
//           name: item.storeName,
//           countDisplay: `${item.currentCount}/${item.maxCount}`,
//           currentCount: item.currentCount,
//           maxCount: item.maxCount,
//           // 서버에서 값을 주지 않으면 기본값 false
//           isFavorite: item.isFavorite || false,
//           theme: ['standard', 'text', 'green', 'yellow'][
//             index % 4
//           ] as StampItem['theme'],
//         }));

//         setStamps(formattedStamps);
//       } catch (error) {
//         console.error('스탬프 목록 조회 실패:', error);
//       }
//     };

//     fetchStamps();
//   }, [navigate]);

//   // --- API 연동: 즐겨찾기(찜) 토글 핸들러 ---
//   const toggleFavorite = async (id: number) => {
//     if (isDeleteMode) return;

//     const token = localStorage.getItem('accessToken');
//     if (!token) {
//       alert('로그인이 필요합니다.');
//       return;
//     }

//     // 1. 현재 클릭한 스탬프 찾기
//     const targetStamp = stamps.find((s) => s.id === id);
//     if (!targetStamp) return;

//     // 2. 현재 상태 확인 (찜 되어있으면 true)
//     const currentStatus = targetStamp.isFavorite;

//     try {
//       if (currentStatus) {
//         // --- [DELETE] 찜 해제 요청 ---
//         // 조건: 찜이 되어있으면(Filled) -> 해제(Empty)
//         await axios.delete<CommonApiResponse>(
//           `${apiUri}/v1/stamps/${id}/favorite`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//       } else {
//         // --- [POST] 찜 등록 요청 ---
//         // 조건: 찜이 안되어있으면(Empty) -> 등록(Filled)
//         await axios.post<CommonApiResponse>(
//           `${apiUri}/v1/stamps/${id}/favorite`,
//           {}, // POST body는 비워둠 (요청 명세에 body data 명시 없음)
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//       }

//       // 3. API 성공 시 UI 상태 업데이트 (토글)
//       setStamps((prevStamps) =>
//         prevStamps.map((stamp) =>
//           stamp.id === id ? { ...stamp, isFavorite: !stamp.isFavorite } : stamp
//         )
//       );
//     } catch (error) {
//       console.error('즐겨찾기 변경 실패:', error);
//       alert('즐겨찾기 상태 변경 중 오류가 발생했습니다.');
//     }
//   };

//   // --- 삭제 모드 관련 핸들러 ---
//   const toggleSelection = (id: number) => {
//     const newSelectedIds = new Set(selectedIds);
//     if (newSelectedIds.has(id)) {
//       newSelectedIds.delete(id);
//     } else {
//       newSelectedIds.add(id);
//     }
//     setSelectedIds(newSelectedIds);
//   };

//   const handleDeleteModeToggle = () => {
//     setIsDeleteMode(true);
//     setSelectedIds(new Set());
//   };

//   const handleCancelDeleteMode = () => {
//     setIsDeleteMode(false);
//     setSelectedIds(new Set());
//   };

//   const handleOpenDeleteModal = () => {
//     if (selectedIds.size === 0) return;
//     setIsModalOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     const token = localStorage.getItem('accessToken');
//     if (!token) {
//       alert('로그인이 필요합니다.');
//       return;
//     }

//     try {
//       // 선택된 ID들에 대해 개별 DELETE 요청
//       const deletePromises = Array.from(selectedIds).map(async (id) => {
//         const response = await axios.delete<CommonApiResponse>(
//           `${apiUri}/v1/stamps/${id}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         return response.data;
//       });

//       await Promise.all(deletePromises);

//       // UI 상태 업데이트: 삭제된 항목 제거
//       setStamps((prevStamps) =>
//         prevStamps.filter((stamp) => !selectedIds.has(stamp.id))
//       );

//       setIsModalOpen(false);
//       setIsDeleteMode(false);
//       setSelectedIds(new Set());
//       alert('삭제되었습니다.');
//     } catch (error) {
//       console.error('스탬프 삭제 실패:', error);
//       alert('스탬프 삭제 중 오류가 발생했습니다.');
//     }
//   };

//   // --- 렌더링 헬퍼: 썸네일 ---
//   const renderThumbnail = (currentCount: number, maxCount: number) => {
//     return (
//       <div className="w-[80px] h-[50px] bg-white rounded-md shadow-sm border border-gray-200 flex flex-col items-center justify-between py-1 px-1.5 overflow-hidden">
//         <div className="flex-1 flex items-center justify-center w-full">
//           <div className="grid grid-cols-5 gap-x-0.5 gap-y-0.5">
//             {Array.from({ length: maxCount }).map((_, i) => {
//               const isFilled = i < currentCount;
//               return (
//                 <div key={i} className="flex items-center justify-center">
//                   <svg
//                     width="10"
//                     height="10"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                     className={isFilled ? 'text-gray-800' : 'text-gray-300'}
//                   >
//                     <path
//                       d="M18 8H19C20.1046 8 21 8.89543 21 10V12C21 13.1046 20.1046 14 19 14H18V8Z"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M2 8H18V15C18 17.2091 16.2091 19 14 19H6C3.79086 19 2 17.2091 2 15V8Z"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M6 1V4"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M10 1V4"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M14 1V4"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//         <div className="w-full flex justify-center mt-0.5">
//           <div className="bg-gray-200 rounded-full w-[90%] h-[4px]"></div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-white px-5 pt-4 pb-28">
//       {/* 1. Header */}
//       <div className="mb-6">
//         <BackButton />
//         <h1 className="text-2xl font-bold text-gray-800 mt-4">스탬프 관리</h1>
//       </div>

//       {/* 2. Action Bar */}
//       {!isDeleteMode && (
//         <div className="flex justify-end space-x-2 mb-3">
//           <button
//             onClick={() => navigate('/stampregistration1')}
//             className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
//           >
//             <img src={PlusIcon} alt="추가" className="w-4 h-4" />
//           </button>
//           <button
//             onClick={handleDeleteModeToggle}
//             className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
//           >
//             <img src={GarbageIcon} alt="삭제" className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       {/* 3. Stamp List Container */}
//       <div className="border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
//         {stamps.map((stamp) => (
//           <div
//             key={stamp.id}
//             className={`flex items-center justify-between p-4 border-b border-gray-50 last:border-b-0 bg-white ${
//               isDeleteMode ? 'cursor-pointer' : 'hover:bg-gray-50'
//             }`}
//             onClick={() => isDeleteMode && toggleSelection(stamp.id)}
//           >
//             {/* Left: Checkbox & Image & Info */}
//             <div className="flex items-center space-x-4">
//               {isDeleteMode && (
//                 <div
//                   className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
//                     selectedIds.has(stamp.id)
//                       ? 'bg-black border-black'
//                       : 'bg-white border-gray-300'
//                   }`}
//                 >
//                   {selectedIds.has(stamp.id) && (
//                     <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
//                   )}
//                 </div>
//               )}

//               {renderThumbnail(stamp.currentCount, stamp.maxCount)}

//               <div>
//                 <h3 className="font-bold text-gray-800 text-sm mb-0.5">
//                   {stamp.name}
//                 </h3>
//                 <p className="text-gray-400 text-xs">{stamp.countDisplay}</p>
//               </div>
//             </div>

//             {/* Right: Star Toggle */}
//             {!isDeleteMode && (
//               <button onClick={() => toggleFavorite(stamp.id)} className="p-2">
//                 {/* isFavorite가 true이면 YellowStar(채워진 별/하트 역할)
//                   isFavorite가 false이면 EmptyStar(빈 별/하트 역할)
//                 */}
//                 <img
//                   src={stamp.isFavorite ? YellowStar : EmptyStar}
//                   alt="favorite"
//                   className="w-5 h-5"
//                 />
//               </button>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* 4. Delete Mode Buttons */}
//       {isDeleteMode && (
//         <div className="fixed bottom-0 left-0 right-0 z-10 grid grid-cols-2 gap-3 p-5 bg-white border-t border-gray-100">
//           <button
//             onClick={handleCancelDeleteMode}
//             className="w-full py-4 bg-gray-100 text-gray-800 font-bold rounded-xl hover:bg-gray-200 transition"
//           >
//             취소
//           </button>
//           <button
//             onClick={handleOpenDeleteModal}
//             className={`w-full py-4 font-bold rounded-xl transition ${
//               selectedIds.size > 0
//                 ? 'bg-[#FF6B00] text-white hover:bg-orange-500'
//                 : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//             }`}
//             disabled={selectedIds.size === 0}
//           >
//             삭제
//           </button>
//         </div>
//       )}

//       {/* 5. Delete Confirmation Modal */}
//       <DeleteStampModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onConfirm={handleConfirmDelete}
//       />
//     </div>
//   );
// };

// export default StampSetting;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../../components/BackButton';
import PlusIcon from '../../assets/plus.svg';
import GarbageIcon from '../../assets/garbage.svg';
import EmptyStar from '../../assets/emptystar.svg';
import YellowStar from '../../assets/yellowstar.svg';
import DeleteStampModal from '../../components/DeleteStampModal';

// API 주소 설정
const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

// UI에 표시할 스탬프 아이템 타입
interface StampItem {
  id: number;
  name: string;
  countDisplay: string;
  currentCount: number;
  maxCount: number;
  isFavorite: boolean;
  theme: 'standard' | 'text' | 'green' | 'yellow';
}

// GET 요청: 리스트 내부의 개별 아이템 타입 (새로운 API 명세 반영)
interface StampDataDto {
  stampId: number;
  storeId: number;
  storeName: string;
  currentCount: number;
  maxCount: number;
  stampImageUrl: string;
  favorite: boolean;
}

// DELETE, POST 등 일반적인 응답 타입
interface CommonApiResponse {
  timestamp: string;
  code: number;
  message: string;
  data: object;
}

const StampSetting = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [stamps, setStamps] = useState<StampItem[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- API 연동: 스탬프 목록 조회 (GET) ---
  useEffect(() => {
    const fetchStamps = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        console.warn('로그인 토큰이 없습니다.');
        return;
      }

      try {
        // [수정] 응답 구조가 불확실하므로 제네릭을 제거하거나 any로 처리하여 유연하게 받음
        const response = await axios.get(`${apiUri}/v1/users/stamps`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // [디버깅] 서버가 실제로 준 전체 데이터 구조 확인
        console.log('Raw Response Data:', response.data);

        let listData: StampDataDto[] = [];

        // [핵심 수정] 데이터 구조에 따라 배열 추출 방식 분기 처리
        // Case 1: 서버가 배열을 바로 반환하는 경우 [ {..}, {..} ]
        if (Array.isArray(response.data)) {
          listData = response.data;
        }
        // Case 2: 서버가 data 필드 안에 배열을 담아 주는 경우 { data: [..], code: 200 }
        else if (response.data && Array.isArray(response.data.data)) {
          listData = response.data.data;
        }

        console.log('추출된 리스트 데이터:', listData);

        // DTO -> UI State 변환
        const formattedStamps: StampItem[] = listData.map((item, index) => ({
          id: item.stampId, // 고유 ID (stampId 사용)
          name: item.storeName,
          countDisplay: `${item.currentCount}/${item.maxCount}`,
          currentCount: item.currentCount,
          maxCount: item.maxCount,
          isFavorite: item.favorite,
          theme: ['standard', 'text', 'green', 'yellow'][
            index % 4
          ] as StampItem['theme'],
        }));

        setStamps(formattedStamps);
      } catch (error) {
        console.error('스탬프 목록 조회 실패:', error);
      }
    };

    fetchStamps();
  }, [navigate]);

  // --- API 연동: 즐겨찾기(찜) 토글 핸들러 ---
  const toggleFavorite = async (id: number) => {
    if (isDeleteMode) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    const targetStamp = stamps.find((s) => s.id === id);
    if (!targetStamp) return;

    const currentStatus = targetStamp.isFavorite;

    try {
      if (currentStatus) {
        // [DELETE] 찜 해제 요청
        await axios.delete<CommonApiResponse>(
          `${apiUri}/v1/stamps/${id}/favorite`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // [POST] 찜 등록 요청
        await axios.post<CommonApiResponse>(
          `${apiUri}/v1/stamps/${id}/favorite`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setStamps((prevStamps) =>
        prevStamps.map((stamp) =>
          stamp.id === id ? { ...stamp, isFavorite: !stamp.isFavorite } : stamp
        )
      );
    } catch (error) {
      console.error('즐겨찾기 변경 실패:', error);
      alert('즐겨찾기 상태 변경 중 오류가 발생했습니다.');
    }
  };

  // --- 삭제 모드 관련 핸들러 ---
  const toggleSelection = (id: number) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleDeleteModeToggle = () => {
    setIsDeleteMode(true);
    setSelectedIds(new Set());
  };

  const handleCancelDeleteMode = () => {
    setIsDeleteMode(false);
    setSelectedIds(new Set());
  };

  const handleOpenDeleteModal = () => {
    if (selectedIds.size === 0) return;
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const deletePromises = Array.from(selectedIds).map(async (id) => {
        const response = await axios.delete<CommonApiResponse>(
          `${apiUri}/v1/stamps/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data;
      });

      await Promise.all(deletePromises);

      setStamps((prevStamps) =>
        prevStamps.filter((stamp) => !selectedIds.has(stamp.id))
      );

      setIsModalOpen(false);
      setIsDeleteMode(false);
      setSelectedIds(new Set());
      alert('삭제되었습니다.');
    } catch (error) {
      console.error('스탬프 삭제 실패:', error);
      alert('스탬프 삭제 중 오류가 발생했습니다.');
    }
  };

  // --- 렌더링 헬퍼: 썸네일 ---
  const renderThumbnail = (currentCount: number, maxCount: number) => {
    return (
      <div className="w-[80px] h-[50px] bg-white rounded-md shadow-sm border border-gray-200 flex flex-col items-center justify-between py-1 px-1.5 overflow-hidden">
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="grid grid-cols-5 gap-x-0.5 gap-y-0.5">
            {Array.from({ length: maxCount }).map((_, i) => {
              const isFilled = i < currentCount;
              return (
                <div key={i} className="flex items-center justify-center">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={isFilled ? 'text-gray-800' : 'text-gray-300'}
                  >
                    <path
                      d="M18 8H19C20.1046 8 21 8.89543 21 10V12C21 13.1046 20.1046 14 19 14H18V8Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 8H18V15C18 17.2091 16.2091 19 14 19H6C3.79086 19 2 17.2091 2 15V8Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 1V4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 1V4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 1V4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full flex justify-center mt-0.5">
          <div className="bg-gray-200 rounded-full w-[90%] h-[4px]"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white px-5 pt-4 pb-28">
      {/* 1. Header */}
      <div className="mb-6">
        <BackButton />
        <h1 className="text-2xl font-bold text-gray-800 mt-4">스탬프 관리</h1>
      </div>

      {/* 2. Action Bar */}
      {!isDeleteMode && (
        <div className="flex justify-end space-x-2 mb-3">
          <button
            onClick={() => navigate('/stampregistration1')}
            className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
          >
            <img src={PlusIcon} alt="추가" className="w-4 h-4" />
          </button>
          <button
            onClick={handleDeleteModeToggle}
            className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
          >
            <img src={GarbageIcon} alt="삭제" className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Stamp List Container */}
      <div className="border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {stamps.map((stamp, index) => (
          <div
            key={`${stamp.id}-${index}`}
            className={`flex items-center justify-between p-4 border-b border-gray-50 last:border-b-0 bg-white ${
              isDeleteMode ? 'cursor-pointer' : 'hover:bg-gray-50'
            }`}
            onClick={() => isDeleteMode && toggleSelection(stamp.id)}
          >
            {/* Left: Checkbox & Image & Info */}
            <div className="flex items-center space-x-4">
              {isDeleteMode && (
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedIds.has(stamp.id)
                      ? 'bg-black border-black'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {selectedIds.has(stamp.id) && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </div>
              )}

              {renderThumbnail(stamp.currentCount, stamp.maxCount)}

              <div>
                <h3 className="font-bold text-gray-800 text-sm mb-0.5">
                  {stamp.name}
                </h3>
                <p className="text-gray-400 text-xs">{stamp.countDisplay}</p>
              </div>
            </div>

            {/* Right: Star Toggle */}
            {!isDeleteMode && (
              <button onClick={() => toggleFavorite(stamp.id)} className="p-2">
                <img
                  src={stamp.isFavorite ? YellowStar : EmptyStar}
                  alt="favorite"
                  className="w-5 h-5"
                />
              </button>
            )}
          </div>
        ))}

        {stamps.length === 0 && (
          <div className="p-10 text-center text-gray-400 text-sm">
            등록된 스탬프가 없습니다.
          </div>
        )}
      </div>

      {/* 4. Delete Mode Buttons */}
      {isDeleteMode && (
        <div className="fixed bottom-0 left-0 right-0 z-10 grid grid-cols-2 gap-3 p-5 bg-white border-t border-gray-100">
          <button
            onClick={handleCancelDeleteMode}
            className="w-full py-4 bg-gray-100 text-gray-800 font-bold rounded-xl hover:bg-gray-200 transition"
          >
            취소
          </button>
          <button
            onClick={handleOpenDeleteModal}
            className={`w-full py-4 font-bold rounded-xl transition ${
              selectedIds.size > 0
                ? 'bg-[#FF6B00] text-white hover:bg-orange-500'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            disabled={selectedIds.size === 0}
          >
            삭제
          </button>
        </div>
      )}

      {/* 5. Delete Confirmation Modal */}
      <DeleteStampModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default StampSetting;
