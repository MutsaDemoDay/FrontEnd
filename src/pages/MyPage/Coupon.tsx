// import React, { useState, useRef, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import BackButton from '../../components/BackButton';
// import { UserBottomBar } from '../../components/UserBottomBar';

// // CouponBox에서 정의된 인터페이스 재사용
// interface CouponData {
//   userId: number;
//   storeId: number;
//   couponId: number;
//   couponName: string;
//   expiredDate: string;
//   used: boolean;
// }

// // 환경변수가 없으면 로컬 주소 사용
// const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

// const Coupon: React.FC = () => {
//   const { couponId } = useParams<{ couponId: string }>();
//   const navigate = useNavigate();
//   const [code, setCode] = useState<string>('');
//   const [couponData, setCouponData] = useState<CouponData | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [isConfirming, setIsConfirming] = useState<boolean>(false);
//   const [confirmMessage, setConfirmMessage] = useState<string | null>(null);

//   const inputRef = useRef<HTMLInputElement>(null);

//   // 날짜 포맷팅 함수
//   const formatDate = (isoString: string) => {
//     const date = new Date(isoString);
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}.${month}.${day}까지`;
//   };

//   // 1. API 데이터 가져오기 (GET)
//   useEffect(() => {
//     if (!couponId) {
//       console.error('Coupon ID is missing.');
//       setLoading(false);
//       return;
//     }

//     const fetchCouponDetail = async () => {
//       try {
//         const token = localStorage.getItem('accessToken');
//         // GET API는 이전처럼 Path Variable 사용
//         const response = await fetch(`${apiUri}/v1/coupons/${couponId}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error('쿠폰 상세 정보를 불러오는데 실패했습니다.');
//         }

//         const jsonResponse = await response.json();
//         if (jsonResponse.data) {
//           setCouponData(jsonResponse.data);
//         } else {
//           console.error('응답 데이터 구조가 예상과 다릅니다.', jsonResponse);
//         }
//       } catch (error) {
//         console.error('API Error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCouponDetail();
//   }, [couponId]);

//   // 2. 쿠폰 사용 완료 API 호출 함수 (POST)
//   const handleCouponConfirm = async (verificationCode: string) => {
//     if (isConfirming || !couponId || couponData?.used) return;

//     setIsConfirming(true);
//     setConfirmMessage(null);

//     // 🚨 스웨거 명세에 따라 Query Parameter로 verificationCode를 전송합니다.
//     const urlWithQuery = `${apiUri}/v1/coupons/${couponId}/confirm?verificationCode=${verificationCode}`;

//     try {
//       const token = localStorage.getItem('accessToken');

//       const response = await fetch(urlWithQuery, {
//         method: 'POST',
//         headers: {
//           // POST이지만 Request Body가 없으므로 Content-Type: application/json은 필수는 아님
//           // Authorization 헤더는 유지
//           Authorization: `Bearer ${token}`,
//         },
//         // Request Body는 전송하지 않음!
//       });

//       const textResponse = await response.text();
//       const jsonResponse = textResponse ? JSON.parse(textResponse) : {}; // 응답이 비어있을 수 있으므로 처리

//       if (!response.ok || jsonResponse.code !== 0) {
//         console.error(
//           `Coupon Confirm failed with status ${response.status}:`,
//           jsonResponse
//         );

//         // API에서 오류 메시지 반환
//         const errorMessage =
//           jsonResponse.message ||
//           `쿠폰 사용 처리 중 오류가 발생했습니다. (HTTP ${response.status})`;
//         setConfirmMessage(`❌ 오류: ${errorMessage}`);
//         setCode(''); // 오류 시 코드 초기화
//         return;
//       }

//       // 성공적으로 사용 처리됨
//       setCouponData((prev) => (prev ? { ...prev, used: true } : null));
//       setCode(''); // 코드 초기화
//     } catch (error) {
//       console.error('Coupon Confirm API Error:', error);
//       setConfirmMessage(
//         '❌ 네트워크 오류 또는 알 수 없는 오류가 발생했습니다.'
//       );
//     } finally {
//       setIsConfirming(false);
//     }
//   };

//   // 쿠폰함으로 돌아가기
//   const handleGoBackToCouponBox = () => {
//     navigate('/mypage/couponbox');
//   };

//   // 3. 입력 컨테이너 클릭 시 숨겨진 input에 포커스
//   const handleContainerClick = () => {
//     if (couponData?.used || isConfirming) return;
//     inputRef.current?.focus();
//   };

//   // 4. 입력 값 변경 핸들러 (숫자만 입력 가능, 최대 4글자)
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.replace(/[^0-9]/g, '');

//     if (couponData?.used || isConfirming) return;

//     if (value.length <= 4) {
//       setCode(value);

//       // 4자리가 모두 입력되었을 때 API 호출
//       if (value.length === 4) {
//         console.log('입력 완료. 쿠폰 사용 처리 시작:', value);
//         handleCouponConfirm(value);
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         로딩 중...
//       </div>
//     );
//   }

//   if (!couponData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         쿠폰 정보를 찾을 수 없습니다.
//       </div>
//     );
//   }

//   // 성공 UI를 위한 별도의 컴포넌트 또는 렌더링 블록
//   const SuccessUI = (
//     <>
//       <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-20">
//         <h2 className="text-xl font-bold text-gray-800 mb-2">
//           쿠폰 사용 성공!
//         </h2>
//         <p className="text-sm text-gray-500 mb-10">
//           달성한 스탬프판은 자동삭제되고
//           <br />
//           히스토리 기록에서 볼 수 있어요.
//         </p>

//         {/* 성공 아이콘 */}
//         <div className="w-full mr-2 ml-2 max-w-xs bg-white rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.05)] p-8 mb-12 border border-gray-50 flex items-center justify-center h-32">
//           {/* SVG 체크 아이콘 (이미지의 초록색 체크마크 대체) */}
//           <svg
//             className="w-16 h-16 text-green-500"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//             ></path>
//           </svg>
//         </div>

//         {/* 하단 정보 */}
//         <div className="space-y-2">
//           <h3 className="text-gray-800 font-bold text-base">
//             {couponData.couponName}
//           </h3>
//           <p className="text-xs text-gray-400 leading-relaxed">
//             스탬프를 다 채워 달성한
//             <br />
//             리워드 쿠폰입니다.
//           </p>
//           <p className="text-sm text-blue-500 font-semibold pt-1">
//             기한: **{formatDate(couponData.expiredDate)}**
//           </p>
//         </div>
//       </div>

//       {/* 쿠폰함 돌아가기 버튼 */}
//       <footer className="p-6">
//         <button
//           onClick={handleGoBackToCouponBox}
//           className="w-full py-4 text-white font-bold rounded-xl bg-orange-500 hover:bg-orange-600 transition-colors"
//         >
//           쿠폰함 돌아가기
//         </button>
//       </footer>
//     </>
//   );

//   // 입력 UI를 위한 별도의 렌더링 블록
//   const InputUI = (
//     <>
//       {/* 입력 유도 메시지 */}
//       <h2 className="text-xl font-bold text-gray-800 mb-10 leading-snug">
//         {isConfirming ? (
//           <span className="text-orange-500">사용 처리 중입니다...</span>
//         ) : (
//           <>
//             매장 직원이 **확인코드를**
//             <br />
//             누르게 해주세요.
//           </>
//         )}
//       </h2>

//       {/* API 호출 결과 메시지 */}
//       {confirmMessage && (
//         <p
//           className={`mb-4 text-sm font-semibold ${
//             confirmMessage.startsWith('✅') ? 'text-green-600' : 'text-red-600'
//           }`}
//         >
//           {confirmMessage}
//         </p>
//       )}

//       {/* 실제 입력을 받는 숨겨진 Input */}
//       <input
//         ref={inputRef}
//         type="tel"
//         value={code}
//         onChange={handleChange}
//         className={`absolute opacity-0 w-1 h-1 ${
//           isConfirming ? 'pointer-events-none' : ''
//         }`}
//         maxLength={4}
//         disabled={isConfirming}
//       />

//       {/* 확인 코드 입력 박스 (클릭 시 input에 포커스) */}
//       <div
//         onClick={handleContainerClick}
//         className={`w-full mr-2 ml-2 max-w-xs bg-white rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.05)] p-8 mb-12 border border-gray-50 cursor-pointer
//             ${isConfirming ? 'animate-pulse' : ''}
//           `}
//       >
//         <div className="flex justify-between items-center">
//           {/* 4개의 입력 칸을 반복문으로 렌더링 */}
//           {[0, 1, 2, 3].map((index) => {
//             const isFocused = index === code.length && !isConfirming;

//             return (
//               <div
//                 key={index}
//                 className={`
//                                 w-12 h-16 rounded-lg flex items-center justify-center text-2xl transition-all duration-200
//                                 ${
//                                   isFocused
//                                     ? 'border-2 border-orange-400 bg-white'
//                                     : 'border border-gray-300 bg-white'
//                                 }
//                               `}
//               >
//                 {/* 입력된 값은 '*'로 표시 */}
//                 {index < code.length ? (
//                   <span className="text-gray-400 text-3xl pt-2">*</span>
//                 ) : (
//                   ''
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* 하단 정보 */}
//       <div className="space-y-2">
//         <h3 className="text-gray-800 font-bold text-base">
//           {couponData.couponName}
//         </h3>
//         <p className="text-xs text-gray-400 leading-relaxed">
//           스탬프를 다 채워 달성한
//           <br />
//           리워드 쿠폰입니다.
//         </p>
//         <p className="text-sm text-blue-500 font-semibold pt-1">
//           기한: **{formatDate(couponData.expiredDate)}**
//         </p>
//       </div>
//     </>
//   );

//   return (
//     <div className="min-h-screen bg-white text-gray-900 flex flex-col">
//       {/* 헤더 */}
//       <header
//         className={`flex items-center p-4 h-14 ${
//           couponData.used ? '' : 'border-b border-gray-100'
//         }`}
//       >
//         <BackButton />
//       </header>

//       <div className="flex-1 flex flex-col justify-between">
//         {/* 쿠폰 사용 여부에 따라 다른 UI 렌더링 */}
//         {couponData.used ? (
//           // 1. 사용 성공 시 (첨부된 이미지 UI)
//           SuccessUI
//         ) : (
//           // 2. 사용 전 (입력 UI)
//           <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-20">
//             {InputUI}
//           </main>
//         )}
//       </div>

//       {/* 사용 완료 페이지에서는 UserBottomBar를 렌더링하지 않음 */}
//       {!couponData.used && <UserBottomBar />}
//     </div>
//   );
// };

// export default Coupon;

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { UserBottomBar } from '../../components/UserBottomBar';

// CouponBox에서 정의된 인터페이스 재사용
interface CouponData {
  userId: number;
  storeId: number;
  couponId: number;
  couponName: string;
  expiredDate: string;
  used: boolean;
}

// 환경변수가 없으면 로컬 주소 사용
const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

const Coupon: React.FC = () => {
  const { couponId } = useParams<{ couponId: string }>();
  const navigate = useNavigate();
  const [code, setCode] = useState<string>('');
  const [couponData, setCouponData] = useState<CouponData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // 날짜 포맷팅 함수
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}까지`;
  };

  // 1. API 데이터 가져오기 (GET)
  useEffect(() => {
    if (!couponId) {
      console.error('Coupon ID is missing.');
      setLoading(false);
      return;
    }

    const fetchCouponDetail = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${apiUri}/v1/coupons/${couponId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('쿠폰 상세 정보를 불러오는데 실패했습니다.');
        }

        const jsonResponse = await response.json();
        if (jsonResponse.data) {
          setCouponData(jsonResponse.data);
        } else {
          console.error('응답 데이터 구조가 예상과 다릅니다.', jsonResponse);
        }
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCouponDetail();
  }, [couponId]);

  // 2. 쿠폰 사용 완료 API 호출 함수 (POST)
  const handleCouponConfirm = async (verificationCode: string) => {
    if (isConfirming || !couponId || couponData?.used) return;

    setIsConfirming(true);
    setConfirmMessage(null);

    // 🚨 스웨거 명세에 따라 Query Parameter로 verificationCode를 전송합니다.
    const urlWithQuery = `${apiUri}/v1/coupons/${couponId}/confirm?verificationCode=${verificationCode}`;

    try {
      const token = localStorage.getItem('accessToken');

      const response = await fetch(urlWithQuery, {
        method: 'POST',
        headers: {
          // Request Body가 없으므로 Content-Type은 제거합니다.
          Authorization: `Bearer ${token}`,
        },
      });

      const textResponse = await response.text();
      const jsonResponse = textResponse ? JSON.parse(textResponse) : {};

      // 🚨 최종 수정: HTTP OK(200)이고 API 응답 코드가 100일 때 성공으로 처리합니다.
      if (!response.ok || jsonResponse.code !== 100) {
        console.error(
          `Coupon Confirm failed with status ${response.status}:`,
          jsonResponse
        );

        // API에서 오류 메시지 반환
        const errorMessage =
          jsonResponse.message ||
          `쿠폰 사용 처리 중 오류가 발생했습니다. (HTTP ${response.status} / Code: ${jsonResponse.code})`;
        setConfirmMessage(`❌ 오류: ${errorMessage}`);
        setCode(''); // 오류 시 코드 초기화
        return;
      }

      // 성공적으로 사용 처리됨 (jsonResponse.code === 100)
      setCouponData((prev) => (prev ? { ...prev, used: true } : null));
      setCode(''); // 코드 초기화
    } catch (error) {
      console.error('Coupon Confirm API Error:', error);
      setConfirmMessage(
        '❌ 네트워크 오류 또는 알 수 없는 오류가 발생했습니다.'
      );
    } finally {
      setIsConfirming(false);
    }
  };

  // 쿠폰함으로 돌아가기
  const handleGoBackToCouponBox = () => {
    navigate('/mypage/couponbox');
  };

  // 3. 입력 컨테이너 클릭 시 숨겨진 input에 포커스
  const handleContainerClick = () => {
    if (couponData?.used || isConfirming) return;
    inputRef.current?.focus();
  };

  // 4. 입력 값 변경 핸들러 (숫자만 입력 가능, 최대 4글자)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');

    if (couponData?.used || isConfirming) return;

    if (value.length <= 4) {
      setCode(value);

      // 4자리가 모두 입력되었을 때 API 호출
      if (value.length === 4) {
        console.log('입력 완료. 쿠폰 사용 처리 시작:', value);
        handleCouponConfirm(value);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        로딩 중...
      </div>
    );
  }

  if (!couponData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        쿠폰 정보를 찾을 수 없습니다.
      </div>
    );
  }

  // 성공 UI를 위한 별도의 컴포넌트 또는 렌더링 블록
  const SuccessUI = (
    <>
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-20">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          쿠폰 사용 성공!
        </h2>
        <p className="text-sm text-gray-500 mb-10">
          달성한 스탬프판은 자동삭제되고
          <br />
          히스토리 기록에서 볼 수 있어요.
        </p>

        {/* 성공 아이콘 */}
        <div className="w-full mr-2 ml-2 max-w-xs bg-white rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.05)] p-8 mb-12 border border-gray-50 flex items-center justify-center h-32">
          {/* SVG 체크 아이콘 (이미지의 초록색 체크마크 대체) */}
          <svg
            className="w-16 h-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>

        {/* 하단 정보 */}
        <div className="space-y-2">
          <h3 className="text-gray-800 font-bold text-base">
            {couponData.couponName}
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            스탬프를 다 채워 달성한
            <br />
            리워드 쿠폰입니다.
          </p>
          <p className="text-sm text-blue-500 font-semibold pt-1">
            기한: **{formatDate(couponData.expiredDate)}**
          </p>
        </div>
      </div>

      {/* 쿠폰함 돌아가기 버튼 */}
      <footer className="p-6">
        <button
          onClick={handleGoBackToCouponBox}
          className="w-full py-4 text-white font-bold rounded-xl bg-orange-500 hover:bg-orange-600 transition-colors"
        >
          쿠폰함 돌아가기
        </button>
      </footer>
    </>
  );

  // 입력 UI를 위한 별도의 렌더링 블록
  const InputUI = (
    <>
      {/* 입력 유도 메시지 */}
      <h2 className="text-xl font-bold text-gray-800 mb-10 leading-snug">
        {isConfirming ? (
          <span className="text-orange-500">사용 처리 중입니다...</span>
        ) : (
          <>
            매장 직원이 **확인코드를**
            <br />
            누르게 해주세요.
          </>
        )}
      </h2>

      {/* API 호출 결과 메시지 */}
      {confirmMessage && (
        <p
          className={`mb-4 text-sm font-semibold ${
            confirmMessage.startsWith('✅') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {confirmMessage}
        </p>
      )}

      {/* 실제 입력을 받는 숨겨진 Input */}
      <input
        ref={inputRef}
        type="tel"
        value={code}
        onChange={handleChange}
        className={`absolute opacity-0 w-1 h-1 ${
          isConfirming ? 'pointer-events-none' : ''
        }`}
        maxLength={4}
        disabled={isConfirming}
      />

      {/* 확인 코드 입력 박스 (클릭 시 input에 포커스) */}
      <div
        onClick={handleContainerClick}
        className={`w-full mr-2 ml-2 max-w-xs bg-white rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.05)] p-8 mb-12 border border-gray-50 cursor-pointer 
            ${isConfirming ? 'animate-pulse' : ''}
          `}
      >
        <div className="flex justify-between items-center">
          {/* 4개의 입력 칸을 반복문으로 렌더링 */}
          {[0, 1, 2, 3].map((index) => {
            const isFocused = index === code.length && !isConfirming;

            return (
              <div
                key={index}
                className={`
                                w-12 h-16 rounded-lg flex items-center justify-center text-2xl transition-all duration-200
                                ${
                                  isFocused
                                    ? 'border-2 border-orange-400 bg-white'
                                    : 'border border-gray-300 bg-white'
                                }
                              `}
              >
                {/* 입력된 값은 '*'로 표시 */}
                {index < code.length ? (
                  <span className="text-gray-400 text-3xl pt-2">*</span>
                ) : (
                  ''
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 하단 정보 */}
      <div className="space-y-2">
        <h3 className="text-gray-800 font-bold text-base">
          {couponData.couponName}
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          스탬프를 다 채워 달성한
          <br />
          리워드 쿠폰입니다.
        </p>
        <p className="text-sm text-blue-500 font-semibold pt-1">
          기한: **{formatDate(couponData.expiredDate)}**
        </p>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* 헤더 */}
      <header
        className={`flex items-center p-4 h-14 ${
          couponData.used ? '' : 'border-b border-gray-100'
        }`}
      >
        <BackButton />
      </header>

      <div className="flex-1 flex flex-col justify-between">
        {/* 쿠폰 사용 여부에 따라 다른 UI 렌더링 */}
        {couponData.used ? (
          // 1. 사용 성공 시 (첨부된 이미지 UI)
          SuccessUI
        ) : (
          // 2. 사용 전 (입력 UI)
          <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-20">
            {InputUI}
          </main>
        )}
      </div>

      {/* 사용 완료 페이지에서는 UserBottomBar를 렌더링하지 않음 */}
      {!couponData.used && <UserBottomBar />}
    </div>
  );
};

export default Coupon;
