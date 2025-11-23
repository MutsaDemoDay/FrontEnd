// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom'; // useLocation 추가
// import axios from 'axios';
// import { UserBottomBar } from '../../components/UserBottomBar';
// import BackButton from '../../components/BackButton';
// // 이미지 import
// import HeartShare from '../../assets/heart_share.png';
// import Phone from '../../assets/phone_icon.png';
// import instagram from '../../assets/instagram_icon.png';
// import internet from '../../assets/internet_icon.png';
// import gift from '../../assets/gift_icon.png';

// // API 기본 주소
// const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

// // API 응답 데이터 타입 정의
// interface StoreDetailData {
//   storeId: number;
//   storeName: string;
//   storeAddress: string;
//   category: string;
//   phone: string;
//   storeUrl: string;
//   stampImageUrl: string;
//   storeImageUrl: string;
//   reward: string;
//   stampReward: string; // 예: "스탬프 10개 적립 시 무료 음료 제공"
//   sns: string;
// }

// export const StampRegistration4 = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // 이전 페이지(StampRegistration1)에서 전달받은 state (storeId, storeName 필수)
//   // 예: navigate('/StampRegistration4', { state: { storeId: 12, storeName: '카페나무' } })
//   const { storeId, storeName } = location.state || {};

//   // State 관리
//   const [storeInfo, setStoreInfo] = useState<StoreDetailData | null>(null);
//   const [loading, setLoading] = useState(true);

//   // 스탬프 더미 데이터 (API에 현재 적립된 스탬프 개수가 없으므로 일단 0개로 처리하거나 더미 유지)
//   // 현재는 모두 false(빈 스탬프)로 설정. 추후 사용자 스탬프 조회 API가 있다면 연동 필요.
//   const stamps = Array(10).fill(false);

//   useEffect(() => {
//     // storeName이나 storeId가 없으면 뒤로 가기
//     if (!storeName || !storeId) {
//       alert('잘못된 접근입니다.');
//       navigate(-1);
//       return;
//     }

//     const fetchStoreDetail = async () => {
//       try {
//         const token = localStorage.getItem('accessToken');

//         // GET 요청: 검색 API 호출
//         const response = await axios.get(`${apiUri}/v1/stores/search`, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { storeName: storeName }, // 검색어로 요청
//         });

//         // API 응답은 배열 형태이므로, storeId가 일치하는 항목을 찾음
//         const searchResults: StoreDetailData[] = response.data;
//         const targetStore = searchResults.find(
//           (item) => item.storeId === storeId
//         );

//         if (targetStore) {
//           setStoreInfo(targetStore);
//         } else {
//           // 이름으로 검색했으나 ID가 일치하는게 없는 경우 (혹은 첫번째 데이터 사용)
//           console.warn(
//             '일치하는 매장 ID를 찾을 수 없어 첫 번째 결과를 표시합니다.'
//           );
//           setStoreInfo(searchResults[0] || null);
//         }
//       } catch (error) {
//         console.error('매장 상세 정보 로딩 실패:', error);
//         // 에러 처리 로직 (예: alert)
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStoreDetail();
//   }, [storeId, storeName, navigate]);

//   // 로딩 중 표시
//   if (loading) {
//     return (
//       <div className="w-[430px] min-h-screen bg-white flex items-center justify-center mx-auto">
//         <p className="text-gray-400">매장 정보를 불러오는 중...</p>
//       </div>
//     );
//   }

//   // 데이터가 없을 경우
//   if (!storeInfo) {
//     return (
//       <div className="w-[430px] min-h-screen bg-white flex items-center justify-center mx-auto">
//         <div className="text-center">
//           <p className="text-gray-800 mb-4">매장 정보를 찾을 수 없습니다.</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 bg-orange-500 text-white rounded-lg"
//           >
//             뒤로 가기
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-[430px] min-h-screen bg-white flex flex-col mx-auto relative shadow-lg">
//       {/* 상단 영역 (스크롤 가능) */}
//       <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
//         {/* 1. 매장 이미지 헤더 */}
//         <div className="relative w-full h-60">
//           <img
//             src={storeInfo.storeImageUrl}
//             alt={storeInfo.storeName}
//             className="w-full h-full object-cover"
//             onError={(e) => {
//               (e.target as HTMLImageElement).src =
//                 'https://placehold.co/600x400?text=Store+Image';
//             }}
//           />
//           {/* 헤더 버튼들 */}
//           <div className="absolute top-4 left-4">
//             <BackButton />
//           </div>
//           <div className="absolute top-4 right-4 cursor-pointer">
//             <img
//               src={HeartShare}
//               alt="좋아요 공유"
//               className="w-20 h-auto object-contain"
//             />
//           </div>
//         </div>

//         {/* 2. 매장 정보 섹션 */}
//         <div className="px-6 pt-6 pb-4 bg-white">
//           <div className="flex items-end gap-2 mb-2">
//             <h1 className="text-2xl font-bold text-gray-900">
//               {storeInfo.storeName}
//             </h1>
//             <span className="text-sm text-gray-400 mb-1">
//               {storeInfo.category}
//             </span>
//           </div>
//           <p className="text-xs text-gray-400 mb-6">{storeInfo.storeAddress}</p>

//           {/* 연락처 정보 */}
//           <div className="border-t border-gray-100 pt-4 space-y-3">
//             {/* 전화번호 */}
//             <div className="flex items-center gap-3">
//               <img src={Phone} alt="전화" className="w-4 h-4 opacity-60" />
//               <span className="text-sm text-gray-600">
//                 {storeInfo.phone || '전화번호 없음'}
//               </span>
//             </div>

//             {/* 웹사이트 (storeUrl) */}
//             <div className="flex items-center gap-3">
//               <img
//                 src={internet}
//                 alt="웹사이트"
//                 className="w-4 h-4 opacity-60"
//               />
//               <a
//                 href={storeInfo.storeUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-sm text-gray-600 hover:text-orange-500 truncate max-w-[250px]"
//               >
//                 {storeInfo.storeUrl || '웹사이트 없음'}
//               </a>
//             </div>

//             {/* SNS */}
//             <div className="flex items-center gap-3">
//               <img src={instagram} alt="SNS" className="w-4 h-4 opacity-60" />
//               <span className="text-sm text-gray-600">
//                 {storeInfo.sns || 'SNS 정보 없음'}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* 3. 스탬프 섹션 (회색 배경) */}
//         <div className="bg-[#F6F6F6] px-6 py-6 min-h-[300px]">
//           <h2 className="text-[#8C7E74] font-bold mb-4 text-lg">Stamp</h2>

//           {/* 스탬프 카드 */}
//           <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center">
//             <div className="grid grid-cols-5 gap-x-4 gap-y-6 mb-6">
//               {stamps.map((isFilled, index) => (
//                 <div key={index} className="flex items-center justify-center">
//                   <img
//                     src={gift}
//                     alt="스탬프"
//                     className={`w-6 h-6 object-contain ${
//                       isFilled ? '' : 'opacity-30 grayscale'
//                     }`}
//                   />
//                 </div>
//               ))}
//             </div>

//             {/* 말풍선 텍스트 (API의 stampReward 사용) */}
//             <div className="bg-gray-200 px-3 py-1 rounded-full text-[10px] text-gray-600 font-medium mb-2 text-center">
//               {storeInfo.stampReward || '스탬프를 모아 혜택을 받으세요!'}
//             </div>
//           </div>

//           {/* 리워드 정보 (API의 reward 사용) */}
//           <div className="flex items-center justify-center gap-2 mt-6 text-gray-500 text-sm font-medium">
//             <img
//               src={gift}
//               alt="리워드"
//               className="w-[18px] h-[18px] object-contain"
//             />
//             <span>리워드 보상: {storeInfo.reward}</span>
//           </div>

//           {/* 등록하기 버튼 */}
//           <div className="mt-8 mb-4">
//             <button
//               className="w-full bg-[#FF6B00] text-white py-4 rounded-full font-bold text-lg shadow-md hover:bg-orange-600 transition-colors"
//               onClick={() => {
//                 // 등록 로직 구현 필요 (예: POST /stamps/register)
//                 alert('스탬프 등록 기능은 백엔드 로직에 맞춰 구현해야 합니다.');
//               }}
//             >
//               스탬프 등록하기
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* 하단 네비게이션 바 (고정) */}
//       <UserBottomBar />
//     </div>
//   );
// };

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserBottomBar } from '../../components/UserBottomBar';
import BackButton from '../../components/BackButton';
// 이미지 import
import HeartShare from '../../assets/heart_share.png';
import Phone from '../../assets/phone_icon.png';
import instagram from '../../assets/instagram_icon.png';
import internet from '../../assets/internet_icon.png';
import gift from '../../assets/gift_icon.png';

// API 기본 주소
const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

// 1. 매장 상세 정보 타입 (GET /v1/stores/search)
interface StoreDetailData {
  storeId: number;
  storeName: string;
  storeAddress: string;
  category: string;
  phone: string;
  storeUrl: string;
  stampImageUrl: string;
  storeImageUrl: string;
  reward: string;
  stampReward: string;
  sns: string;
}

// 2. 스탬프 등록 응답 타입 (POST /v1/stamps)
interface StampRegistrationResponse {
  userId: number;
  storeId: number;
  stampId: number;
  storeName: string;
  reward: string;
  currentCount: number;
  maxCount: number;
}

export const StampRegistration4 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 이전 페이지에서 전달받은 state
  const { storeId, storeName } = location.state || {};

  // State 관리
  const [storeInfo, setStoreInfo] = useState<StoreDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  // 스탬프 더미 데이터 (상세 조회 시점에는 내 스탬프 개수를 모르므로 빈 상태로 표시)
  const stamps = Array(10).fill(false);

  // ----------------------------------------------------------------
  // 1. 매장 상세 정보 조회 (기존 로직)
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!storeName || !storeId) {
      alert('잘못된 접근입니다.');
      navigate(-1);
      return;
    }

    const fetchStoreDetail = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        // GET 요청: 매장 검색
        const response = await axios.get(`${apiUri}/v1/stores/search`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { storeName: storeName },
        });

        const searchResults: StoreDetailData[] = response.data;
        const targetStore = searchResults.find(
          (item) => item.storeId === storeId
        );

        if (targetStore) {
          setStoreInfo(targetStore);
        } else {
          console.warn(
            '일치하는 매장 ID를 찾을 수 없어 첫 번째 결과를 표시합니다.'
          );
          setStoreInfo(searchResults[0] || null);
        }
      } catch (error) {
        console.error('매장 상세 정보 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreDetail();
  }, [storeId, storeName, navigate]);

  // ----------------------------------------------------------------
  // 2. 스탬프 등록 핸들러 (POST /v1/stamps)
  // ----------------------------------------------------------------
  const handleRegisterStamp = async () => {
    if (!storeInfo) return;

    try {
      const token = localStorage.getItem('accessToken');

      // POST 요청
      const response = await axios.post<StampRegistrationResponse>(
        `${apiUri}/v1/stamps`,
        {
          storeId: storeInfo.storeId, // Request Body
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data;

      // 성공 알림
      alert(
        `[${data.storeName}] 스탬프 카드가 등록되었습니다!\n` +
          `보상: ${data.reward}\n` +
          `현재 스탬프: ${data.currentCount}/${data.maxCount}`
      );

      // 등록 성공 후 이동 (예: 메인 페이지 혹은 스탬프 목록 페이지)
      // navigate('/StampList'); // 필요 시 주석 해제하여 사용
      navigate('/stampsetting'); // 일단 메인으로 이동
    } catch (error) {
      console.error('스탬프 등록 실패:', error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          alert('이미 등록된 스탬프 카드입니다.');
        } else {
          alert('스탬프 등록 중 오류가 발생했습니다.');
        }
      }
    }
  };

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="w-[430px] min-h-screen bg-white flex items-center justify-center mx-auto">
        <p className="text-gray-400">매장 정보를 불러오는 중...</p>
      </div>
    );
  }

  // 데이터가 없을 경우
  if (!storeInfo) {
    return (
      <div className="w-[430px] min-h-screen bg-white flex items-center justify-center mx-auto">
        <div className="text-center">
          <p className="text-gray-800 mb-4">매장 정보를 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[430px] min-h-screen bg-white flex flex-col mx-auto relative shadow-lg">
      {/* 상단 영역 (스크롤 가능) */}
      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        {/* 1. 매장 이미지 헤더 */}
        <div className="relative w-full h-60">
          <img
            src={storeInfo.storeImageUrl}
            alt={storeInfo.storeName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://placehold.co/600x400?text=Store+Image';
            }}
          />
          {/* 헤더 버튼들 */}
          <div className="absolute top-4 left-4">
            <BackButton />
          </div>
          <div className="absolute top-4 right-4 cursor-pointer">
            <img
              src={HeartShare}
              alt="좋아요 공유"
              className="w-20 h-auto object-contain"
            />
          </div>
        </div>

        {/* 2. 매장 정보 섹션 */}
        <div className="px-6 pt-6 pb-4 bg-white">
          <div className="flex items-end gap-2 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {storeInfo.storeName}
            </h1>
            <span className="text-sm text-gray-400 mb-1">
              {storeInfo.category}
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-6">{storeInfo.storeAddress}</p>

          {/* 연락처 정보 */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            {/* 전화번호 */}
            <div className="flex items-center gap-3">
              <img src={Phone} alt="전화" className="w-4 h-4 opacity-60" />
              <span className="text-sm text-gray-600">
                {storeInfo.phone || '전화번호 없음'}
              </span>
            </div>

            {/* 웹사이트 (storeUrl) */}
            <div className="flex items-center gap-3">
              <img
                src={internet}
                alt="웹사이트"
                className="w-4 h-4 opacity-60"
              />
              <a
                href={storeInfo.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-orange-500 truncate max-w-[250px]"
              >
                {storeInfo.storeUrl || '웹사이트 없음'}
              </a>
            </div>

            {/* SNS */}
            <div className="flex items-center gap-3">
              <img src={instagram} alt="SNS" className="w-4 h-4 opacity-60" />
              <span className="text-sm text-gray-600">
                {storeInfo.sns || 'SNS 정보 없음'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. 스탬프 섹션 (회색 배경) */}
        <div className="bg-[#F6F6F6] px-6 py-6 min-h-[300px]">
          <h2 className="text-[#8C7E74] font-bold mb-4 text-lg">Stamp</h2>

          {/* 스탬프 카드 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center">
            <div className="grid grid-cols-5 gap-x-4 gap-y-6 mb-6">
              {stamps.map((isFilled, index) => (
                <div key={index} className="flex items-center justify-center">
                  <img
                    src={gift}
                    alt="스탬프"
                    className={`w-6 h-6 object-contain ${
                      isFilled ? '' : 'opacity-30 grayscale'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* 말풍선 텍스트 (API의 stampReward 사용) */}
            <div className="bg-gray-200 px-3 py-1 rounded-full text-[10px] text-gray-600 font-medium mb-2 text-center">
              {storeInfo.stampReward || '스탬프를 모아 혜택을 받으세요!'}
            </div>
          </div>

          {/* 리워드 정보 (API의 reward 사용) */}
          <div className="flex items-center justify-center gap-2 mt-6 text-gray-500 text-sm font-medium">
            <img
              src={gift}
              alt="리워드"
              className="w-[18px] h-[18px] object-contain"
            />
            <span>리워드 보상: {storeInfo.reward}</span>
          </div>

          {/* 등록하기 버튼 */}
          <div className="mt-8 mb-4">
            <button
              className="w-full bg-[#FF6B00] text-white py-4 rounded-full font-bold text-lg shadow-md hover:bg-orange-600 transition-colors"
              onClick={handleRegisterStamp} // 핸들러 연결
            >
              스탬프 등록하기
            </button>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 바 (고정) */}
      <UserBottomBar />
    </div>
  );
};
