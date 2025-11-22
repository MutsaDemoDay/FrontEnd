import { OwnerBottomBar } from '../../components/OwnerBottomBar';
export const Dashboard = () => {
  return (
    <div className="flex flex-col w-full px-6 py-4">
      <h1 className="text-[25px] text-(--fill-color6) font-normal">
        Dashboard
      </h1>
      <p className="mt-10 text-[18px] text-(--main-color) font-semibold">
        오늘의 요약 카드
      </p>

      <div className="flex flex-col w-full gap-3">
        <div className="flex flex-row w-full justify-between mt-5">
          <div className="w-[160px] h-[140px] bg-(--fill-color1) text-(--fill-color7) rounded-[20px] p-3 flex flex-col justify-between">
            <p className="font-semibold text-[14px]">오늘 적립</p>
            <div className="flex flex-row self-end items-center text-center">
              <p className="text-[34px] font-semibold">20</p>
              <p className="text-[14px] font-medium mx-1">건</p>
            </div>
          </div>

          <div className="w-[160px] h-[140px] bg-(--fill-color1) text-(--fill-color7) rounded-[20px] p-3 flex flex-col justify-between">
            <p className="font-semibold text-[14px]">오늘 교환된 리워드</p>
            <div className="flex flex-row self-end items-center text-center">
              <p className="text-[34px] font-semibold">5</p>
              <p className="text-[14px] font-medium mx-1">건</p>
            </div>
          </div>
        </div>

        <div className="w-full h-[170px] flex flex-col p-3 bg-(--fill-color1) text-(--fill-color7) rounded-[20px]">
          <p className="text-[14px] text-(--fill-color7) font-semibold">
            적립 통계
          </p>
          <p className="mt-13 text-[12px]">총</p>
          <div className="flex flex-row items-center text-base">
            <p className="text-[30px] font-semibold">20</p>
            <p className="text-[14px] font-medium mx-1">건</p>
          </div>
        </div>
      </div>
      <OwnerBottomBar />
    </div>
  );
};
