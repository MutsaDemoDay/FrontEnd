import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type ReviewResponse } from '../../type/Store'; // 경로 확인 필요

// 이미지 import
import star_empty_icon from '../../assets/star_empty_icon.png';
import star_full_icon from '../../assets/star_full_icon.png';
import user_default_profile from '../../assets/photo_empty_icon.png';

interface StoreInfoReviewProps {
  storeId: string;
  reviewAvailable: boolean;
}

export const StoreInfoReview: React.FC<StoreInfoReviewProps> = ({
  storeId,
  reviewAvailable,
}) => {
  const [reviewData, setReviewData] = useState<ReviewResponse | null>(null);
  const navigate = useNavigate();
  const apiUri = import.meta.env.VITE_API_URI;

  // 리뷰 데이터 조회
  useEffect(() => {
    if (!storeId) return;
    const fetchReviews = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await fetch(`${apiUri}/v1/stores/${storeId}/reviews`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        if (response.ok) {
          const data = await response.json();
          setReviewData(data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, [storeId, apiUri]);

  // 페이지 이동
  const handleGoToReview = () => {
    navigate(`/store/${storeId}/review`);
  };

  // 헬퍼 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const renderStars = (rate: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <img
        key={i}
        src={i < rate ? star_full_icon : star_empty_icon}
        alt="star"
        className="w-[14px] h-[14px]"
      />
    ));
  };

  return (
    <div className="w-full flex flex-col items-center pb-10">
      {/* 1. 상단 작성 UI (조건부 렌더링) */}
      <div className="w-full p-10 text-center">
        {reviewAvailable ? (
          <>
            <div className="flex flex-col items-center justify-center w-full h-[80px]">
              <p className="text-[14px] text-[var(--fill-color6)]">
                방문 후기를 남겨주세요!
              </p>
              <div
                className="flex flex-row justify-center mt-4 gap-2 cursor-pointer"
                onClick={handleGoToReview}
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <img
                    key={i}
                    src={star_empty_icon}
                    className="w-[30px] h-[30px]"
                    alt="review-star"
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full bg-[var(--fill-color1)] h-10 flex items-center justify-center text-[var(--fill-color5)] text-[12px] rounded-[50px]">
            해당 가게의 스탬프를 완성한 유저만{' '}
            <br/> 리뷰를 작성할 수 있어요!
          </div>
        )}
      </div>

      <div className="w-full h-px bg-[var(--fill-color2)] mb-4" />

      {/* 2. 리뷰 리스트 */}
      <div className="w-full px-6">
        {reviewData?.reviews && reviewData.reviews.length > 0 ? (
          <div className="flex flex-col gap-6">
            <p className="font-semibold text-[16px] text-[var(--fill-color7)] mb-2">
              최신 리뷰 {reviewData.totalReviewCount}개
            </p>

            {reviewData.reviews.map((review) => (
              <div
                key={review.reviewId}
                className="w-full flex flex-col border-b border-[var(--fill-color2)] pb-6 last:border-0"
              >
                <div className="flex flex-row justify-between items-start mb-3">
                  <div className="flex flex-row gap-3 items-center">
                    <img
                      src={review.profileImageUrl || user_default_profile}
                      alt="profile"
                      className="w-[40px] h-[40px] rounded-full object-cover border border-gray-100"
                    />
                    <div className="flex flex-col">
                      <p className="text-[14px] font-semibold text-[var(--fill-color7)] text-left">
                        {review.nickname}
                      </p>
                      <div className="flex gap-0.5 mt-0.5">
                        {renderStars(review.rate)}
                      </div>
                    </div>
                  </div>
                  <span className="text-[12px] text-[var(--fill-color4)]">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                <p className="text-[14px] text-[var(--fill-color6)] leading-relaxed text-left whitespace-pre-wrap">
                  {review.content}
                </p>
                {review.reviewImageUrl && (
                  <div className="w-full h-[200px] rounded-[12px] overflow-hidden mt-3">
                    <img
                      src={review.reviewImageUrl}
                      alt="review-img"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full py-10 text-center text-[var(--fill-color5)] text-[14px]">
            아직 작성된 리뷰가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};
