import { useNavigate } from 'react-router-dom';
import warning_icon from '../../assets/warning_icon.png';

export const OwnerFail = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen items-center">
      <div className="flex flex-col items-start w-full mt-[70px]">
        <img src={warning_icon} alt="" className="w-[66px] h-14" />
        <p className="mt-6 text-[16px] text-gray-600">
          심사 결과, 등록이 승인되지 않았어요. <br />
          제출하신 정보가 기준에 맞지 않아 점주 등록이 <br />
          완료되지 않았습니다.
        </p>
        <div className="flex flex-col items-start justify-center mt-22 w-[340px] h-[126px] border border-[#F3F3F3] rounded-[10px] p-3">
          <p className="text-[14px] ">
            다음 사유 중 하나에 해당했을 수 있어요.
          </p>
          <p className='mt-4 text-[#898989] text-[12px]'>
            • 사업자등록번호 확인이 불가한 경우
            <br />
            • 업종 분류 정보가 누락된 경우 <br />
            • 제출 서류의 이미지 해상도가 낮은 경우
          </p>
        </div>
        <p className='mt-[18px] text-[12px] ml-3'>정보를 수정하신 후 다시 신청하실 수 있습니다.</p>
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
