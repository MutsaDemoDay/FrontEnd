import { BackButton3 } from '../../components/BackButton3';
import { OwnerBottomBar } from '../../components/OwnerBottomBar';
import plus_icon from '../../assets/plus_icon.png';
import history_icon from '../../assets/history_icon.png';
import goto_icon from '../../assets/goto_icon.png';
import { useNavigate } from 'react-router-dom';

export const EventManage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full px-6 py-4">
      <h1 className="text-[25px] text-(--fill-color6) font-normal mb-[110px]">
        Event
      </h1>

      <div className="w-full justify-center items-center flex flex-col gap-5">
        <div className="w-[340px] h-[156px] bg-(--fill-color1) rounded-[20px] p-2 flex flex-col">
          <div className="flex flex-row w-full p-2 mx-2 justify-between items-center">
            <p className="text-[14px] text-black font-medium">
              진행중인 이벤트
            </p>
            <img
              src={plus_icon}
              alt=""
              className="w-[11.2px] h-[11.2px] mr-5"
              onClick={() => navigate('/owner/eventcreate')}
            />
          </div>

          <div className="">여기에 이벤트를 넣어주세요.</div>
        </div>
      </div>

      <div className="w-full h-[70px] justify-center items-center flex flex-row">
        <div className="w-[340px] h-full bg-(--fill-color1) rounded-[20px] flex flex-row mt-5 items-center">
          <img src={history_icon} alt="" className="w-[28px] h-[28px] ml-5" />
          <p className="ml-4 text-[14px] text-black font-medium">지난 이벤트</p>
          <div className="flex-grow" />
          <img
            src={goto_icon}
            alt=""
            className="w-[40px] h-[40px] mr-5 cursor-pointer"
            onClick={() => navigate('/owner/pastevent')}
          />
        </div>
      </div>

      <OwnerBottomBar />
    </div>
  );
};
