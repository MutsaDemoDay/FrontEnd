import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { BackButton3 } from '../../components/BackButton3';

// API 응답 데이터 타입 정의
interface EventCategory {
  eventType: string;
  available: boolean;
  description: string;
  startDate: string;
  endDate: string;
}

export const EventCreate = () => {
  const [isOpen, setIsOpen] = useState(false);

  // 전체 카테고리 목록 저장
  const [categories, setCategories] = useState<EventCategory[]>([]);

  // 현재 선택된 카테고리 (초기값 null)
  const [selectedCategory, setSelectedCategory] =
    useState<EventCategory | null>(null);

  const apiUri = import.meta.env.VITE_API_URI;

  // 데이터 가져오기
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiUri}/v1/events/categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await response.json();

        if (json.code === 100 && json.data.availableCategories.length > 0) {
          setCategories(json.data.availableCategories);
          // 초기값은 첫 번째 항목으로 설정
          setSelectedCategory(json.data.availableCategories[0]);
        }
      } catch (error) {
        console.error('이벤트 카테고리를 불러오는데 실패했습니다:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSelect = (category: EventCategory) => {
    setSelectedCategory(category);
    setIsOpen(false);
  };

  // 날짜 포맷팅 함수 (2025-11-01T00... -> 2025. 11. 01)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}. ${month}. ${day}`;
  };

  // 데이터 로딩 중일 때 처리 (선택사항)
  if (!selectedCategory) {
    return <div className="p-4">로딩 중...</div>;
  }

  return (
    <div className="w-full flex flex-col p-4">
      <BackButton3 />

      {/* Title */}
      <div className="px-6 pb-[58px] mt-5">
        <h1 className="text-[25px] font-semibold text-(--fill-color6)">
          이벤트 참여
        </h1>
      </div>

      <div className="px-6 flex-1 overflow-y-auto pb-24">
        {/* Section 1: Event Item (Dropdown) */}
        <section className="mb-12">
          <h2 className="text-[15px] font-semibold mb-5 text-(--fill-color7)">
            이벤트 항목
          </h2>

          <div className="relative">
            {/* Selected Box */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`w-full text-left px-4 py-3 text-[12px] flex justify-between items-center border rounded-lg bg-white
                ${
                  isOpen
                    ? 'border-(--main-color) ring-1 ring-(--main-color)'
                    : 'border-gray-300'
                }`}
            >
              <span className="truncate pr-2">
                {selectedCategory.description}
              </span>
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-(--main-color) shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-(--fill-color7) shrink-0" />
              )}
            </button>

            {/* Dropdown List */}
            {isOpen && (
              <div className="w-full bg-[#F5F5F5] border border-t-0 border-gray-200 rounded-b-lg overflow-hidden mt-1">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelect(category)}
                    className={`px-4 py-3 text-[12px] cursor-pointer hover:bg-gray-200 
                      ${
                        category.eventType === selectedCategory.eventType
                          ? 'font-medium'
                          : 'text-gray-600'
                      }`}
                  >
                    {category.description}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Section 2: Event Period (Dynamic Data) */}
        <section className="mb-12">
          <h2 className="text-sm font-bold mb-2 text-gray-800">이벤트 기간</h2>
          <p className="text-sm text-gray-500">
            {formatDate(selectedCategory.startDate)} -{' '}
            {formatDate(selectedCategory.endDate)}
          </p>
        </section>

        {/* Section 3: Event Content (Static Text) */}
        {/* API 응답에 상세 설명 본문이 없으므로 기존 텍스트 유지 */}
        <section className="mb-8">
          <h2 className="text-sm font-bold mb-3 text-gray-800">신규 매장 오픈 기념 스탬프 1+1 적립:</h2>
          <div className="text-sm text-gray-600 space-y-4 leading-relaxed">
            <p>
              당고와 제휴를 맺은 매장 중 신규 오픈한 가게들을 대상으로 진행되는
              이벤트입니다. (개점일로부터 한달이 지나지 않은 가게)
            </p>
            <p>
              스탬프가 자동으로 1+1 적립되며, 해당 이벤트에 참여중임이 고객
              계정의 EVENT 탭과 지도 AI추천 탭에 노출되게 됩니다.
            </p>
            <p>
              이벤트 참여기간동안은 어플 내 프리미엄 모델이 사용 가능합니다.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-sm font-bold mb-3 text-gray-800">가을맞이 음료 10% 할인:</h2>
          <div className="text-sm text-gray-600 space-y-4 leading-relaxed">
            <p>
              당고와 제휴를 맺은 매장 중 신규 오픈한 가게들을 대상으로 진행되는
              이벤트입니다. (개점일로부터 한달이 지나지 않은 가게)
            </p>
            <p>
              스탬프가 자동으로 1+1 적립되며, 해당 이벤트에 참여중임이 고객
              계정의 EVENT 탭과 지도 AI추천 탭에 노출되게 됩니다.
            </p>
            <p>
              이벤트 참여기간동안은 어플 내 프리미엄 모델이 사용 가능합니다.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-sm font-bold mb-3 text-gray-800">인증샷 업로드시 매장 굿즈 증정:</h2>
          <div className="text-sm text-gray-600 space-y-4 leading-relaxed">
            <p>
              당고와 제휴를 맺은 매장 중, 자체 굿즈가 있는 가게들을 대상으로 진행되는 이벤트입니다.
            </p>
            <p>
              매장에서 메뉴를 주문하고, 이를 SNS에 올리면 직원의 확인 후 매장 MD가 리워드로 지급되게 됩니다. <br />해당 이벤트에 참여중임이 고객 계정의 EVENT 탭과 지도 AI추천 탭에 노출되게 됩니다. 
            </p>
            <p>
              이벤트 참여기간동안은 어플 내 프리미엄 모델이 사용 가능합니다.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-sm font-bold mb-3 text-gray-800">
            이벤트 대표메뉴 설정
          </h2>
          <p className="text-sm text-gray-600 space-y-4 leading-relaxed">
            이벤트 카드에 들어갈 메뉴 3개를 선정해주세요.
          </p>
        </section>
      </div>

      {/* Footer: Confirm Button */}
      <div className="p-6 w-full border-gray-100">
        <button className="w-[316px] h-[55px] flex items-center justify-center bg-(--main-color) text-white py-4 rounded-[40px] font-bold text-[24px] shadow-sm hover:bg-orange-600 transition-colors">
          확인
        </button>
      </div>
    </div>
  );
};
