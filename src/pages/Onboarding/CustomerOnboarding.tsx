import React, { useState } from 'react'; // 1. useState를 임포트합니다.
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';

export const CustomerOnboarding = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  // 3. 텍스트 콘텐츠를 배열로 분리합니다.
  const slideContents = [
    <div className="text-center mt-13 text-lg">
      기존에 적립해뒀던 실물 스탬프를 <p/> 모두 모아서 <span className="font-semibold">앱 스탬프로 전환</span>하세요!
    </div>,
    <div className="text-center mt-13 text-lg">
      스탬프 찍을 때마다 리워드 받기
    </div>,
    <div className="text-center mt-13 text-lg">
      <span className="font-semibold">검증된 단골 손님</span>들의 리뷰를 만나보세요.
    </div>,
  ];

  return (
    <div className="w-full min-w-0 h-[calc(100vh-60px)] flex flex-col">
      <Swiper
        // 5. h-full을 제거하고, Swiper가 이미지 콘텐츠 크기만큼 차지하도록 합니다.
        //    (flex-1을 주어 남은 공간을 채우거나, 그냥 두어 콘텐츠 크기만 갖게 할 수 있습니다.)
        className="w-full"
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
        onSwiper={(swiper) => console.log(swiper)}
        // 6. 슬라이드가 변경될 때마다 activeIndex state를 업데이트합니다.
        onSlideChange={(swiper) => {
          console.log('slide change');
          setActiveIndex(swiper.activeIndex);
        }}
      >
        <SwiperSlide className="w-full h-full flex flex-col items-center justify-center p-4">
          <img className="w-full h-[456px] bg-gray-200" src="" alt="" />
        </SwiperSlide>

        <SwiperSlide className="w-full h-full flex flex-col items-center justify-center p-4">
          <img className="w-full h-[456px] bg-gray-200" src="" alt="" />
        </SwiperSlide>

        <SwiperSlide className="w-full h-full flex flex-col items-center justify-center p-4">
          <img className="w-full h-[456px] bg-gray-200" src="" alt="" />
        </SwiperSlide>
      </Swiper>

      <div className="h-3.5 swiper-pagination-custom text-center py-4" />

      <div className="p-4">{slideContents[activeIndex]}</div>
      {activeIndex === 2 && (
        <div className="flex grow items-end pb-10 px-4">
          <button
            className="bg-[#F3F3F3] text-black text-[20px] rounded-[40px] w-full h-[52px] font-bold"
            onClick={() => navigate('/map')}
          >
            시작하기
          </button>
        </div>
      )}
    </div>
  );
};
