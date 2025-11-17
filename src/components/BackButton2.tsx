import backButton2 from '../assets/BackButton2.png';
import { useNavigate } from 'react-router-dom';

export const BackButton2 = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <img
      src={backButton2}
      className="w-[48px] h-[48px] m-3"
      alt="뒤로 가기"
      onClick={handleGoBack}
    />
  )
};
