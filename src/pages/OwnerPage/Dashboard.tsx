export const Dashboard = () => {
  return (
    <div className="w-full p-5">
      <div className="flex flex-col">
        <p className="text-(--fill-color6) text-[25px] font-semibold">
          Dashboard
        </p>
      </div>

      <div className="w-full px-2">
        <p className="mt-12 text-(--main-color) text-[18px] font-semibold">
          오늘의 요약 카드
        </p>
      </div>

      <div className="flex flex-col w-full px-2 gap-3">
        <div className="flex flex-row w-full justify-between mt-5">
            <div className="flex flex-col justify-between w-[160px] h-[140px] bg-(--fill-color1) text-(--fill-color7) rounded-[20px] p-3">
                <p className="font-semibold text-[14px]">오늘 적립</p>
                <p className="self-end m-2">dd</p>
            </div>
        </div>
      </div>
    </div>
  );
};
