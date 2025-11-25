// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// import BackButton from '../../components/BackButton';
// import StampsSection from '../../components/StampSection';

// import Setting from '../../assets/setting.svg';
// import DownButton from '../../assets/downbutton.svg';
// import FilledStar from '../../assets/filledstar.svg';
// import EmptyStar from '../../assets/emptystar.svg';

// import { UserBottomBar } from '../../components/UserBottomBar';

// const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

// // ... (인터페이스 정의 생략 - 기존과 동일) ...
// interface MyInfo {
//   nickname: string;
//   totalStampSum: number;
//   topPercent: string;
//   profileImageUrl: string;
//   badges?: string[];
// }

// interface DashboardResponse {
//   timestamp: string;
//   code: number;
//   message: string;
//   data: {
//     myInfo: MyInfo;
//     topStampers: any[];
//   };
// }

// export default function MyPage() {
//   const [myInfo, setMyInfo] = useState<MyInfo | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // ... (useEffect 내부 로직 기존과 동일) ...
//     const fetchDashboardData = async () => {
//       try {
//         const token = localStorage.getItem('accessToken');
//         const response = await axios.get<DashboardResponse>(
//           `${apiUri}/v1/rewards/dashboard`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         if (response.data.code === 0 || response.data.code === 200) {
//           setMyInfo(response.data.data.myInfo);
//         }
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDashboardData();
//   }, []);

//   const myBadges = myInfo?.badges || [];

//   return (
//     <div className="w-[393px] min-h-screen bg-gray-100 mx-auto border border-gray-300 overflow-y-auto">
//       <Header />

//       <main className="flex flex-col">
//         {loading ? (
//           <div className="bg-white p-6 text-center py-20">
//             <span className="text-gray-500">로딩 중...</span>
//           </div>
//         ) : (
//           <ProfileCard
//             nickname={myInfo?.nickname || '닉네임 없음'}
//             stampCount={myInfo?.totalStampSum || 0}
//             profileImageUrl={myInfo?.profileImageUrl || ''}
//             badges={myBadges}
//             reviewCount={10}
//           />
//         )}

//         <div className="h-2 bg-gray-100"></div>

//         {/* ✅ [수정된 부분] CSS 선택자로 하위의 특정 p태그(안내 문구)만 숨김 처리 */}
//         {/* 설명: [&_p.text-\[13px\]]:hidden -> 이 div 안의 p태그 중 text-[13px] 클래스를 가진 녀석을 숨겨라 */}
//         <div className="[&_p.text-\[13px\]]:hidden">
//           <StampsSection />
//         </div>

//         <div className="h-2 bg-gray-100"></div>

//         <BadgesSection badges={myBadges} />

//         <div className="h-2 bg-gray-100"></div>

//         <ReviewsSection />
//       </main>
//     </div>
//   );
// }

// // ... (나머지 Header, ProfileCard, StatItem, BadgesSection, ReviewsSection 등 하단 컴포넌트는 기존 코드 그대로 유지) ...
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
//   reviewCount: number;
// }

// const ProfileCard = ({
//   nickname,
//   stampCount,
//   profileImageUrl,
//   badges,
//   reviewCount,
// }: ProfileCardProps) => (
//   <div className="bg-white p-6 flex flex-col items-center">
//     {profileImageUrl && profileImageUrl !== 'string' ? (
//       <img
//         src={profileImageUrl}
//         alt="Profile"
//         className="w-24 h-24 rounded-full mb-4 object-cover border border-gray-200"
//         onError={(e) => {
//           (e.target as HTMLImageElement).style.display = 'none';
//           (e.target as HTMLImageElement).nextElementSibling?.classList.remove(
//             'hidden'
//           );
//         }}
//       />
//     ) : (
//       <div className="w-24 h-24 bg-gray-200 rounded-lg mb-4"></div>
//     )}
//     <div className="hidden w-24 h-24 bg-gray-200 rounded-lg mb-4"></div>

//     <h1 className="text-2xl font-bold mb-2">{nickname}</h1>

//     <div className="flex gap-2 my-2 flex-wrap justify-center">
//       {badges.length > 0 ? (
//         badges.map((badgeName, index) => (
//           <span
//             key={index}
//             className="text-xs text-white bg-gray-800 px-3 py-1 rounded-full"
//           >
//             {badgeName}
//           </span>
//         ))
//       ) : (
//         <span className="text-xs text-gray-400">획득한 뱃지가 없습니다.</span>
//       )}
//     </div>

//     <div className="flex justify-around w-full mt-6">
//       <StatItem count={stampCount} label="현재 스탬프" />
//       <StatItem count={badges.length} label="뱃지" />
//       <StatItem count={reviewCount} label="리뷰" />
//     </div>
//   </div>
// );

// const StatItem = ({ count, label }: { count: number; label: string }) => (
//   <div className="text-center">
//     <span className="text-2xl font-bold block">{count}</span>
//     <span className="text-sm text-gray-500">{label}</span>
//   </div>
// );

// const BadgesSection = ({ badges }: { badges: string[] }) => (
//   <div className="bg-white rounded-lg p-4">
//     <div className="flex justify-between items-center mb-4">
//       <h2 className="font-bold text-lg">뱃지({badges.length})</h2>
//       <img src={DownButton} alt="DownButton" className="w-6 h-6" />
//     </div>
//     <div className="flex gap-4 overflow-x-auto pb-2">
//       {badges.length > 0 ? (
//         badges.map((badgeName, index) => (
//           <BadgeItem key={index} label={badgeName} />
//         ))
//       ) : (
//         <div className="text-sm text-gray-400 py-4">
//           아직 획득한 뱃지가 없어요.
//         </div>
//       )}
//     </div>
//   </div>
// );

// const BadgeItem = ({ label }: { label: string }) => (
//   <div className="flex flex-col items-center gap-2 min-w-[80px]">
//     <div className="w-20 h-20 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center">
//       <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center relative overflow-hidden">
//         <div className="w-12 h-12 rounded-full border-[3px] border-white"></div>
//         <div className="absolute w-10 h-[3px] bg-white rotate-90"></div>
//         <div className="absolute w-10 h-[3px] bg-white"></div>
//         <div className="absolute w-10 h-[3px] bg-white rotate-45"></div>
//         <div className="absolute w-10 h-[3px] bg-white -rotate-45"></div>
//       </div>
//     </div>
//     <span className="text-sm text-gray-700 text-center">{label}</span>
//   </div>
// );

// const ReviewsSection = () => (
//   <div className="bg-white rounded-lg p-4">
//     <div className="flex justify-between items-center mb-4">
//       <h2 className="font-bold text-lg">리뷰(10)</h2>
//       <img src={DownButton} alt="DownButton" className="w-6 h-6" />
//     </div>
//     <div className="flex flex-col gap-8">
//       <ReviewItem />
//       <ReviewItem />
//     </div>
//   </div>
// );

// const ReviewItem = () => (
//   <div className="flex flex-col gap-2">
//     <div className="flex justify-between items-center">
//       <h3 className="font-bold">카페나무</h3>
//       <span className="text-xs text-[#9CA3AF]">2025. 08. 04</span>
//     </div>
//     <div className="flex">
//       <img src={FilledStar} alt="FilledStar" className="w-6 h-6" />
//       <img src={FilledStar} alt="FilledStar" className="w-6 h-6" />
//       <img src={FilledStar} alt="FilledStar" className="w-6 h-6" />
//       <img src={EmptyStar} alt="EmptyStar" className="w-6 h-6" />
//       <img src={EmptyStar} alt="EmptyStar" className="w-6 h-6" />
//     </div>
//     <div className="w-full aspect-square bg-gray-200 rounded-lg mt-2"></div>
//     <p className="text-sm text-gray-700 mt-2">
//       집 근처에 좋은 카페가 여기라 한번 가봤는데 너무 좋아요
//     </p>
//     <UserBottomBar />
//   </div>
// );

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import BackButton from '../../components/BackButton';
import StampsSection from '../../components/StampSection';

import Setting from '../../assets/setting.svg';
import DownButton from '../../assets/downbutton.svg';
import FilledStar from '../../assets/filledstar.svg';
import EmptyStar from '../../assets/emptystar.svg';

import { UserBottomBar } from '../../components/UserBottomBar';

const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

// ✅ [수정] 새로운 API 명세에 맞춘 인터페이스 정의
interface Stamp {
  storeName: string;
  date: string;
  stampImageUrl: string;
  stampReward: string;
}

interface Review {
  storeName: string;
  rate: string; // "5" 등의 문자열로 온다고 가정
  content: string;
  reviewDate: string;
  reviewImageUrl: string;
}

interface ProfileData {
  nickname: string;
  totalStampCount: number;
  reviewCount: number;
  stamps: Stamp[];
  reviews: Review[];
}

interface ProfileResponse {
  timestamp: string;
  code: number;
  message: string;
  data: ProfileData;
}

export default function MyPage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        // ✅ [수정] API 엔드포인트 변경 (/v1/mypage/profile)
        const response = await axios.get<ProfileResponse>(
          `${apiUri}/v1/mypage/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.code === 0 || response.data.code === 200) {
          setProfileData(response.data.data);
        }
      } catch (error) {
        console.error('프로필 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  // 새 API에는 뱃지 데이터가 없으므로 빈 배열 처리
  const myBadges: string[] = [];
  const myReviews = profileData?.reviews || [];

  return (
    <div className="w-[393px] min-h-screen bg-gray-100 mx-auto border border-gray-300 overflow-y-auto">
      <Header />

      <main className="flex flex-col">
        {loading ? (
          <div className="bg-white p-6 text-center py-20">
            <span className="text-gray-500">로딩 중...</span>
          </div>
        ) : (
          <ProfileCard
            nickname={profileData?.nickname || '닉네임 없음'}
            stampCount={profileData?.totalStampCount || 0}
            // 새 API에 프로필 이미지가 없으므로 빈 문자열 처리 (ProfileCard 내부에서 기본 이미지 처리됨)
            profileImageUrl={''}
            badges={myBadges}
            reviewCount={profileData?.reviewCount || 0}
          />
        )}

        <div className="h-2 bg-gray-100"></div>

        {/* 기존 스탬프 섹션 유지 */}
        <div className="[&_p.text-\[13px\]]:hidden">
          <StampsSection />
        </div>

        <div className="h-2 bg-gray-100"></div>

        <BadgesSection badges={myBadges} />

        <div className="h-2 bg-gray-100"></div>

        {/* ✅ [수정] 리뷰 데이터를 props로 전달 */}
        <ReviewsSection reviews={myReviews} />
      </main>
    </div>
  );
}

// ... (Header는 기존과 동일) ...
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
  reviewCount: number;
}

const ProfileCard = ({
  nickname,
  stampCount,
  profileImageUrl,
  badges,
  reviewCount,
}: ProfileCardProps) => (
  <div className="bg-white p-6 flex flex-col items-center">
    {profileImageUrl && profileImageUrl !== 'string' ? (
      <img
        src={profileImageUrl}
        alt="Profile"
        className="w-24 h-24 rounded-full mb-4 object-cover border border-gray-200"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
          (e.target as HTMLImageElement).nextElementSibling?.classList.remove(
            'hidden'
          );
        }}
      />
    ) : (
      <div className="w-24 h-24 bg-gray-200 rounded-lg mb-4"></div>
    )}
    <div className="hidden w-24 h-24 bg-gray-200 rounded-lg mb-4"></div>

    <h1 className="text-2xl font-bold mb-2">{nickname}</h1>

    <div className="flex gap-2 my-2 flex-wrap justify-center">
      {badges.length > 0 ? (
        badges.map((badgeName, index) => (
          <span
            key={index}
            className="text-xs text-white bg-gray-800 px-3 py-1 rounded-full"
          >
            {badgeName}
          </span>
        ))
      ) : (
        <span className="text-xs text-gray-400">획득한 뱃지가 없습니다.</span>
      )}
    </div>

    <div className="flex justify-around w-full mt-6">
      <StatItem count={stampCount} label="현재 스탬프" />
      <StatItem count={badges.length} label="뱃지" />
      <StatItem count={reviewCount} label="리뷰" />
    </div>
  </div>
);

const StatItem = ({ count, label }: { count: number; label: string }) => (
  <div className="text-center">
    <span className="text-2xl font-bold block">{count}</span>
    <span className="text-sm text-gray-500">{label}</span>
  </div>
);

const BadgesSection = ({ badges }: { badges: string[] }) => (
  <div className="bg-white rounded-lg p-4">
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-bold text-lg">뱃지({badges.length})</h2>
      <img src={DownButton} alt="DownButton" className="w-6 h-6" />
    </div>
    <div className="flex gap-4 overflow-x-auto pb-2">
      {badges.length > 0 ? (
        badges.map((badgeName, index) => (
          <BadgeItem key={index} label={badgeName} />
        ))
      ) : (
        <div className="text-sm text-gray-400 py-4">
          아직 획득한 뱃지가 없어요.
        </div>
      )}
    </div>
  </div>
);

const BadgeItem = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center gap-2 min-w-[80px]">
    {/* 뱃지 아이콘 렌더링 로직 (기존 동일) */}
    <div className="w-20 h-20 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center relative overflow-hidden">
        <div className="w-12 h-12 rounded-full border-[3px] border-white"></div>
        <div className="absolute w-10 h-[3px] bg-white rotate-90"></div>
        <div className="absolute w-10 h-[3px] bg-white"></div>
        <div className="absolute w-10 h-[3px] bg-white rotate-45"></div>
        <div className="absolute w-10 h-[3px] bg-white -rotate-45"></div>
      </div>
    </div>
    <span className="text-sm text-gray-700 text-center">{label}</span>
  </div>
);

// ✅ [수정] 리뷰 리스트를 받아서 렌더링하도록 변경
const ReviewsSection = ({ reviews }: { reviews: Review[] }) => (
  <div className="bg-white rounded-lg p-4">
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-bold text-lg">리뷰({reviews.length})</h2>
      <img src={DownButton} alt="DownButton" className="w-6 h-6" />
    </div>
    <div className="flex flex-col gap-8">
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <ReviewItem key={index} review={review} />
        ))
      ) : (
        <div className="text-gray-400 text-sm text-center py-4">
          작성한 리뷰가 없습니다.
        </div>
      )}
    </div>
  </div>
);

// ✅ [수정] 개별 리뷰 데이터를 받아 렌더링하도록 변경
const ReviewItem = ({ review }: { review: Review }) => {
  // 날짜 포맷팅 (YYYY-MM-DDT... -> YYYY. MM. DD)
  const formattedDate = new Date(review.reviewDate)
    .toLocaleDateString('ko-KR')
    .replace(/\.$/, '');

  // 별점 계산 (문자열 rate -> 숫자 변환)
  const rating = parseInt(review.rate) || 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">{review.storeName}</h3>
        <span className="text-xs text-[#9CA3AF]">{formattedDate}</span>
      </div>

      {/* 별점 렌더링 */}
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <img
            key={star}
            src={star <= rating ? FilledStar : EmptyStar}
            alt={star <= rating ? 'FilledStar' : 'EmptyStar'}
            className="w-6 h-6"
          />
        ))}
      </div>

      {review.reviewImageUrl && review.reviewImageUrl !== 'string' ? (
        <img
          src={review.reviewImageUrl}
          alt="Review"
          className="w-full aspect-square object-cover rounded-lg mt-2"
        />
      ) : (
        <div className="w-full aspect-square bg-gray-200 rounded-lg mt-2 hidden"></div>
      )}

      <p className="text-sm text-gray-700 mt-2">{review.content}</p>
      <UserBottomBar />
    </div>
  );
};
