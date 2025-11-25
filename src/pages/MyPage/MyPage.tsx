import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import BackButton from '../../components/BackButton';
import StampsSection from '../../components/StampSection';
import { UserBottomBar } from '../../components/UserBottomBar';

// Assets
import Setting from '../../assets/setting.svg';
import DownButton from '../../assets/downbutton.svg';
import FilledStar from '../../assets/filledstar.svg';
import EmptyStar from '../../assets/emptystar.svg';

// 뱃지 이미지 Import
import badge1 from '../../assets/badge1.png';
import badge21 from '../../assets/badge21.png';
import badge22 from '../../assets/badge22.png';
import badge31 from '../../assets/badge31.png';
import badge32 from '../../assets/badge32.png';
import badge41 from '../../assets/badge41.png';
import badge42 from '../../assets/badge42.png';
import badge51 from '../../assets/badge51.png';
import badge52 from '../../assets/badge52.png';

const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

// ==========================================
// 0. 뱃지 데이터 정의 (레벨별 획득 뱃지)
// ==========================================
interface BadgeDef {
  id: number;
  level: number;
  name: string;
  img: string;
}

const BADGE_LIST: BadgeDef[] = [
  // Lv 1 (기본)
  { id: 1, level: 1, name: '원두 탐험가', img: badge1 },
  // Lv 2 (20개 이상)
  { id: 2, level: 2, name: '브루 수련생', img: badge21 },
  { id: 3, level: 2, name: '카페 수집가', img: badge22 },
  // Lv 3 (40개 이상)
  { id: 4, level: 3, name: '라떼 장인', img: badge31 },
  { id: 5, level: 3, name: '오늘의 드립러', img: badge32 },
  // Lv 4 (60개 이상)
  { id: 6, level: 4, name: '로스트 마스터', img: badge41 },
  { id: 7, level: 4, name: '커피 연금술사', img: badge42 },
  // Lv 5 (80개 이상)
  { id: 8, level: 5, name: '전설의 바리스타', img: badge51 },
  { id: 9, level: 5, name: '카페 그랜드마스터', img: badge52 },
];

// ==========================================
// 1. 타입 정의
// ==========================================

// ... (기존 타입 정의와 동일) ...
interface Stamp {
  storeName: string;
  date: string;
  stampImageUrl: string;
  stampReward: string;
}

interface Review {
  storeName: string;
  rate: string;
  content: string;
  reviewDate: string;
  reviewImageUrl: string;
}

interface ProfileData {
  nickname: string;
  totalStampCount: number;
  couponNum?: number;
  reviews?: Review[];
  stamps?: Stamp[];
}

interface ProfileResponse {
  timestamp: string;
  code: number;
  message: string;
  data: ProfileData;
}

interface SettingsData {
  profileImageUrl: string;
  representativeBadgeName: string | null;
  gender: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface SettingsResponse {
  code: number;
  data: SettingsData;
}

interface CompletedStamp {
  storeId: number;
  storeName: string;
  issuedDate: string;
}

interface Coupon {
  userId: number;
  storeId: number;
  couponId: number;
  couponName: string;
}

interface ReviewProfileData {
  nickname: string;
  reviews: Review[];
}

interface ReviewProfileResponse {
  code: number;
  data: ReviewProfileData;
}

// ==========================================
// 2. 메인 컴포넌트
// ==========================================
export default function MyPage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [settingsData, setSettingsData] = useState<SettingsData | null>(null);

  const [completedStampCount, setCompletedStampCount] = useState<number>(0);
  const [couponCount, setCouponCount] = useState<number>(0);
  const [myWrittenReviews, setMyWrittenReviews] = useState<Review[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      try {
        const results = await Promise.allSettled([
          axios.get<ProfileResponse>(`${apiUri}/v1/mypage/profile`, {
            headers,
          }),
          axios.get<SettingsResponse>(`${apiUri}/v1/mypage/settings`, {
            headers,
          }),
          axios.get<any>(`${apiUri}/v1/users/stamps/history`, { headers }),
          axios.get<any>(`${apiUri}/v1/users/coupons`, { headers }),
        ]);

        let foundUserId: number | null = null;

        // 1. 프로필
        if (results[0].status === 'fulfilled') {
          const res = results[0].value.data;
          if (res.code === 100 || res.code === 0 || res.code === 200) {
            setProfileData(res.data);
          }
        }

        // 2. 설정
        if (results[1].status === 'fulfilled') {
          const res = results[1].value.data;
          if ([0, 100, 200].includes(res.code)) {
            setSettingsData(res.data);
          }
        }

        // 3. 스탬프 히스토리 (완료된 스탬프 개수)
        if (results[2].status === 'fulfilled') {
          const res = results[2].value.data;
          let count = 0;
          if (res.completedStamps && Array.isArray(res.completedStamps)) {
            count = res.completedStamps.length;
          } else if (res.data?.completedStamps) {
            count = res.data.completedStamps.length;
          } else if (typeof res.completedStampNum === 'number') {
            count = res.completedStampNum;
          }
          setCompletedStampCount(count);
        }

        // 4. 쿠폰 (userId 추출)
        if (results[3].status === 'fulfilled') {
          const res = results[3].value.data;
          let coupons: Coupon[] = [];
          if (Array.isArray(res)) coupons = res;
          else if (res.data && Array.isArray(res.data)) coupons = res.data;
          else if (res.coupons && Array.isArray(res.coupons))
            coupons = res.coupons;
          else if (res.userId) coupons = [res as Coupon];

          setCouponCount(coupons.length);
          if (coupons.length > 0) {
            foundUserId = coupons[0].userId;
          }
        }

        // 5. 내가 쓴 리뷰 목록
        if (foundUserId) {
          try {
            const reviewRes = await axios.get<ReviewProfileResponse>(
              `${apiUri}/v1/reviews/profile/${foundUserId}`,
              { headers }
            );
            if ([0, 100, 200].includes(reviewRes.data.code)) {
              setMyWrittenReviews(reviewRes.data.data.reviews || []);
            }
          } catch (err) {
            console.error(err);
          }
        }
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // ==========================================
  // [로직 수정] 스탬프 개수에 따른 레벨 및 뱃지 계산
  // ==========================================

  // 1. 레벨 계산: 20개마다 1업 (0~19: Lv1, 20~39: Lv2 ...)
  const currentLevel = Math.floor(completedStampCount / 20) + 1;

  // 2. 보유 뱃지 필터링: 현재 레벨보다 작거나 같은 레벨의 뱃지들을 모두 획득
  const unlockedBadges = BADGE_LIST.filter(
    (badge) => badge.level <= currentLevel
  );

  // 대표 뱃지 (설정된 게 있으면 그걸 쓰고, 없으면 획득한 것 중 가장 높은 레벨의 첫번째)
  const representativeBadge = settingsData?.representativeBadgeName
    ? [settingsData.representativeBadgeName]
    : unlockedBadges.length > 0
    ? [unlockedBadges[unlockedBadges.length - 1].name] // 가장 최근 획득한 뱃지
    : ['원두 탐험가'];

  return (
    <div className="w-[393px] min-h-screen bg-gray-100 mx-auto border border-gray-300 relative">
      <div className="overflow-y-auto h-[calc(100vh-80px)]">
        <Header />

        <main className="flex flex-col pb-20">
          {loading ? (
            <div className="bg-white p-6 text-center py-20">
              <span className="text-gray-500">데이터 불러오는 중...</span>
            </div>
          ) : (
            <ProfileCard
              nickname={profileData?.nickname || '닉네임 없음'}
              stampCount={completedStampCount}
              profileImageUrl={settingsData?.profileImageUrl || ''}
              badges={representativeBadge} // 프로필 카드는 대표 뱃지 1개만 표시
              badgeCount={unlockedBadges.length} // 총 보유 뱃지 수
              couponCount={couponCount}
            />
          )}

          <div className="h-2 bg-gray-100"></div>

          <div className="[&_p.text-\[13px\]]:hidden">
            <StampsSection />
          </div>

          <div className="h-2 bg-gray-100"></div>

          {/* 획득한 전체 뱃지 리스트 전달 */}
          <BadgesSection badges={unlockedBadges} />

          <div className="h-2 bg-gray-100"></div>

          <ReviewsSection reviews={myWrittenReviews} />
        </main>
      </div>

      <div className="absolute bottom-0 w-full z-20">
        <UserBottomBar />
      </div>
    </div>
  );
}

// ==========================================
// 3. 하위 컴포넌트들
// ==========================================

const Header = () => (
  <header className="bg-white p-4 flex justify-between items-center sticky top-0 z-10 border-b border-gray-200">
    <BackButton />
    <Link to="/mypage/setting">
      <img src={Setting} alt="Setting" className="w-6 h-6" />
    </Link>
  </header>
);

interface ProfileCardProps {
  nickname: string;
  stampCount: number;
  profileImageUrl: string;
  badges: string[]; // 대표 뱃지 이름
  badgeCount: number; // 총 뱃지 개수
  couponCount: number;
}

const ProfileCard = ({
  nickname,
  stampCount,
  profileImageUrl,
  badges,
  badgeCount,
  couponCount,
}: ProfileCardProps) => (
  <div className="bg-white p-6 flex flex-col items-center">
    {profileImageUrl && profileImageUrl !== 'string' ? (
      <img
        src={profileImageUrl}
        alt="Profile"
        className="w-24 h-24 rounded-full mb-4 object-cover border border-gray-200"
      />
    ) : (
      <div className="w-24 h-24 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-400 text-xs">
        No Image
      </div>
    )}

    <h1 className="text-2xl font-bold mb-2">{nickname}</h1>

    <div className="flex gap-2 my-2 flex-wrap justify-center">
      {badges.map((badgeName, index) => (
        <span
          key={index}
          className="text-xs text-white bg-gray-800 px-3 py-1 rounded-full"
        >
          {badgeName}
        </span>
      ))}
    </div>

    <div className="flex justify-around w-full mt-6">
      <StatItem count={stampCount} label="완료 스탬프" />
      {/* 뱃지 개수는 실제 보유 개수로 표시 */}
      <StatItem count={badgeCount} label="뱃지" />
      <StatItem count={couponCount} label="쿠폰" />
    </div>
  </div>
);

const StatItem = ({ count, label }: { count: number; label: string }) => (
  <div className="text-center">
    <span className="text-2xl font-bold block">{count}</span>
    <span className="text-sm text-gray-500">{label}</span>
  </div>
);

// 뱃지 섹션 Props 수정 (BadgeDef 배열 받기)
const BadgesSection = ({ badges }: { badges: BadgeDef[] }) => (
  <div className="bg-white rounded-lg p-4">
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-bold text-lg">보유 뱃지 ({badges.length})</h2>
      <img src={DownButton} alt="DownButton" className="w-6 h-6" />
    </div>
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {badges.length > 0 ? (
        badges.map((badge) => (
          <BadgeItem key={badge.id} name={badge.name} imgUrl={badge.img} />
        ))
      ) : (
        <div className="text-sm text-gray-400 py-4 w-full text-center">
          획득한 뱃지가 없습니다.
        </div>
      )}
    </div>
  </div>
);

// BadgeItem 수정: CSS 도형 대신 이미지 렌더링
const BadgeItem = ({ name, imgUrl }: { name: string; imgUrl: string }) => (
  <div className="flex flex-col items-center gap-2 min-w-[80px]">
    <div className="w-20 h-20 rounded-full border border-gray-100 bg-white flex items-center justify-center overflow-hidden">
      <img src={imgUrl} alt={name} className="w-full h-full object-cover" />
    </div>
    <span className="text-sm text-gray-700 text-center break-keep w-20 leading-tight">
      {name}
    </span>
  </div>
);

const ReviewsSection = ({ reviews }: { reviews: Review[] }) => (
  <div className="bg-white rounded-lg p-4">
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-bold text-lg">리뷰 ({reviews.length})</h2>
      <img src={DownButton} alt="DownButton" className="w-6 h-6" />
    </div>
    <div className="flex flex-col gap-8">
      {reviews.length > 0 ? (
        reviews.map((review, index) => <ReviewItem key={index} data={review} />)
      ) : (
        <div className="text-gray-400 text-sm text-center py-4">
          작성한 리뷰가 없습니다.
        </div>
      )}
    </div>
  </div>
);

const ReviewItem = ({ data }: { data: Review }) => {
  const rating = parseFloat(data.rate) || 0;
  // ... 날짜 포맷팅 등 기존 로직 유지 ...
  let formattedDate = data.reviewDate;
  try {
    formattedDate = new Date(data.reviewDate).toLocaleDateString('ko-KR');
  } catch (e) {}

  return (
    <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 last:border-0">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">{data.storeName}</h3>
        <span className="text-xs text-[#9CA3AF]">{formattedDate}</span>
      </div>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <img
            key={star}
            src={star <= rating ? FilledStar : EmptyStar}
            alt="star"
            className="w-4 h-4"
          />
        ))}
      </div>
      {data.reviewImageUrl && data.reviewImageUrl !== 'string' && (
        <img
          src={data.reviewImageUrl}
          alt="review"
          className="w-full aspect-square object-cover rounded-lg mt-2 bg-gray-200"
        />
      )}
      <p className="text-sm text-gray-700 mt-2">{data.content}</p>
    </div>
  );
};
