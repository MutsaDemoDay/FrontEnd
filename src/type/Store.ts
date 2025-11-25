export interface SignatureMenu {
  menuName: string;
  content: string;
  price: number;
  menuImageUrl: string;
}

export interface StoreDetail {
  storeId: number;
  name: string;
  category: string;
  address: string; 
  storeImageUrl: string;
  phone: string;
  storeUrl: string;
  sns: string;
  distanceMeters: number;
  status: string; 
  message: string; 
  reward: string;
  stampReward: string;
  stampImageUrl: string;
  maxCount: number;
  signatureMenus: SignatureMenu[]; 
  reviewAvailable: boolean; 
}

export interface ReviewItem {
  reviewId: number;
  nickname: string;
  profileImageUrl: string | null;
  rate: number;
  content: string;
  reviewImageUrl: string | null;
  createdAt: string;
}

export interface ReviewResponse {
  averageRating: number;
  totalReviewCount: number;
  ratingDistribution: any;
  reviews: ReviewItem[];
  stampBoardCompleted: boolean;
  userReviewWritten: boolean;
}