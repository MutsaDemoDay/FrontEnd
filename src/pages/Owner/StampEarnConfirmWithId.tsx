import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; // axios가 설치되어 있다고 가정
import { BackButton3 } from "../../components/BackButton3"; // 뒤로가기 버튼 컴포넌트 경로 확인 필요
import { fetchStoreName } from "../../api/Stats";
import { useQuery } from "@tanstack/react-query";

export const StampEarnConfirmWithId = () => {
  const { userId } = useParams(); // URL 파라미터에서 userId 가져오기
  const navigate = useNavigate();

  // 스탬프 개수 상태 (백엔드 연동 전 UI용)
  const [count, setCount] = useState(1);

  const { data: storeName } = useQuery({
    queryKey: ['storeName'],
    queryFn: fetchStoreName,
  });
  
  // TODO: userId를 이용해 회원 이름('김철수')을 가져오는 API가 있다면 여기서 호출하여 표시해야 합니다.
  const userName = "김철수"; 

  const handleIncrease = () => setCount((prev) => prev + 1);
  const handleDecrease = () => setCount((prev) => (prev > 1 ? prev - 1 : 1));

  const handleConfirm = async () => {
    try {
      // API 요청: 쿼리 파라미터로 storeName과 userId 전달
      // 백엔드에서 스탬프 개수 처리가 아직 안 되었다고 하셨으므로 count는 UI에서만 보여주고 요청에는 포함하지 않거나, 필요시 params에 추가
      await axios.post(`/api/v1/manager/addByNum`, null, {
        params: {
          storeName: storeName,
          userId: userId,
          // count: count // 추후 백엔드 구현 시 주석 해제
        },
      });

      alert("스탬프 적립이 완료되었습니다.");
      navigate("/stamp-earn"); // 적립 후 처음 화면 등으로 이동
    } catch (error) {
      console.error("적립 실패:", error);
      alert("적립에 실패했습니다. 다시 시도해주세요.");
    }
  };

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
        {/* 회원명 */}
        <div className="flex py-4 border-b border-gray-100">
          <span className="w-24 text-(--fill-color6)">회원명:</span>
          <span className="font-medium text-black">{userName}</span>
        </div>

        {/* ID */}
        <div className="flex py-4 border-b border-gray-100">
          <span className="w-24 text-(--fill-color6)">ID:</span>
          <span className="font-medium text-black">{userId}</span>
        </div>

        {/* 스탬프 개수 조절 (UI 구현) */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <span className="text-(--fill-color6)">스탬프 개수:</span>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDecrease}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:bg-gray-50"
            >
              -
            </button>
            <span className="text-lg font-medium w-4 text-center">{count}</span>
            <button
              onClick={handleIncrease}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* 하단 버튼 영역 (화면 아래 고정하거나 flex-grow로 밀어내기) */}
      <div className="fixed bottom-10 left-4 right-4 pb-8 flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 h-[50px] bg-(--fill-color2) text-black rounded-[40px] text-[16px] font-medium"
        >
          이전
        </button>
        <button
          onClick={handleConfirm}
          className="flex-1 h-[50px] bg-(--main-color) text-white rounded-[40px] text-[16px] font-medium"
        >
          확인
        </button>
      </div>
    </div>
  );
};