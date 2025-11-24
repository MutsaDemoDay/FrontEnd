// import { useEffect, useState } from 'react'; // React Hooks 추가
// import axios from 'axios'; // axios 임포트 (설치 필요)
// import { Link } from 'react-router-dom';

// import BackButton from '../../components/BackButton';
// import StampsSection from '../../components/StampSection';

// import Setting from '../../assets/setting.svg';
// import DownButton from '../../assets/downbutton.svg';
// import FilledStar from '../../assets/filledstar.svg';
// import EmptyStar from '../../assets/emptystar.svg';

// import { UserBottomBar } from '../../components/UserBottomBar';

// // API URI 상수로 정의
// const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

// // 1. API 응답 타입 정의
// interface MyInfo {
//   nickname: string;
//   totalStampSum: number;
//   topPercent: string;
//   profileImageUrl: string;
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
//   // 2. 상태 관리
//   const [myInfo, setMyInfo] = useState<MyInfo | null>(null);
//   const [loading, setLoading] = useState(true);

//   // 3. API 호출
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const token = localStorage.getItem('accessToken');

//         const response = await axios.get<DashboardResponse>(
//           `${apiUri}/v1/rewards/dashboard`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         // [디버깅] 실제 서버가 보내주는 code 값을 확인하기 위해 로그 출력
//         console.log('서버 응답 전체:', response.data);

//         // [수정] 성공 코드가 0이 아닐 수도 있으므로 (예: 200), 조건을 임시로 확장하거나
//         // 콘솔에 찍힌 code 값을 보고 이 부분을 수정해야 합니다.
//         if (
//           response.data.code === 0 ||
//           response.data.code === 200 ||
//           response.data.message === '정상적으로 생성되었습니다.'
//         ) {
//           console.log('데이터 로딩 성공!');
//           setMyInfo(response.data.data.myInfo);
//         } else {
//           console.error(
//             '데이터 불러오기 실패 (Business Code Error):',
//             response.data.message
//           );
//         }
//       } catch (error) {
//         console.error('API 요청 에러 (Network/Server Error):', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   return (
//     <div className="w-[393px] min-h-screen bg-gray-100 mx-auto border border-gray-300 overflow-y-auto">
//       <Header />

//       <main className="flex flex-col">
//         {/* 4. 프로필 카드에 데이터 전달 */}
//         {loading ? (
//           <div className="bg-white p-6 text-center py-20">
//             <span className="text-gray-500">데이터를 불러오는 중입니다...</span>
//           </div>
//         ) : (
//           <ProfileCard
//             nickname={myInfo?.nickname || '닉네임 없음'}
//             stampCount={myInfo?.totalStampSum || 0}
//             profileImageUrl={myInfo?.profileImageUrl || ''}
//             // 뱃지와 리뷰 개수는 API에 없다면 임시 값을 유지하거나 추후 추가
//             badgeCount={2}
//             reviewCount={10}
//           />
//         )}

//         <div className="h-2 bg-gray-100"></div>

//         <StampsSection />

//         <div className="h-2 bg-gray-100"></div>

//         <BadgesSection />

//         <div className="h-2 bg-gray-100"></div>

//         <ReviewsSection />
//       </main>
//     </div>
//   );
// }

// // Header 컴포넌트
// const Header = () => (
//   <header className="bg-white p-4 flex justify-between items-center sticky top-0 z-10 border-b border-gray-200">
//     <BackButton />
//     <Link to="/mypage/setting">
//       <img src={Setting} alt="Setting" className="w-6 h-6" />
//     </Link>
//   </header>
// );

// // 5. 프로필 카드 컴포넌트
// interface ProfileCardProps {
//   nickname: string;
//   stampCount: number;
//   profileImageUrl: string;
//   badgeCount: number;
//   reviewCount: number;
// }

// const ProfileCard = ({
//   nickname,
//   stampCount,
//   profileImageUrl,
//   badgeCount,
//   reviewCount,
// }: ProfileCardProps) => (
//   <div className="bg-white p-6 flex flex-col items-center">
//     {/* 프로필 이미지 처리 */}
//     {profileImageUrl && profileImageUrl !== 'string' ? (
//       <img
//         src={profileImageUrl}
//         alt="Profile"
//         className="w-24 h-24 rounded-full mb-4 object-cover border border-gray-200"
//         onError={(e) => {
//           // 이미지 로드 실패 시 회색 박스로 대체 (fallback)
//           (e.target as HTMLImageElement).style.display = 'none';
//           (e.target as HTMLImageElement).nextElementSibling?.classList.remove(
//             'hidden'
//           );
//         }}
//       />
//     ) : (
//       <div className="w-24 h-24 bg-gray-200 rounded-lg mb-4"></div>
//     )}

//     {/* 이미지 로드 실패 시 보여줄 백업 요소 (필요 시 구현) */}
//     <div className="hidden w-24 h-24 bg-gray-200 rounded-lg mb-4"></div>

//     <h1 className="text-2xl font-bold mb-2">{nickname}</h1>

//     {/* 뱃지 (하드코딩 유지) */}
//     <div className="flex gap-2 my-2">
//       <span className="text-xs text-white bg-gray-800 px-3 py-1 rounded-full">
//         라떼 마스터
//       </span>
//       <span className="text-xs text-white bg-gray-800 px-3 py-1 rounded-full">
//         고독한 미식가
//       </span>
//     </div>

//     {/* 스탯 */}
//     <div className="flex justify-around w-full mt-6">
//       <StatItem count={stampCount} label="현재 스탬프" />
//       <StatItem count={badgeCount} label="뱃지" />
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

// // --- 기타 섹션 컴포넌트 ---

// const BadgesSection = () => (
//   <div className="bg-white rounded-lg p-4">
//     <div className="flex justify-between items-center mb-4">
//       <h2 className="font-bold text-lg">뱃지(2)</h2>
//       <img src={DownButton} alt="DownButton" className="w-6 h-6" />
//     </div>
//     <div className="flex gap-4">
//       <BadgeItem label="고독한 미식가" />
//       <BadgeItem label="라떼 마스터" />
//     </div>
//   </div>
// );

// const BadgeItem = ({ label }: { label: string }) => (
//   <div className="flex flex-col items-center gap-2">
//     <div className="w-20 h-20 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center">
//       <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center relative overflow-hidden">
//         <div className="w-12 h-12 rounded-full border-[3px] border-white"></div>
//         <div className="absolute w-10 h-[3px] bg-white rotate-90"></div>
//         <div className="absolute w-10 h-[3px] bg-white"></div>
//         <div className="absolute w-10 h-[3px] bg-white rotate-45"></div>
//         <div className="absolute w-10 h-[3px] bg-white -rotate-45"></div>
//       </div>
//     </div>
//     <span className="text-sm text-gray-700">{label}</span>
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
//       <span className="text-xs text-(--fill-color3)">2025. 08. 04</span>
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
//       집 근처에 즌 카페가 여기라 한번 가봤는데 너무 좋아요
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

// 1. API 응답 타입 정의 (badges 배열 추가)
interface MyInfo {
  nickname: string;
  totalStampSum: number;
  topPercent: string;
  profileImageUrl: string;
  badges?: string[]; // [추가] 백엔드에서 이 필드를 리스트로 줘야 함
}

interface DashboardResponse {
  timestamp: string;
  code: number;
  message: string;
  data: {
    myInfo: MyInfo;
    topStampers: any[];
  };
}

export default function MyPage() {
  const [myInfo, setMyInfo] = useState<MyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        const response = await axios.get<DashboardResponse>(
          `${apiUri}/v1/rewards/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('서버 응답 전체:', response.data);

        if (
          response.data.code === 0 ||
          response.data.code === 200 ||
          response.data.message === '정상적으로 생성되었습니다.' // 메시지 조건은 API에 맞게 조정 필요
        ) {
          setMyInfo(response.data.data.myInfo);
        } else {
          console.error('데이터 에러:', response.data.message);
        }
      } catch (error) {
        console.error('API 요청 에러:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 뱃지 데이터 안전하게 가져오기 (없으면 빈 배열)
  const myBadges = myInfo?.badges || [];

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
            nickname={myInfo?.nickname || '닉네임 없음'}
            stampCount={myInfo?.totalStampSum || 0}
            profileImageUrl={myInfo?.profileImageUrl || ''}
            // 뱃지 리스트 전달
            badges={myBadges}
            reviewCount={10} // 리뷰 개수도 API에 없다면 나중에 추가 필요
          />
        )}

        <div className="h-2 bg-gray-100"></div>

        <StampsSection />

        <div className="h-2 bg-gray-100"></div>

        {/* 뱃지 섹션에도 데이터 전달 */}
        <BadgesSection badges={myBadges} />

        <div className="h-2 bg-gray-100"></div>

        <ReviewsSection />
      </main>
    </div>
  );
}

const Header = () => (
  <header className="bg-white p-4 flex justify-between items-center sticky top-0 z-10 border-b border-gray-200">
    <BackButton />
    <Link to="/mypage/setting">
      <img src={Setting} alt="Setting" className="w-6 h-6" />
    </Link>
  </header>
);

// 2. ProfileCard: badges prop 추가 및 렌더링 수정
interface ProfileCardProps {
  nickname: string;
  stampCount: number;
  profileImageUrl: string;
  badges: string[]; // string 배열로 변경
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

    {/* 뱃지 동적 렌더링 */}
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
      {/* 뱃지 개수도 배열의 길이로 표시 */}
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

// 3. BadgesSection: badges prop 추가 및 렌더링 수정
const BadgesSection = ({ badges }: { badges: string[] }) => (
  <div className="bg-white rounded-lg p-4">
    <div className="flex justify-between items-center mb-4">
      {/* 뱃지 개수 동적 표시 */}
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

// ReviewsSection (기존 유지)
const ReviewsSection = () => (
  <div className="bg-white rounded-lg p-4">
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-bold text-lg">리뷰(10)</h2>
      <img src={DownButton} alt="DownButton" className="w-6 h-6" />
    </div>
    <div className="flex flex-col gap-8">
      <ReviewItem />
      <ReviewItem />
    </div>
  </div>
);

const ReviewItem = () => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between items-center">
      <h3 className="font-bold">카페나무</h3>
      <span className="text-xs text-[#9CA3AF]">2025. 08. 04</span>
    </div>
    <div className="flex">
      <img src={FilledStar} alt="FilledStar" className="w-6 h-6" />
      <img src={FilledStar} alt="FilledStar" className="w-6 h-6" />
      <img src={FilledStar} alt="FilledStar" className="w-6 h-6" />
      <img src={EmptyStar} alt="EmptyStar" className="w-6 h-6" />
      <img src={EmptyStar} alt="EmptyStar" className="w-6 h-6" />
    </div>
    <div className="w-full aspect-square bg-gray-200 rounded-lg mt-2"></div>
    <p className="text-sm text-gray-700 mt-2">
      집 근처에 좋은 카페가 여기라 한번 가봤는데 너무 좋아요
    </p>
    <UserBottomBar />
  </div>
);
