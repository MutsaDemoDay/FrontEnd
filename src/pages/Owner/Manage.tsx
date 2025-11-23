import { OwnerBottomBar } from '../../components/OwnerBottomBar';
import goto_icon from '../../assets/goto_icon.png';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import logo_gt from '../../assets/logo_gt.png';

export const Manage = () => {
  const navigate = useNavigate();

  const handleGotoStampEarn = () => {
    navigate('/owner/stamp-earn');
  };

  const handleGotoStampHistory = () => {
    navigate('/owner/stamphistory');
  };

  const handleGotoStampSetting = () => {
    navigate('/owner/stampsetting');
  };

  return (
    <div className="flex flex-col w-full px-6 py-4">
      <h1 className="text-[25px] text-(--fill-color6) font-normal">
        Management
      </h1>

      <p className="mt-10 text-[18px] text-(--main-color) font-semibold">
        스탬프 관리
      </p>

      <div className="flex flex-col w-full gap-3">
        <div className="flex flex-row w-full justify-between mt-5 gap-3">
          <div className="w-full h-[140px] bg-(--fill-color1) text-(--fill-color7) rounded-[20px] p-3 flex flex-col justify-between">
            <p className="font-semibold text-[14px]">스탬프 적립하기</p>
            <div className="flex flex-row self-end">
              <img
                src={goto_icon}
                alt=""
                className="w-[40px] h-[40px]"
                onClick={handleGotoStampEarn}
              />
            </div>
          </div>
        </div>

        <div className="w-full h-[170px] flex flex-col p-4 px-5 bg-(--fill-color1) text-(--fill-color7) rounded-[20px] justify-between">
          <div className="w-full flex flex-row justify-between">
            <p className="text-[14px] text-(--fill-color7) font-semibold">
              스탬프 설정
            </p>
            <img
              src={logo_gt}
              alt=""
              className="w-[9px] h-[14px] mx-1 mt-1"
              onClick={handleGotoStampSetting}
            />
          </div>

          <div className="flex flex-row gap-3">
            <div className="flex flex-col mt-5">
              <p className="text-[12px] text-(--fill-color7) font-semibold">
                적립금액 기준
              </p>
              <p className="text-[12px] text-(--fill-color6) mt-4">
                5000원 이상
              </p>
            </div>

            <div className="w-px h-20 bg-(--fill-color2) mt-4" />

            <div className="flex flex-col mt-5">
              <p className="text-[12px] text-(--fill-color7) font-semibold">
                리워드 보상
              </p>
              <p className="text-[12px] text-(--fill-color6) mt-4">
                매장음료 1잔
              </p>
            </div>
            <div className="w-px h-20 bg-(--fill-color2) mt-4" />
            <div className="flex flex-col mt-5">
              <p className="text-[12px] text-(--fill-color7) font-semibold">
                디자인
              </p>
              <p className="text-[12px] text-(--fill-color6) mt-4">
                기본 디자인
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full h-15 bg-(--fill-color1) rounded-[20px] px-7 items-center">
          <p className="">QR 생성하기</p>
        </div>

        <p className="mt-10 text-[18px] text-(--main-color) font-semibold">
          고객 관리
        </p>

        <div className="flex w-full h-15 bg-(--fill-color1) rounded-[20px] px-7 items-center">
          <p className="">스탬프 등록 고객</p>
        </div>
      </div>
      <OwnerBottomBar />
    </div>
  );
};
