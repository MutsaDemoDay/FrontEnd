// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// import BackButton from '../../components/BackButton';
// import StampsSection from '../../components/StampSection';
// import { UserBottomBar } from '../../components/UserBottomBar';

// // Assets
// import Setting from '../../assets/setting.svg';
// import DownButton from '../../assets/downbutton.svg';
// import FilledStar from '../../assets/filledstar.svg';
// import EmptyStar from '../../assets/emptystar.svg';

// // 뱃지 이미지 Import
// import badge1 from '../../assets/badge1.png';
// import badge21 from '../../assets/badge21.png';
// import badge22 from '../../assets/badge22.png';
// import badge31 from '../../assets/badge31.png';
// import badge32 from '../../assets/badge32.png';
// import badge41 from '../../assets/badge41.png';
// import badge42 from '../../assets/badge42.png';
// import badge51 from '../../assets/badge51.png';
// import badge52 from '../../assets/badge52.png';

// const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

// // ==========================================
// // 0. 뱃지 데이터 정의 (레벨별 획득 뱃지)
// // ==========================================
// interface BadgeDef {
//   id: number;
//   level: number;
//   name: string;
//   img: string;
// }

// const BADGE_LIST: BadgeDef[] = [
//   // Lv 1 (기본)
//   { id: 1, level: 1, name: '원두 탐험가', img: badge1 },
//   // Lv 2 (20개 이상)
//   { id: 2, level: 2, name: '브루 수련생', img: badge21 },
//   { id: 3, level: 2, name: '카페 수집가', img: badge22 },
//   // Lv 3 (40개 이상)
//   { id: 4, level: 3, name: '라떼 장인', img: badge31 },
//   { id: 5, level: 3, name: '오늘의 드립러', img: badge32 },
//   // Lv 4 (60개 이상)
//   { id: 6, level: 4, name: '로스트 마스터', img: badge41 },
//   { id: 7, level: 4, name: '커피 연금술사', img: badge42 },
//   // Lv 5 (80개 이상)
//   { id: 8, level: 5, name: '전설의 바리스타', img: badge51 },
//   { id: 9, level: 5, name: '카페 그랜드마스터', img: badge52 },
// ];

// // 뱃지 이름으로 레벨을 찾는 헬퍼 함수
// const getBadgeLevel = (name: string) => {
//   const badge = BADGE_LIST.find((b) => b.name === name);
//   return badge ? badge.level : 1;
// };

// // ==========================================
// // 1. 타입 정의
// // ==========================================

// interface Stamp {
//   storeName: string;
//   date: string;
//   stampImageUrl: string;
//   stampReward: string;
// }

// interface Review {
//   storeName: string;
//   rate: string;
//   content: string;
//   reviewDate: string;
//   reviewImageUrl: string;
// }

// interface ProfileData {
//   nickname: string;
//   totalStampCount: number;
//   couponNum: number; // ✅ API 응답에 맞춰 필수값(number)으로 처리
//   reviews?: Review[];
//   stamps?: Stamp[];
// }

// interface ProfileResponse {
//   timestamp: string;
//   code: number;
//   message: string;
//   data: ProfileData;
// }

// interface SettingsData {
//   profileImageUrl: string;
//   representativeBadgeName: string | null;
//   gender: string;
//   address: string;
//   latitude: number;
//   longitude: number;
// }

// interface SettingsResponse {
//   code: number;
//   data: SettingsData;
// }

// interface Coupon {
//   userId: number;
//   storeId: number;
//   couponId: number;
//   couponName: string;
// }

// interface ReviewProfileData {
//   nickname: string;
//   reviews: Review[];
// }

// interface ReviewProfileResponse {
//   code: number;
//   data: ReviewProfileData;
// }

// // ==========================================
// // 2. 메인 컴포넌트
// // ==========================================
// export default function MyPage() {
//   const [profileData, setProfileData] = useState<ProfileData | null>(null);
//   const [settingsData, setSettingsData] = useState<SettingsData | null>(null);

//   const [completedStampCount, setCompletedStampCount] = useState<number>(0);
//   const [couponCount, setCouponCount] = useState<number>(0);
//   const [myWrittenReviews, setMyWrittenReviews] = useState<Review[]>([]);

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAllData = async () => {
//       const token = localStorage.getItem('accessToken');
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       const headers = { Authorization: `Bearer ${token}` };

//       try {
//         const results = await Promise.allSettled([
//           axios.get<ProfileResponse>(`${apiUri}/v1/mypage/profile`, {
//             headers,
//           }),
//           axios.get<SettingsResponse>(`${apiUri}/v1/mypage/settings`, {
//             headers,
//           }),
//           axios.get<any>(`${apiUri}/v1/users/stamps/history`, { headers }),
//           axios.get<any>(`${apiUri}/v1/users/coupons`, { headers }),
//         ]);

//         let foundUserId: number | null = null;

//         // 1. 프로필 (여기서 couponNum을 설정합니다)
//         if (results[0].status === 'fulfilled') {
//           const res = results[0].value.data;
//           if (res.code === 100 || res.code === 0 || res.code === 200) {
//             setProfileData(res.data);
//             // ✅ [수정됨] 프로필 API의 couponNum 데이터로 상태 업데이트
//             setCouponCount(res.data.couponNum || 0);
//           }
//         }

//         // 2. 설정
//         if (results[1].status === 'fulfilled') {
//           const res = results[1].value.data;
//           if ([0, 100, 200].includes(res.code)) {
//             setSettingsData(res.data);
//           }
//         }

//         // 3. 스탬프 히스토리
//         if (results[2].status === 'fulfilled') {
//           const res = results[2].value.data;
//           let count = 0;
//           if (res.completedStamps && Array.isArray(res.completedStamps)) {
//             count = res.completedStamps.length;
//           } else if (res.data?.completedStamps) {
//             count = res.data.completedStamps.length;
//           } else if (typeof res.completedStampNum === 'number') {
//             count = res.completedStampNum;
//           }
//           setCompletedStampCount(count);
//         }

//         // 4. 쿠폰 (목록 조회 및 userId 추출용)
//         if (results[3].status === 'fulfilled') {
//           const res = results[3].value.data;
//           let coupons: Coupon[] = [];

//           if (Array.isArray(res)) coupons = res;
//           else if (res.data && Array.isArray(res.data)) coupons = res.data;
//           else if (res.coupons && Array.isArray(res.coupons))
//             coupons = res.coupons;
//           else if (res.userId) coupons = [res as Coupon];

//           // ※ 쿠폰 개수는 위(results[0])에서 이미 설정했으므로 중복 설정하지 않음.
//           //   리뷰 조회를 위한 userId 추출 로직만 유지
//           if (coupons.length > 0) {
//             foundUserId = coupons[0].userId;
//           }
//         }

//         // 5. 내가 쓴 리뷰 목록
//         if (foundUserId) {
//           try {
//             const reviewRes = await axios.get<ReviewProfileResponse>(
//               `${apiUri}/v1/reviews/profile/${foundUserId}`,
//               { headers }
//             );
//             if ([0, 100, 200].includes(reviewRes.data.code)) {
//               setMyWrittenReviews(reviewRes.data.data.reviews || []);
//             }
//           } catch (err) {
//             console.error(err);
//           }
//         }
//       } catch (error) {
//         console.error('API Error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllData();
//   }, []);

//   // 레벨 계산 및 뱃지 필터링
//   const currentLevel = Math.floor(completedStampCount / 20) + 1;
//   const unlockedBadges = BADGE_LIST.filter(
//     (badge) => badge.level <= currentLevel
//   );
//   const representativeBadge = settingsData?.representativeBadgeName
//     ? [settingsData.representativeBadgeName]
//     : unlockedBadges.length > 0
//     ? [unlockedBadges[unlockedBadges.length - 1].name]
//     : ['원두 탐험가'];

//   return (
//     <div className="w-[393px] min-h-screen bg-gray-100 mx-auto border border-gray-300 relative">
//       <div className="overflow-y-auto h-[calc(100vh-80px)]">
//         <Header />

//         <main className="flex flex-col pb-20">
//           {loading ? (
//             <div className="bg-white p-6 text-center py-20">
//               <span className="text-gray-500">데이터 불러오는 중...</span>
//             </div>
//           ) : (
//             <ProfileCard
//               nickname={profileData?.nickname || '닉네임 없음'}
//               stampCount={completedStampCount}
//               profileImageUrl={settingsData?.profileImageUrl || ''}
//               badges={representativeBadge}
//               badgeCount={unlockedBadges.length}
//               couponCount={couponCount}
//             />
//           )}

//           <div className="h-2 bg-gray-100"></div>
//           <div className="[&_p.text-\[13px\]]:hidden">
//             <StampsSection />
//           </div>
//           <div className="h-2 bg-gray-100"></div>

//           <BadgesSection badges={unlockedBadges} />

//           <div className="h-2 bg-gray-100"></div>
//           <ReviewsSection reviews={myWrittenReviews} />
//         </main>
//       </div>
//       <div className="absolute bottom-0 w-full z-20">
//         <UserBottomBar />
//       </div>
//     </div>
//   );
// }

// // ==========================================
// // 3. 하위 컴포넌트들
// // ==========================================

// const Header = () => (
//   <header className="bg-white p-4 flex justify-between items-center sticky top-0 z-10 border-b border-gray-200">
//     <BackButton />
//     <Link to="/mypage/setting">
//       <img src={Setting} alt="Setting" className="w-6 h-6" />
//     </Link>
//   </header>
// );

// interface ProfileCardProps {
//   nickname: string;
//   stampCount: number;
//   profileImageUrl: string;
//   badges: string[];
//   badgeCount: number;
//   couponCount: number;
// }

// const ProfileCard = ({
//   nickname,
//   stampCount,
//   profileImageUrl,
//   badges,
//   badgeCount,
//   couponCount,
// }: ProfileCardProps) => (
//   <div className="bg-white p-6 flex flex-col items-center">
//     {profileImageUrl && profileImageUrl !== 'string' ? (
//       <img
//         src={profileImageUrl}
//         alt="Profile"
//         className="w-24 h-24 rounded-full mb-4 object-cover border border-gray-200"
//       />
//     ) : (
//       <div className="w-24 h-24 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-400 text-xs">
//         No Image
//       </div>
//     )}

//     <h1 className="text-2xl font-bold mb-2">{nickname}</h1>

//     <div className="flex gap-2 my-2 flex-wrap justify-center items-center">
//       {badges.map((badgeName, index) => {
//         const level = getBadgeLevel(badgeName);
//         return (
//           <div key={index} className="flex items-center gap-1.5">
//             <span className="text-sm font-bold text-gray-500">Lv{level}</span>
//             <span className="text-xs text-white bg-[#7B5C48] px-3 py-1.5 rounded-full font-medium">
//               {badgeName}
//             </span>
//           </div>
//         );
//       })}
//     </div>

//     <div className="flex justify-around w-full mt-6">
//       <StatItem count={stampCount} label="완료 스탬프" />
//       <StatItem count={badgeCount} label="뱃지" />
//       {/* ▼▼▼ 쿠폰 항목에 Link 추가 ▼▼▼ */}
//       <Link to="/mypage/couponbox">
//         <StatItem count={couponCount} label="쿠폰" />
//       </Link>
//     </div>
//   </div>
// );

// const StatItem = ({ count, label }: { count: number; label: string }) => (
//   <div className="text-center">
//     <span className="text-2xl font-bold block">{count}</span>
//     <span className="text-sm text-gray-500">{label}</span>
//   </div>
// );

// const BadgesSection = ({ badges }: { badges: BadgeDef[] }) => (
//   <div className="bg-white rounded-lg p-4">
//     <div className="flex justify-between items-center mb-4">
//       <h2 className="font-bold text-lg">보유 뱃지 ({badges.length})</h2>
//       <img src={DownButton} alt="DownButton" className="w-6 h-6" />
//     </div>
//     <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
//       {badges.length > 0 ? (
//         badges.map((badge) => (
//           <BadgeItem
//             key={badge.id}
//             name={badge.name}
//             imgUrl={badge.img}
//             level={badge.level}
//           />
//         ))
//       ) : (
//         <div className="text-sm text-gray-400 py-4 w-full text-center">
//           획득한 뱃지가 없습니다.
//         </div>
//       )}
//     </div>
//   </div>
// );

// const BadgeItem = ({
//   name,
//   imgUrl,
//   level,
// }: {
//   name: string;
//   imgUrl: string;
//   level: number;
// }) => (
//   <div className="flex flex-col items-center gap-1 min-w-[80px]">
//     <div className="w-20 h-20 rounded-full border border-gray-100 bg-white flex items-center justify-center overflow-hidden mb-1">
//       <img src={imgUrl} alt={name} className="w-full h-full object-cover" />
//     </div>
//     <span className="text-[10px] text-gray-500 font-bold">Lv. {level}</span>
//     <span className="text-sm text-gray-700 text-center break-keep w-20 leading-tight">
//       {name}
//     </span>
//   </div>
// );

// const ReviewsSection = ({ reviews }: { reviews: Review[] }) => (
//   <div className="bg-white rounded-lg p-4">
//     <div className="flex justify-between items-center mb-4">
//       <h2 className="font-bold text-lg">리뷰 ({reviews.length})</h2>
//       <img src={DownButton} alt="DownButton" className="w-6 h-6" />
//     </div>
//     <div className="flex flex-col gap-8">
//       {reviews.length > 0 ? (
//         reviews.map((review, index) => <ReviewItem key={index} data={review} />)
//       ) : (
//         <div className="text-gray-400 text-sm text-center py-4">
//           작성한 리뷰가 없습니다.
//         </div>
//       )}
//     </div>
//   </div>
// );

// const ReviewItem = ({ data }: { data: Review }) => {
//   const rating = parseFloat(data.rate) || 0;
//   let formattedDate = data.reviewDate;
//   try {
//     formattedDate = new Date(data.reviewDate).toLocaleDateString('ko-KR');
//   } catch (e) {}

//   return (
//     <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 last:border-0">
//       <div className="flex justify-between items-center">
//         <h3 className="font-bold">{data.storeName}</h3>
//         <span className="text-xs text-[#9CA3AF]">{formattedDate}</span>
//       </div>
//       <div className="flex">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <img
//             key={star}
//             src={star <= rating ? FilledStar : EmptyStar}
//             alt="star"
//             className="w-4 h-4"
//           />
//         ))}
//       </div>
//       {data.reviewImageUrl && data.reviewImageUrl !== 'string' && (
//         <img
//           src={data.reviewImageUrl}
//           alt="review"
//           className="w-full aspect-square object-cover rounded-lg mt-2 bg-gray-200"
//         />
//       )}
//       <p className="text-sm text-gray-700 mt-2">{data.content}</p>
//     </div>
//   );
// };

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import BackButton from '../../components/BackButton';
import StampsSection from '../../components/StampSection'; // 기존 컴포넌트 유지 (필요시 데이터 주입 방식으로 변경 추천)
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
// 0. 뱃지 데이터 정의
// ==========================================
interface BadgeDef {
  id: number;
  level: number;
  name: string;
  img: string;
}

const BADGE_LIST: BadgeDef[] = [
  { id: 1, level: 1, name: '원두 탐험가', img: badge1 },
  { id: 2, level: 2, name: '브루 수련생', img: badge21 },
  { id: 3, level: 2, name: '카페 수집가', img: badge22 },
  { id: 4, level: 3, name: '라떼 장인', img: badge31 },
  { id: 5, level: 3, name: '오늘의 드립러', img: badge32 },
  { id: 6, level: 4, name: '로스트 마스터', img: badge41 },
  { id: 7, level: 4, name: '커피 연금술사', img: badge42 },
  { id: 8, level: 5, name: '전설의 바리스타', img: badge51 },
  { id: 9, level: 5, name: '카페 그랜드마스터', img: badge52 },
];

const getBadgeLevel = (name: string) => {
  const badge = BADGE_LIST.find((b) => b.name === name);
  return badge ? badge.level : 1;
};

// ==========================================
// 1. 타입 정의 (API 응답 기반 최신화)
// ==========================================

interface Stamp {
  storeName: string;
  date: string;
  stampImageUrl: string;
  stampReward: string | null;
}

interface Review {
  storeName: string;
  rate: number; // API 응답에서 숫자로 확인됨
  content: string;
  reviewDate: string;
  reviewImageUrl: string;
}

interface ProfileData {
  nickname: string;
  totalStampCount: number;
  couponNum: number;
  reviews: Review[];  // ✅ 중요: 프로필 데이터 안에 리뷰 포함
  stamps: Stamp[];    // ✅ 중요: 프로필 데이터 안에 스탬프 포함
}

interface ProfileResponse {
  timestamp?: string;
  code: number;
  message: string;
  data: ProfileData;
}

interface SettingsData {
  profileImageUrl: string;
  representativeBadgeName: string | null;
}

interface SettingsResponse {
  code: number;
  data: SettingsData;
}

// ==========================================
// 2. 메인 컴포넌트
// ==========================================
export default function MyPage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [settingsData, setSettingsData] = useState<SettingsData | null>(null);
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
        // 병렬 요청: 프로필(리뷰,스탬프 포함) + 설정(이미지,대표뱃지)
        const results = await Promise.allSettled([
          axios.get<ProfileResponse>(`${apiUri}/v1/mypage/profile`, { headers }),
          axios.get<SettingsResponse>(`${apiUri}/v1/mypage/settings`, { headers }),
        ]);

        // 1. 프로필 데이터 처리
        if (results[0].status === 'fulfilled') {
          const res = results[0].value.data;
          // 100(성공), 200(성공), 0(성공) 모두 처리
          if ([100, 200, 0].includes(res.code)) {
            setProfileData(res.data);
          }
        }

        // 2. 설정 데이터 처리 (프로필 사진 등)
        if (results[1].status === 'fulfilled') {
          const res = results[1].value.data;
          if ([100, 200, 0].includes(res.code)) {
            setSettingsData(res.data);
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

  // 로딩 중 표시
  if (loading) {
    return <div className="min-h-screen bg-white flex justify-center items-center">로딩중...</div>;
  }

  // 데이터 가공
  const nickname = profileData?.nickname || '닉네임';
  const stampCount = profileData?.totalStampCount || 0;
  const couponCount = profileData?.couponNum || 0;
  const myReviews = profileData?.reviews || [];
  
  // 레벨 계산
  const currentLevel = Math.floor(stampCount / 20) + 1;
  const unlockedBadges = BADGE_LIST.filter((badge) => badge.level <= currentLevel);
  
  // 대표 뱃지 (설정값이 없으면 해금된 것 중 가장 높은 것)
  const representativeBadge = settingsData?.representativeBadgeName
    ? [settingsData.representativeBadgeName]
    : unlockedBadges.length > 0
    ? [unlockedBadges[unlockedBadges.length - 1].name]
    : ['원두 탐험가'];

  return (
    <div className="w-[393px] min-h-screen bg-gray-100 mx-auto border border-gray-300 relative">
      <div className="overflow-y-auto h-[calc(100vh-80px)]">
        <Header />

        <main className="flex flex-col pb-20">
          <ProfileCard
            nickname={nickname}
            stampCount={stampCount}
            profileImageUrl={settingsData?.profileImageUrl || ''}
            badges={representativeBadge}
            badgeCount={unlockedBadges.length}
            couponCount={couponCount}
          />

          <div className="h-2 bg-gray-100"></div>
          
          {/* 스탬프 섹션 (기존 컴포넌트 활용 - 필요시 props로 stamps 전달하게 수정 가능) */}
          <div className="[&_p.text-\[13px\]]:hidden">
            <StampsSection />
          </div>
          
          <div className="h-2 bg-gray-100"></div>

          <BadgesSection badges={unlockedBadges} />

          <div className="h-2 bg-gray-100"></div>
          
          {/* ✅ 내 리뷰 섹션 */}
          <ReviewsSection reviews={myReviews} />
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
  badges: string[];
  badgeCount: number;
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

    <div className="flex gap-2 my-2 flex-wrap justify-center items-center">
      {badges.map((badgeName, index) => {
        const level = getBadgeLevel(badgeName);
        return (
          <div key={index} className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-gray-500">Lv{level}</span>
            <span className="text-xs text-white bg-[#7B5C48] px-3 py-1.5 rounded-full font-medium">
              {badgeName}
            </span>
          </div>
        );
      })}
    </div>

    <div className="flex justify-around w-full mt-6">
      <StatItem count={stampCount} label="완료 스탬프" />
      <StatItem count={badgeCount} label="뱃지" />
      <Link to="/mypage/couponbox">
        <StatItem count={couponCount} label="쿠폰" />
      </Link>
    </div>
  </div>
);

const StatItem = ({ count, label }: { count: number; label: string }) => (
  <div className="text-center">
    <span className="text-2xl font-bold block">{count}</span>
    <span className="text-sm text-gray-500">{label}</span>
  </div>
);

const BadgesSection = ({ badges }: { badges: BadgeDef[] }) => (
  <div className="bg-white rounded-lg p-4">
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-bold text-lg">보유 뱃지 ({badges.length})</h2>
      <img src={DownButton} alt="DownButton" className="w-6 h-6 opacity-40" />
    </div>
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {badges.length > 0 ? (
        badges.map((badge) => (
          <BadgeItem
            key={badge.id}
            name={badge.name}
            imgUrl={badge.img}
            level={badge.level}
          />
        ))
      ) : (
        <div className="text-sm text-gray-400 py-4 w-full text-center">
          획득한 뱃지가 없습니다.
        </div>
      )}
    </div>
  </div>
);

const BadgeItem = ({ name, imgUrl, level }: { name: string; imgUrl: string; level: number }) => (
  <div className="flex flex-col items-center gap-1 min-w-[80px]">
    <div className="w-20 h-20 rounded-full border border-gray-100 bg-white flex items-center justify-center overflow-hidden mb-1">
      <img src={imgUrl} alt={name} className="w-full h-full object-cover" />
    </div>
    <span className="text-[10px] text-gray-500 font-bold">Lv. {level}</span>
    <span className="text-sm text-gray-700 text-center break-keep w-20 leading-tight">
      {name}
    </span>
  </div>
);

// ✅ 리뷰 리스트 컴포넌트
const ReviewsSection = ({ reviews }: { reviews: Review[] }) => (
  <div className="bg-white rounded-lg p-4">
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-bold text-lg">리뷰 ({reviews.length})</h2>
      <img src={DownButton} alt="DownButton" className="w-6 h-6 opacity-40" />
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

// 리뷰 아이템 컴포넌트
const ReviewItem = ({ data }: { data: Review }) => {
  // 날짜 변환 (에러 방지)
  let formattedDate = data.reviewDate;
  try {
    formattedDate = new Date(data.reviewDate).toLocaleDateString('ko-KR');
  } catch (e) { /* 원본 유지 */ }

  return (
    <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 last:border-0">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-[#333]">{data.storeName}</h3>
        <span className="text-xs text-[#9CA3AF]">{formattedDate}</span>
      </div>
      
      {/* 별점 */}
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <img
            key={star}
            src={star <= data.rate ? FilledStar : EmptyStar}
            alt="star"
            className="w-[14px] h-[14px]"
          />
        ))}
      </div>

      {/* 리뷰 이미지 */}
      {data.reviewImageUrl && data.reviewImageUrl !== 'string' && (
        <img
          src={data.reviewImageUrl}
          alt="review"
          className="w-full h-[180px] object-cover rounded-[12px] mt-2 bg-gray-100 border border-gray-100"
        />
      )}
      
      {/* 내용 */}
      <p className="text-sm text-[#555] mt-2 whitespace-pre-wrap leading-relaxed">
        {data.content}
      </p>
    </div>
  );
};