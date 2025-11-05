import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import logo_gt from '../../assets/logo_gt.png';

export const SignUp = () => {
  const navigate = useNavigate();

  const handleOwnerSignUpClick = () => {
    navigate('/signup/owner');
  };

  const handleCustomerSignUpClick = () => {
    navigate('/signup/customer');
  };

  return (
    <div className="flex flex-col items-center h-screen">
      {/* 상단바 */}
      <div className="flex flex-row items-center self-start mt-3 gap-4 px-6">
        <BackButton />
        <p>회원 가입</p>
      </div>

      {/* 구분선 */}
      <div className='w-screen h-px mt-3 bg-gray-200'/>

      {/* 회원가입 선택지 */}
      <div className="flex flex-col mt-32 gap-6">
        <div>
          <button
            className="w-[344px] h-[200px] bg-[#F3F3F3] rounded-[10px] text-black font-medium text-[20px]"
            onClick={handleCustomerSignUpClick}
          >
            <div className='flex flex-row items-center justify-center'>
                <p className=''>개인 회원</p>
                <img src={logo_gt} alt=">" className='absolute ml-65 mt-4'/>
            </div>
            <p className="text-[14px] text-[#898989] font-semibold">
              손님이시라면
            </p>
          </button>
        </div>
        <div>
          <button
            className="w-[344px] h-[200px] bg-[#F3F3F3] rounded-[10px] text-black font-medium text-[20px]"
            onClick={handleOwnerSignUpClick}
          >
            <div className='flex flex-row items-center justify-center'>
                <p className=''>점주 회원</p>
                <img src={logo_gt} alt=">" className='absolute ml-65 mt-4'/>
            </div>
            <p className="text-[14px] text-[#898989] font-semibold">
              내 가게를 등록하려면
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
