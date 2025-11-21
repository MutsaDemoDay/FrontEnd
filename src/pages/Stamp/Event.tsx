import { UserBottomBar } from '../../components/UserBottomBar';
import BackButton from '../../components/BackButton';

// 1. 데이터 정의
interface StoreData {
  id: number;
  name: string;
  address: string;
  representativeMenu: string;
  menuList: string;
  image: string;
}

const STORES: StoreData[] = [
  {
    id: 1,
    name: '스탠스 커피',
    address: '서울특별시 관악구 남부순환로 1831',
    representativeMenu: '대표메뉴',
    menuList: '크림 브륄레 라떼, 아인슈페너, 당근 케이크',
    image:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 2,
    name: '리바노 홍대점',
    address: '서울특별시 마포구 와우산로 123',
    representativeMenu: '대표메뉴',
    menuList: '바닐라 라떼, 홍시스무디, 연유라떼',
    image:
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 3,
    name: '카페 602',
    address: '서울특별시 서초구 방배분동 120',
    representativeMenu: '대표메뉴',
    menuList: 'B.E.L.T 샌드위치, 아인슈페너, 콜드브루',
    image:
      'https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?q=80&w=1000&auto=format&fit=crop',
  },
];

export const Event = () => {
  return (
    // 전체 페이지 컨테이너: 가로 432px 고정, 중앙 정렬
    <div className="w-[432px] min-h-screen bg-white flex flex-col mx-auto relative shadow-lg overflow-x-hidden">
      {/* 상단 헤더 (흰색) */}
      <header className="w-full px-5 pt-6 pb-4 bg-white sticky top-0 z-20">
        <div className="mb-4">
          <BackButton />
        </div>
        <h1 className="text-[26px] font-bold text-[#333]">Event</h1>
      </header>

      {/* 메인 콘텐츠 영역 (주황색 배경) */}
      {/* 부모의 pb-24 제거: 흰색 박스가 끝까지 내려오게 하기 위함 */}
      <div className="flex-1 bg-[#FFAB76] pt-6 flex flex-col items-center relative">
        {/* 흰색 둥근 아치형 컨테이너 (폭 332px) */}
        <div
          // flex-1 적용으로 남은 공간을 모두 차지하여 바닥까지 닿음
          // pb-24 추가: 내용은 하단바에 가려지지 않도록 내부 여백 설정
          className="bg-white flex-1 px-5 pt-24 pb-24 flex flex-col items-center shadow-sm"
          style={{
            width: '332px',
            borderTopLeftRadius: '166px', // 332px의 절반 (완벽한 반원)
            borderTopRightRadius: '166px',
            // 하단은 border-radius가 없으므로 직사각형처럼 바닥까지 연결됨
          }}
        >
          {/* 이벤트 타이틀 섹션 */}
          <div className="text-center mb-10">
            <h2 className="text-[#FF6B00] text-2xl font-extrabold tracking-tight mb-3">
              OPEN EVENT
            </h2>
            <p className="text-gray-500 text-[12px] leading-6 mb-5">
              당고 제휴 신규 매장 오픈 기념🎉
              <br />
              이벤트 기간 동안 스탬프를 적립하면
              <br />
              <span className="font-bold text-black">스탬프가 1+1</span>으로
              발급돼요!
            </p>

            {/* 날짜 뱃지 */}
            <div className="inline-flex items-center bg-[#FF6B00] text-white px-4 py-1.5 rounded-full shadow-md">
              <span className="text-[10px] font-bold mr-2">이벤트 기간</span>
              <span className="opacity-60 text-[10px] mr-2">|</span>
              <span className="text-[10px] font-medium">
                2025. 11. 01 ~ 2025. 11. 31
              </span>
            </div>
          </div>

          {/* 스토어 카드 리스트 (지그재그 배치) */}
          <div className="w-full flex flex-col gap-5">
            {STORES.map((store, index) => (
              <div
                key={store.id}
                // 홀수 인덱스일 때 flex-row-reverse 적용
                className={`flex w-full bg-white rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.06)] overflow-hidden p-3 gap-3 border border-gray-50 ${
                  index % 2 !== 0 ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* 이미지 영역 */}
                <div className="w-[90px] h-[90px] flex-shrink-0 rounded-xl overflow-hidden shadow-inner">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 텍스트 정보 영역 */}
                <div
                  className={`flex flex-col justify-center flex-1 ${
                    index % 2 !== 0
                      ? 'items-end text-right'
                      : 'items-start text-left'
                  }`}
                >
                  {/* 가게 이름 */}
                  <h3 className="font-bold text-[14px] text-[#FF6B00] mb-1">
                    {store.name}
                  </h3>

                  <p className="text-gray-400 text-[10px] mb-2 break-keep font-light">
                    {store.address}
                  </p>

                  <div
                    className={`flex flex-col ${
                      index % 2 !== 0 ? 'items-end' : 'items-start'
                    }`}
                  >
                    <span className="text-[#FF6B00] text-[10px] font-bold mb-0.5">
                      {store.representativeMenu}
                    </span>
                    <p className="text-gray-500 text-[10px] leading-tight break-keep font-light">
                      {store.menuList}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 바 (고정) */}
      <div className="fixed bottom-0 w-[432px] z-30 bg-white border-t border-gray-100">
        <UserBottomBar />
      </div>
    </div>
  );
};
