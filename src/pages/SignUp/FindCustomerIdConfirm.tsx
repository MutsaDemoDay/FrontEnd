import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

export const FindCustomerIdConfirm = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/');
  };

  const handleFindPasswordClick = () => {
    navigate('/find-password');
  };

  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-row items-center self-start mt-3 gap-4 px-6">
        <BackButton />
        <p className="text-[16px]">아이디 찾기</p>
      </div>

      {/* 구분선 */}
      <div className="w-screen h-px mt-3 bg-gray-200" />

      <div className="flex flex-row w-full justify-center items-center h-[60px] text-[12px]">
        <div className="flex h-full items-center justify-center w-1/2 border-b-2">
          개인회원
        </div>
        <div className="flex h-full items-center justify-center w-1/2 border-b border-gray-500">
          점주회원
        </div>
      </div>

      <div className="w-full px-6 flex flex-col justify-start">
        <p className="self-start mt-10 text-[20px]">
          입력하신 정보와 일치하는
          <br />
          아이디입니다.
        </p>
        <p className="text-[16px] text-(--fill-color3) mt-[18px]">
          아이디 및 비밀번호 찾기와 관련하여 <br />
          문의사항이 있으시면 고객센터로 문의해주세요.{' '}
        </p>
      </div>

      {/* 구분선 */}
      <div className="w-screen h-px mt-3 bg-gray-200" />

      <div className="flex flex-row w-full h-[100px] items-center gap-4">
        <div className="flex items-center justify-center w-1/2">ABCDE1234</div>
        <div className="flex items-center justify-center w-1/2 text-(--fill-color5)">
          가입일: 2024-01-01
        </div>
      </div>

      {/* 구분선 */}
      <div className="w-screen h-px mt-3 bg-gray-200" />

      <div className="fixed bottom-10 w-full px-10 gap-3 flex">
        <button
          className="w-1/2 h-[60px] bg-(--fill-color1) text-black text-[16px] font-medium rounded-[40px]"
          onClick={handleFindPasswordClick}
        >
          비밀번호 찾기
        </button>
        <button
          className="w-1/2 h-[60px] bg-(--main-color) text-white border border-(--main-color) text-[16px] font-medium rounded-[40px]"
          onClick={handleLoginClick}
        >
          로그인
        </button>
      </div>
    </div>
  );
};
