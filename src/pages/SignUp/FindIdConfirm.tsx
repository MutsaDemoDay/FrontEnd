import BackButton from '../../components/BackButton';

export const FindIdConfirm = () => {
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
        <p className="text-[16px] text-gray-400 mt-[18px]">
          아이디 및 비밀번호 찾기와 관련하여 <br />
          문의사항이 있으시면 고객센터로 문의해주세요.{' '}
        </p>
      </div>

      {/* 구분선 */}
      <div className="w-screen h-px mt-3 bg-gray-200" />

      <div className="w-full px-10 flex flex-row gap-45">
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
