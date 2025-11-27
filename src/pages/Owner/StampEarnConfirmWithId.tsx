import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BackButton3 } from '../../components/BackButton3';
import { fetchStoreName } from '../../api/Stats';
import { useQuery } from '@tanstack/react-query';

export const StampEarnConfirmWithId = () => {
  // 라우터 설정이 path="/stamp-earn/confirm/:loginId" 로 되어 있어야 값이 들어옵니다.
  const { loginId } = useParams<{ loginId: string }>();
  const navigate = useNavigate();
  const apiUri = import.meta.env.VITE_API_URI; 

  const [stampCount, setStampCount] = useState(1);

  // 1. 가게 이름 조회 (API 호출 시 storeName이 필요하므로 유지)
  const { data: storeName, isLoading: isStoreLoading } = useQuery({
    queryKey: ['storeName'],
    queryFn: fetchStoreName,
  });

  const handleIncrease = () => setStampCount((prev) => prev + 1);
  const handleDecrease = () => setStampCount((prev) => (prev > 1 ? prev - 1 : 1));

  const handleConfirm = async () => {
    if (!storeName || !loginId) {
      alert("가게 정보나 회원 ID가 올바르지 않습니다.");
      return;
    }

    try {
      const baseUrl = `${apiUri}/v1/manager/addByNum`;
      
      // Query String 수동 생성 (명시적으로 확인 가능)
      const queryParams = `?storeName=${encodeURIComponent(storeName)}&loginId=${encodeURIComponent(loginId)}&stampCount=${stampCount}`;
      const fullUrl = baseUrl + queryParams;

      // Request Body는 빈 객체 {} 로 설정
      await axios.post(
        fullUrl,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      // 성공 시 알림 (닉네임 없이 아이디로 안내)
      alert(`${loginId}님에게 스탬프 ${stampCount}개가 적립되었습니다.`);
      navigate('/owner/manage'); 
    } catch (error) {
      console.error('적립 실패:', error);
      alert('적립에 실패했습니다. 아이디를 확인하거나 잠시 후 다시 시도해주세요.');
    }
  };

  // 가게 이름 로딩 중일 때 처리
  if (isStoreLoading) {
    return <div className="p-4 mt-20 text-center">정보를 불러오는 중입니다...</div>;
  }

  // URL 파라미터로 ID가 제대로 안 넘어왔을 경우 (방어 코드)
  if (!loginId) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white p-4">
        <p className="text-lg text-red-500 mb-4">
          회원 아이디가 전달되지 않았습니다.
        </p>
        <button
          onClick={() => navigate(-1)} 
          className="w-full h-[50px] bg-[var(--fill-color2)] rounded-[40px] font-medium"
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* 헤더 */}
      <div className="p-4">
        <BackButton3 />
        <h1 className="text-[20px] font-medium text-black mt-20 mb-10">
          다음 회원에게 적립하시겠습니까?
        </h1>
      </div>

      {/* 정보 표시 */}
      <div className="w-full px-6 text-[16px]">
        
        {/* 닉네임 표시 영역 삭제됨 */}

        {/* 아이디 표시 */}
        <div className="flex py-4 border-b border-gray-100">
          <span className="w-24 text-[var(--fill-color6)]">아이디:</span>
          <span className="font-medium text-black">{loginId}</span>
        </div>

        {/* 스탬프 개수 조절 */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <span className="text-[var(--fill-color6)]">스탬프 개수:</span>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDecrease}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer"
            >
              -
            </button>
            <span className="text-lg font-medium w-4 text-center">
              {stampCount}
            </span>
            <button
              onClick={handleIncrease}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-10 left-4 right-4 pb-8 flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 h-[50px] bg-[var(--fill-color2)] text-black rounded-[40px] text-[16px] font-medium cursor-pointer"
        >
          취소
        </button>
        <button
          onClick={handleConfirm}
          className="flex-1 h-[50px] bg-[#FF6B00] text-white rounded-[40px] text-[16px] font-medium cursor-pointer"
        >
          확인
        </button>
      </div>
    </div>
  );
};


// import { useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { BackButton3 } from '../../components/BackButton3';
// import { fetchStoreName } from '../../api/Stats';
// import { useQuery } from '@tanstack/react-query';

// // [API] 로그인 아이디로 유저 정보 조회
// // 이 부분은 API 경로가 없으므로 기존 로직 유지 (mock/실제 API 경로에 따라)
// const fetchUserInfo = async (loginId: string) => {
//   // 실제 API 경로에 맞게 수정해주세요 (예: GET /v1/users/info?loginId=user1234)
//   const apiUri = import.meta.env.VITE_API_URI;
//   const response = await axios.get(`${apiUri}/v1/users/info`, {
//     params: { loginId: loginId },
//   });
//   return response.data;
// };

// export const StampEarnConfirmWithId = () => {
//   const { loginId } = useParams<{ loginId: string }>();
//   const navigate = useNavigate();
//   const apiUri = import.meta.env.VITE_API_URI; // 기본 API URI (https://daango.store/api/v1 등)

//   const [stampCount, setStampCount] = useState(1);

//   // 1. 가게 이름 조회
//   const { data: storeName } = useQuery({
//     queryKey: ['storeName'],
//     queryFn: fetchStoreName,
//   });

//   // 2. 유저 정보 조회
//   const {
//     data: userInfo,
//     isError,
//     isLoading,
//   } = useQuery({
//     queryKey: ['userInfo', loginId],
//     queryFn: () => fetchUserInfo(loginId!),
//     enabled: !!loginId,
//     retry: false,
//   });

//   const handleIncrease = () => setStampCount((prev) => prev + 1);
//   const handleDecrease = () =>
//     setStampCount((prev) => (prev > 1 ? prev - 1 : 1));

//   const handleConfirm = async () => {
//     if (!storeName || !loginId) return;

//     try {
//       const baseUrl = `${apiUri}/v1/manager/addByNum`;
//       const urlWithParams = `${baseUrl}?storeName=${encodeURIComponent(
//         storeName
//       )}&loginId=${encodeURIComponent(
//         loginId
//       )}&stampCount=${stampCount}`;

//       // request body는 없으므로 빈 객체 `{}` 전송
//       await axios.post(
//         urlWithParams,
//         {}, // request body가 없으므로 빈 객체
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//           },
//         }
//       );

//       alert(
//         `${
//           userInfo?.nickname || loginId
//         }님에게 스탬프 ${stampCount}개가 적립되었습니다.`
//       );
//       navigate('/owner/dashboard');
//     } catch (error) {
//       console.error('적립 실패:', error);
//       alert(
//         '적립에 실패했습니다. 아이디를 확인하거나 잠시 후 다시 시도해주세요.'
//       );
//     }
//   };

//   if (isLoading)
//     return <div className="p-4">회원 정보를 조회 중입니다...</div>;

//   if (isError || !userInfo) {
//     return (
//       <div className="w-full h-full flex flex-col mt-50 items-center justify-center bg-white p-4">
//         <p className="text-lg text-red-500 mb-4">
//           해당 아이디의 회원을 찾을 수 없습니다.
//         </p>
//         <p className="text-gray-500 mb-8">입력한 ID: {loginId}</p>
//         <button
//           onClick={() => navigate(-1)}
//           className="w-full h-[50px] bg-[var(--fill-color2)] rounded-[40px] font-medium"
//         >
//           다시 입력하기
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full h-full flex flex-col bg-white">
//       {/* 헤더 */}
//       <div className="p-4">
//         <BackButton3 />
//         <h1 className="text-[20px] font-medium text-black mt-20 mb-10">
//           다음 회원에게 적립하시겠습니까?
//         </h1>
//       </div>

//       {/* 정보 표시 */}
//       <div className="w-full px-6 text-[16px]">
//         <div className="flex py-4 border-b border-gray-100">
//           <span className="w-24 text-[var(--fill-color6)]">회원명:</span>
//           <span className="font-medium text-black">
//             {userInfo.nickname || '이름 없음'}
//           </span>
//         </div>

//         <div className="flex py-4 border-b border-gray-100">
//           <span className="w-24 text-[var(--fill-color6)]">아이디:</span>
//           <span className="font-medium text-black">{loginId}</span>
//         </div>

//         <div className="flex items-center justify-between py-4 border-b border-gray-100">
//           <span className="text-[var(--fill-color6)]">스탬프 개수:</span>
//           <div className="flex items-center gap-4">
//             <button
//               onClick={handleDecrease}
//               className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:bg-gray-50"
//             >
//               -
//             </button>
//             <span className="text-lg font-medium w-4 text-center">
//               {stampCount}
//             </span>
//             <button
//               onClick={handleIncrease}
//               className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:bg-gray-50"
//             >
//               +
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* 하단 버튼 */}
//       <div className="fixed bottom-10 left-4 right-4 pb-8 flex gap-3">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex-1 h-[50px] bg-[var(--fill-color2)] text-black rounded-[40px] text-[16px] font-medium"
//         >
//           취소
//         </button>
//         <button
//           onClick={handleConfirm}
//           className="flex-1 h-[50px] bg-[#FF6B00] text-white rounded-[40px] text-[16px] font-medium"
//         >
//           확인
//         </button>
//       </div>
//     </div>
//   );
// };