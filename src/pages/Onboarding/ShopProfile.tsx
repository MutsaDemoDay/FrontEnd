import addProfile from '../../assets/addProfile.png';

export const ShopProfile = () => {
  return (
    <div className="flex flex-col w-full">
      {/* 구분선 */}
      <div className="mt-10 h-px bg-gray-100" />

      {/* 안내문구 */}
      <div className="flex flex-col px-7 items-start  mt-12">
        <div className="flex flex-col h-[82px]">
          <p className="text-[34px] font-semibold">심사가 완료됐어요!</p>
          <p className="text-[20px] mt-4">매장 프로필 설정을 시작하세요.</p>
        </div>
      </div>

      {/* 구분선 */}
      <div className="mt-10 h-px bg-gray-100" />

      {/* 프로필 설정 폼 */}
      <div className="w-full px-7 flex flex-col items-start mt-4">
        <p className="h-[42px] text-(--main-color) text-[18px] font-semibold">
          매장 설정
        </p>

        <div className="relative w-full h-[120px] mt-6 justify-center font-medium">
          <p className="absolute top-1/2 text-[15px] self-start leading-1">
            대표 이미지
          </p>
          <img
            src={addProfile}
            alt="Add Profile"
            className="w-[120px] h-[120px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        <div className='w-full mt-9'>
          <p>매장명</p>
          <input type="text" className='w-full h-10 border-b border-gray-300 mt-2 p-2' />
        </div>
      </div>
    </div>
  );
};
