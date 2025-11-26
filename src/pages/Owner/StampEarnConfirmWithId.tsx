import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BackButton3 } from '../../components/BackButton3';
import { fetchStoreName } from '../../api/Stats';
import { useQuery } from '@tanstack/react-query';

// [추가] 로그인 아이디로 유저 닉네임을 조회하는 API 함수 예시
// 실제 API 경로에 맞춰 수정이 필요합니다.
const fetchUserInfo = async (loginId: string) => {
  const apiUri = import.meta.env.VITE_API_URI;
  // 예: GET /api/v1/users/check?loginId=user1234
  const response = await axios.get(`${apiUri}/v1/users/info`, {
    params: { loginId: loginId },
  });
  return response.data;
};

export const StampEarnConfirmWithId = () => {
  const { loginId } = useParams<{ loginId: string }>();
  const navigate = useNavigate();
  const apiUri = import.meta.env.VITE_API_URI;

  const [stampCount, setStampCount] = useState(1);

  // 1. 가게 이름 조회
  const { data: storeName } = useQuery({
    queryKey: ['storeName'],
    queryFn: fetchStoreName,
  });

  // 2. 입력받은 Login ID로 유저 정보(닉네임) 조회
  // 점주가 적립 대상을 눈으로 확인하기 위해 필요합니다.
  const {
    data: userInfo,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['userInfo', loginId],
    queryFn: () => fetchUserInfo(loginId!),
    enabled: !!loginId, // loginId가 있을 때만 실행
    retry: false, // 유저가 없으면 바로 에러 처리
  });

  const handleIncrease = () => setStampCount((prev) => prev + 1);
  const handleDecrease = () => setStampCount((prev) => (prev > 1 ? prev - 1 : 1));

  const handleConfirm = async () => {
    if (!storeName || !loginId) return;

    try {
      // API 요청: DB ID가 아닌 Login ID와 개수를 전송
      // 백엔드 엔드포인트가 loginId를 받을 수 있도록 구현되어 있어야 함
      await axios.post(
        `${apiUri}/api/v1/manager/addByNum`,
        {
          storeName: storeName,
          customerLoginId: loginId, // 변경된 부분: login ID 전송
          stampCount: stampCount,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      alert(
        `${
          userInfo?.nickname || loginId
        }님에게 스탬프 ${stampCount}개가 적립되었습니다.`
      );
      navigate('/owner/home'); // 적립 후 홈으로 이동
    } catch (error) {
      console.error('적립 실패:', error);
      alert(
        '적립에 실패했습니다. 아이디를 확인하거나 잠시 후 다시 시도해주세요.'
      );
    }
  };

  // 유저 조회 로딩 중이거나 에러 발생 시 처리
  if (isLoading) return <div className="p-4">회원 정보를 조회 중입니다...</div>;

  if (isError || !userInfo) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white p-4">
        <p className="text-lg text-red-500 mb-4">
          해당 아이디의 회원을 찾을 수 없습니다.
        </p>
        <p className="text-gray-500 mb-8">입력한 ID: {loginId}</p>
        <button
          onClick={() => navigate(-1)}
          className="w-full h-[50px] bg-[var(--fill-color2)] rounded-[40px] font-medium"
        >
          다시 입력하기
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* 상단 헤더 영역 */}
      <div className="p-4">
        <BackButton3 />
        <h1 className="text-[20px] font-medium text-black mt-30 mb-15">
          다음 회원에게 적립하시겠습니까?
        </h1>
      </div>

      {/* 정보 표시 영역 */}
      <div className="w-full px-6 text-[16px]">
        {/* 회원명 (API로 가져온 데이터 표시) */}
        <div className="flex py-4 border-b border-gray-100">
          <span className="w-24 text-[var(--fill-color6)]">회원명:</span>
          <span className="font-medium text-black">
            {userInfo.nickname || '이름 없음'}
          </span>
        </div>

        {/* 입력한 Login ID 표시 */}
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
            <span className="text-lg font-medium w-4 text-center">{stampCount}</span>
            <button
              onClick={handleIncrease}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="fixed bottom-10 left-4 right-4 pb-8 flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 h-[50px] bg-[var(--fill-color2)] text-black rounded-[40px] text-[16px] font-medium cursor-pointer"
        >
          취소
        </button>
        <button
          onClick={handleConfirm}
          className="flex-1 h-[50px] bg-[var(--main-color)] text-white rounded-[40px] text-[16px] font-medium cursor-pointer"
        >
          확인
        </button>
      </div>
    </div>
  );
};
