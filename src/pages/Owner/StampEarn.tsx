import { BackButton3 } from '../../components/BackButton3';
import qr_scan from '../../assets/qr_scan.png';
import check_id from '../../assets/check_id.png';
import { useNavigate } from 'react-router-dom';

export const StampEarn = () => {
  const navigate = useNavigate();

  const handleGoToQRScan = () => {
    navigate('/owner/stamp-earn/qr-scan');
  };

  const handleGoToIdInput = () => {
    navigate('/owner/stamp-earn/id-input');
  };

  return (
    <div className="w-full h-full p-4">
      <BackButton3 />
      <h1 className="text-[25px] text-(--fill-color6) font-semibold ml-3 mt-7">
        스탬프 적립하기
      </h1>

      <div className="w-full flex flex-row mt-40 gap-5 justify-center">
        <div onClick={handleGoToQRScan} className="w-1/2 h-[170px] rounded-[20px] flex flex-col items-center justify-center bg-(--fill-color1) text-(--fill-color7) p-5 cursor-pointer">
          <img src={qr_scan} alt="" className='w-[90px] h-[90px]'/>
          <p className='text-[14px] text-black font-medium mt-2'>QR코드 인식</p>
        </div>
        <div onClick={handleGoToIdInput} className="w-1/2 h-[170px] rounded-[20px] flex flex-col items-center justify-center bg-(--fill-color1) text-(--fill-color7) p-5 cursor-pointer">
          <img src={check_id} alt="" className='w-[90px] h-[90px]'/>
          <p className='text-[14px] text-black font-medium mt-2'>ID 직접 입력</p>
        </div>
      </div>
    </div>
  );
};
