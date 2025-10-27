import { useNavigate } from 'react-router-dom';
import backbutton from "../assets/BackButton.png";

const BackButton = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <img src={backbutton} className='w-[14px] h-[14px]' alt="뒤로 가기" onClick={handleGoBack} />
  );
};

export default BackButton;