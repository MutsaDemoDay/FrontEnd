import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Plus from '../../assets/plus.svg';
import ThreeDots from '../../assets/threedots.svg';
import Hamburger from '../../assets/hamburger.svg';
import StampSection from '../../components/StampSection';
import { StampCard } from '../../components/StampCard';
import { UserBottomBar } from '../../components/UserBottomBar';
import Window from '../../components/Window';

// 이벤트 데이터 타입 정의
interface EventItem {
  id: number;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
}

const StampPage = () => {
  const navigate = useNavigate(); // 2. 페이지 이동을 위한 navigate 함수 생성
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // 이벤트 데이터 예시
  const events: EventItem[] = [
    {
      id: 1,
      title: 'OPEN EVENT',
      description:
        '개업 기념 스탬프 1+1 적립 이벤트\n진행중인 신규 카페 보러가기🎁',
      date: '2025. 01. 01 ~ 01. 02',
    },
    {
      id: 2,
      title: 'SPECIAL EVENT',
      description: '✨이번주 추천 카페✨ 방문시\n음료가 10~20% 할인돼요',
      date: '2025. 01. 01 ~ 01. 02',
    },
    {
      id: 3,
      title: 'SNS BONUS',
      description: '음료 주문하고 SNS에 인증샷\n업로드시 매장 굿즈 증정💖',
      date: '2025. 01. 01 ~ 01. 02',
    },
  ];

  return (
    <div className="relative min-h-screen bg-gray-50 pb-[80px]">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 bg-gray-50 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800">My Stamp</h1>
        <div className="flex items-center space-x-3">
          <button className="p-1 text-gray-500 hover:text-gray-800">
            <img src={Plus} alt="Plus" className="w-6 h-6" />
          </button>
          <button className="p-1 text-gray-500 hover:text-gray-800">
            <img src={ThreeDots} alt="ThreeDots" className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5">
        {/* Toggle Switch (List/Grid) */}
        <div className="flex justify-center mb-4">
          <div className="flex bg-black rounded-full p-1 w-[80px] relative">
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 flex justify-center items-center rounded-full py-1 transition-all ${
                viewMode === 'list' ? 'bg-[#FF6B00]' : 'bg-transparent'
              }`}
            >
              <img src={Hamburger} alt="List Mode" className="w-4 h-4" />
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={`flex-1 flex justify-center items-center rounded-full py-1 transition-all ${
                viewMode === 'grid' ? 'bg-[#FF6B00]' : 'bg-transparent'
              }`}
            >
              <img src={ThreeDots} alt="Grid Mode" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode Condition */}
        {viewMode === 'list' ? (
          <>
            <div className="mb-2 flex justify-center">
              <StampSection />
            </div>
            <div className="text-center mb-6">
              <p className="font-bold text-gray-800 flex items-center justify-center gap-1">
                ☕ 카페나무
              </p>
              <p className="text-sm text-gray-500">2/10</p>
            </div>
            <div className="mb-6">
              <StampCard />
            </div>
          </>
        ) : (
          <div className="mb-6">
            <Window />
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          {/* 스탬프 히스토리 버튼 */}
          <button
            onClick={() => navigate('/stamphistory')}
            className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 transition"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
              <img src={ThreeDots} alt="History" className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              스탬프 히스토리
            </span>
          </button>

          {/* 스탬프 찍기 버튼 */}
          <button
            onClick={() => navigate('/stampearning')}
            className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 transition"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
              <img src={ThreeDots} alt="stamp" className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              스탬프 찍기
            </span>
          </button>
        </div>

        {/* Event Section */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Event</h2>
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                onClick={() => navigate('/stamp/event')} // 이벤트 항목 클릭 시 이동
                className="bg-gray-100 rounded-2xl p-5 flex justify-between items-center cursor-pointer hover:bg-gray-200 transition"
              >
                <div className="flex-1 pr-4">
                  <h3 className="text-[#FF6B00] font-bold text-sm mb-1">
                    {event.title}
                  </h3>
                  <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed mb-2">
                    {event.description}
                  </p>
                  <p className="text-[10px] text-gray-400">{event.date}</p>
                </div>

                <div className="w-20 h-20 bg-white rounded-lg shadow-sm overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <span className="text-xs text-gray-300">IMG</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100">
        <UserBottomBar />
      </div>
    </div>
  );
};

export default StampPage;
