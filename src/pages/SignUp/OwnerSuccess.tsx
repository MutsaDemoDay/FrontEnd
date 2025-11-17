import { useNavigate } from 'react-router-dom';

export const OwnerSuccess = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen items-center">
      <div className="flex flex-col items-start w-[320px] mt-[70px]">
        <h1 className="font-semibold text-[34px]">가게 등록 완료!</h1>
        <p className="mt-5 text-[14px] text-gray-600">
          입력하신 정보가 올바른지 확인하고 있어요.
          <br />
          심사가 완료되면 카카오톡 알림톡을 보내드려요.
        </p>
        <div className="absolute bottom-10">
          <button
            className="bg-(--main-color) text-white text-[18px] rounded-[40px] w-[316px] h-[52px] font-semibold"
            onClick={handleClick}
          >
            처음 화면으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};
