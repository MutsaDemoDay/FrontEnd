import backButton3 from '../assets/backbutton3_icon.png';
import { useNavigate } from 'react-router-dom';

export const BackButton3 = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <img
      src={backButton3}
      className="w-[12px] h-[20px] m-3 cursor-pointer"
      alt="뒤로 가기"
      onClick={handleGoBack}
    />
  )
};
