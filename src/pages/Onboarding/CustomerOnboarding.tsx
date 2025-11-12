import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';

export const CustomerOnboarding = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const slideContents = [
    {
      text: (
        <>
          스탬프판을 다 완성했다면 <p />{' '}
          <span className="font-semibold">리워드는 쿠폰함</span>으로 지급돼요.
        </>
      ),
    },
    {
      text: (
        <>
          <span className="font-semibold">검증된 단골 손님</span>들의 리뷰를
          만나보세요.
        </>
      ),
    },
    {
      text: (
        <>
          스탬프 최고 수집가에 <p /> 도전해보세요!
        </>
      ),
    },
  ];

  return (
    <div className="w-full min-w-0 h-[calc(100vh-60px)] flex flex-col relative">
      <Swiper
        className="w-full h-full"
        modules={[Pagination, A11y]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{
          el: '.swiper-pagination-custom',
          clickable: true,
          bulletClass: 'swiper-pagination-bullet custom-bullet',
          bulletActiveClass:
            'swiper-pagination-bullet-active custom-bullet-active',
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex);
        }}
      >
        {slideContents.map((slide, index) => (
          <SwiperSlide key={index} className="w-full h-full flex flex-col p-4">
            <div className="flex flex-col">
              <img className="w-full h-[456px] bg-gray-200" alt="" />
              <div className="p-4 text-center mt-13 text-lg">{slide.text}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

        {/* 페이지네이션 */}
      <div className="h-auto !top-[480px] bottom-auto swiper-pagination-custom text-center py-4 absolute left-0 right-0 z-10 pointer-events-none" />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col items-center">
        {activeIndex === slideContents.length - 1 && (
          <div className="flex justify-center pb-10">
            <button
              className="bg-(--main-color) text-white text-[20px] rounded-[40px] w-[316px] h-[52px] font-bold mt-20 cursor-pointer z-10"
              onClick={() => navigate('/stamp')}
            >
              시작하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};