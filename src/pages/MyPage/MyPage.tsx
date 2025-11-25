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

// // 1. 새로운 API 명세에 맞춘 타입 정의
// interface Stamp {
//   storeName: string;
//   date: string;
//   stampImageUrl: string;
//   stampReward: string;
// }

// interface Review {
//   storeName: string;
//   rate: string; // API 명세상 string이지만 별점을 위해 숫자 변환 고려 필요
//   content: string;
//   reviewDate: string;
//   reviewImageUrl: string;
// }

// interface MyPageData {
//   nickname: string;
//   totalStampCount: number;
//   reviewCount: number;
//   stamps: Stamp[];
//   reviews: Review[];
//   // profileImageUrl과 badges는 새 API 명세에 없으므로 제외하거나 선택적으로 처리
// }

// interface MyPageResponse {
//   timestamp: string;
//   code: number;
//   message: string;
//   data: MyPageData;
// }

// export default function MyPage() {
//   const [myInfo, setMyInfo] = useState<MyPageData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProfileData = async () => {
//       try {
//         const token = localStorage.getItem('accessToken');

//         const response = await axios.get<MyPageResponse>(
//           `${apiUri}/v1/mypage/profile`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         console.log('서버 응답 전체:', response.data);

//         // 수정된 부분: 실제 서버 메시지("유저 프로필 조회가 완료되었습니다.")를 조건에 추가
//         if (
//           response.data.code === 0 ||
//           response.data.code === 200 ||
//           response.data.message === '유저 프로필 조회가 완료되었습니다.' ||
//           response.data.message === '정상적으로 조회되었습니다.'
//         ) {
//           setMyInfo(response.data.data);
//         } else {
//           console.error('데이터 에러:', response.data.message);
//         }
//       } catch (error) {
//         console.error('API 요청 에러:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfileData();
//   }, []);

//   // API에 뱃지 정보가 없으므로 빈 배열 처리 (UI 유지 목적)
//   const myBadges: string[] = [];

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
//             stampCount={myInfo?.totalStampCount || 0}
//             // API에 프로필 이미지가 없다면 빈 문자열 전달 (기본 이미지 표시됨)
//             profileImageUrl={''}
//             badges={myBadges}
//             reviewCount={myInfo?.reviewCount || 0}
//           />
//         )}

//         <div className="h-2 bg-gray-100"></div>

//         {/* StampsSection은 내부 구현을 모르므로 그대로 둡니다.
//             만약 API 데이터를 써야 한다면 props로 myInfo?.stamps를 전달해야 합니다. */}
//         <StampsSection />

//         <div className="h-2 bg-gray-100"></div>

//         {/* 뱃지 데이터 없음 */}
//         <BadgesSection badges={myBadges} />

//         <div className="h-2 bg-gray-100"></div>

//         {/* API에서 받아온 리뷰 데이터 전달 */}
//         <ReviewsSection reviews={myInfo?.reviews || []} />
//       </main>
//     </div>
//   );
// }

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
//       // 프로필 이미지가 없으므로 기본 박스 표시
//       <div className="w-24 h-24 bg-gray-200 rounded-lg mb-4"></div>
//     )}
//     <div className="hidden w-24 h-24 bg-gray-200 rounded-lg mb-4"></div>

//     <h1 className="text-2xl font-bold mb-2">{nickname}</h1>

//     {/* 뱃지 영역 */}
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
//       <StatItem count={reviewCount} label="쿠폰" />
//     </div>
//   </div>
// );

// const StatItem = ({ count, label }: { count: number; label: string }) => (
//   <div className="text-center">
//     <span className="text-2xl font-bold block">{count}</span>
//     <span className="text-sm text-gray-500">{label}</span>
//   </div>
// );

// // 3. BadgesSection (데이터 없으므로 빈 상태 유지)
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
//       </div>
//     </div>
//     <span className="text-sm text-gray-700 text-center">{label}</span>
//   </div>
// );

// // 4. ReviewsSection 수정: 실제 데이터 매핑
// const ReviewsSection = ({ reviews }: { reviews: Review[] }) => (
//   <div className="bg-white rounded-lg p-4">
//     <div className="flex justify-between items-center mb-4">
//       <h2 className="font-bold text-lg">리뷰({reviews.length})</h2>
//       <img src={DownButton} alt="DownButton" className="w-6 h-6" />
//     </div>
//     <div className="flex flex-col gap-8">
//       {reviews.length > 0 ? (
//         reviews.map((review, index) => <ReviewItem key={index} data={review} />)
//       ) : (
//         <div className="text-sm text-gray-400 py-4 text-center">
//           작성한 리뷰가 없습니다.
//         </div>
//       )}
//     </div>
//   </div>
// );

// // ReviewItem 수정: 데이터 표시
// const ReviewItem = ({ data }: { data: Review }) => {
//   // rate 문자열을 숫자로 변환 (예외 처리 포함)
//   const rating = parseFloat(data.rate) || 0;

//   // 날짜 포맷팅 (ISO string -> YYYY. MM. DD)
//   const formattedDate = new Date(data.reviewDate).toLocaleDateString('ko-KR', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//   });

//   return (
//     <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 last:border-0">
//       <div className="flex justify-between items-center">
//         <h3 className="font-bold">{data.storeName}</h3>
//         <span className="text-xs text-[#9CA3AF]">{formattedDate}</span>
//       </div>
//       <div className="flex">
//         {/* 별점 렌더링 로직 (간단하게 5개 기준) */}
//         {[1, 2, 3, 4, 5].map((star) => (
//           <img
//             key={star}
//             src={star <= rating ? FilledStar : EmptyStar}
//             alt="star"
//             className="w-6 h-6"
//           />
//         ))}
//       </div>

//       {/* 리뷰 이미지가 유효한 경우에만 렌더링 */}
//       {data.reviewImageUrl && data.reviewImageUrl !== 'string' && (
//         <img
//           src={data.reviewImageUrl}
//           alt="review"
//           className="w-full aspect-square object-cover rounded-lg mt-2 bg-gray-200"
//         />
//       )}

//       <p className="text-sm text-gray-700 mt-2">{data.content}</p>
//       <UserBottomBar />
//     </div>
//   );
// };

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

const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

// ==========================================
// 1. 타입 정의
// ==========================================

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
  // 로그상 couponNum으로 들어오는 것 같아 추가 (옵셔널)
  couponNum?: number;
  reviewCount?: number;
  stamps: Stamp[];
  reviews: Review[];
}

interface ProfileResponse {
  timestamp: string;
  code: number;
  message: string;
  data: ProfileData;
}

interface SettingsData {
  profileImageUrl: string;
  representativeBadgeName: string | null; // null 가능성 처리
  gender: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface SettingsResponse {
  timestamp: string;
  code: number;
  message: string;
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
        const results = await Promise.allSettled([
          axios.get<ProfileResponse>(`${apiUri}/v1/mypage/profile`, {
            headers,
          }),
          axios.get<SettingsResponse>(`${apiUri}/v1/mypage/settings`, {
            headers,
          }),
        ]);

        // [1] 프로필 데이터 처리
        const profileResult = results[0];
        if (profileResult.status === 'fulfilled') {
          const res = profileResult.value.data;
          // ✅ [수정] 성공 코드를 100으로 변경 (0, 200도 혹시 모르니 포함)
          if (res.code === 100 || res.code === 0 || res.code === 200) {
            console.log('✅ 프로필 적용 완료:', res.data);
            setProfileData(res.data);
          } else {
            console.warn('⚠️ 프로필 코드 불일치:', res.code);
          }
        }

        // [2] 설정 데이터 처리
        const settingsResult = results[1];
        if (settingsResult.status === 'fulfilled') {
          const res = settingsResult.value.data;
          // ✅ [수정] 성공 코드를 100으로 변경
          if (res.code === 100 || res.code === 0 || res.code === 200) {
            console.log('✅ 설정 데이터 적용 완료:', res.data);
            setSettingsData(res.data);
          } else {
            console.warn('⚠️ 설정 코드 불일치:', res.code);
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

  // 뱃지 데이터 처리 (null 체크)
  const myBadges = settingsData?.representativeBadgeName
    ? [settingsData.representativeBadgeName]
    : [];

  // 리뷰 데이터 처리
  const myReviews = profileData?.reviews || [];

  return (
    <div className="w-[393px] min-h-screen bg-gray-100 mx-auto border border-gray-300 relative">
      <div className="overflow-y-auto h-[calc(100vh-80px)]">
        <Header />

        <main className="flex flex-col pb-20">
          {loading ? (
            <div className="bg-white p-6 text-center py-20">
              <span className="text-gray-500">로딩 중...</span>
            </div>
          ) : (
            <ProfileCard
              nickname={profileData?.nickname || '닉네임 없음'}
              stampCount={profileData?.totalStampCount || 0}
              // 설정 데이터의 이미지 사용
              profileImageUrl={settingsData?.profileImageUrl || ''}
              badges={myBadges}
              // reviewCount가 없으면 배열 길이로 대체
              reviewCount={profileData?.reviewCount ?? myReviews.length}
            />
          )}

          <div className="h-2 bg-gray-100"></div>

          <div className="[&_p.text-\[13px\]]:hidden">
            <StampsSection />
          </div>

          <div className="h-2 bg-gray-100"></div>

          <BadgesSection badges={myBadges} />

          <div className="h-2 bg-gray-100"></div>

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
    {/* 프로필 이미지 처리 */}
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
      <div className="w-24 h-24 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-400 text-xs">
        No Image
      </div>
    )}
    {/* 이미지 에러 시 대체 영역 */}
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
        <span className="text-xs text-gray-400">대표 뱃지가 없습니다.</span>
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
      <h2 className="font-bold text-lg">뱃지</h2>
      <img src={DownButton} alt="DownButton" className="w-6 h-6" />
    </div>
    <div className="flex gap-4 overflow-x-auto pb-2">
      {badges.length > 0 ? (
        badges.map((badgeName, index) => (
          <BadgeItem key={index} label={badgeName} />
        ))
      ) : (
        <div className="text-sm text-gray-400 py-4 w-full text-center">
          설정된 대표 뱃지가 없습니다.
        </div>
      )}
    </div>
  </div>
);

const BadgeItem = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center gap-2 min-w-[80px]">
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

const ReviewsSection = ({ reviews }: { reviews: Review[] }) => (
  <div className="bg-white rounded-lg p-4">
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-bold text-lg">리뷰({reviews.length})</h2>
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

  let formattedDate = '';
  try {
    formattedDate = new Date(data.reviewDate).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch (e) {
    formattedDate = data.reviewDate;
  }

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
