import { Link, useNavigate } from 'react-router-dom'; // 1. useNavigate 추가
import BackButton from '../../components/BackButton';
import { UserBottomBar } from '../../components/UserBottomBar';
import setting_mini from '../../assets/setting_mini.png';
import profile_mini from '../../assets/user_mini.png';

// API 주소 (환경변수나 상수로 관리하는 값을 사용하세요)
const API_BASE_URL = import.meta.env.VITE_API_URI || 'http://localhost:8080';

export default function Setting() {
  const navigate = useNavigate(); // 이동을 위한 훅

  // 2. 로그아웃 핸들러 함수
  const handleLogout = async () => {
    try {
      // 저장된 토큰 가져오기 (localStorage에 'accessToken'으로 저장되어 있다고 가정)
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${API_BASE_URL}/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 토큰이 필요한 경우 헤더에 추가 (필요 없다면 제거하세요)
          Authorization: token ? `Bearer ${token}` : '',
        },
        // 만약 정말로 body에 특정 데이터를 보내야 한다면 여기에 body: JSON.stringify({...}) 추가
      });

      if (response.ok) {
        const data = await response.json();

        // 서버 응답 코드 확인 (code: 0 이 성공이라고 가정)
        if (data.code === 0 || response.status === 200) {
          // 1. 로컬 스토리지 클리어 (토큰 삭제)
          localStorage.clear();
          // 또는: localStorage.removeItem('accessToken');

          // 2. 로그인 페이지로 이동
          alert('로그아웃 되었습니다.');
          navigate('/'); // 로그인 페이지 경로로 수정해주세요
        } else {
          console.error('로그아웃 실패:', data.message);
        }
      } else {
        console.error('서버 요청 실패');
      }
    } catch (error) {
      console.error('로그아웃 중 에러 발생:', error);
    }
  };

  return (
    <div className="w-[399px] min-h-screen bg-white mx-auto border border-gray-300 overflow-y-auto">
      <SettingsHeader />

      <main className="p-4 flex flex-col gap-3">
        <SettingsLinkButton
          icon={true}
          label="프로필 설정"
          to="/mypage/profilesetting"
        />
        <SettingsLinkButton
          icon={true}
          label="계정 관리"
          to="/mypage/accountsetting"
        />

        {/* 3. onClick 핸들러 전달 */}
        <SettingsLinkButton label="로그아웃" onClick={handleLogout} />
      </main>
      <UserBottomBar />
    </div>
  );
}

const SettingsHeader = () => (
  <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-200 h-[60px]">
    <div className="relative w-full flex justify-center items-center">
      <div className="absolute left-0">
        <BackButton />
      </div>
      <h1 className="text-lg font-bold">설정</h1>
    </div>
  </header>
);

/**
 * 재사용 가능한 설정 버튼 컴포넌트
 * onClick 속성 추가됨
 */
const SettingsLinkButton = ({
  label,
  to,
  icon = false,
  className = '',
  onClick, // 👈 onClick props 받아오기
}: {
  label: string;
  to?: string;
  icon?: boolean;
  className?: string;
  onClick?: () => void; // 👈 타입 정의 추가
}) => {
  const commonClassName = `
    w-[340px] h-[60px] p-6 bg-gray-100 rounded-[20px]
    flex items-center text-left 
    hover:bg-gray-200 active:bg-gray-300 transition-colors
    ${className}
  `;
  const logoutClassName = `
    w-[340px] h-[60px] bg-[#FFF6F6] rounded-[20px] items-center justify-center text-[#A62F2F] cursor-pointer
    flex hover:bg-[#FFDADA] active:bg-[#FFBABA] transition-colors mt-10
  `;

  const content = (
    <>
      {icon && (
        <div className="w-[20px] h-[20px] bg-white rounded-full mr-4 flex-shrink-0">
          {label === '프로필 설정' && <img src={setting_mini} alt="setting" />}
          {label === '계정 관리' && <img src={profile_mini} alt="profile" />}
        </div>
      )}
      <span className="text-base font-medium">{label}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={commonClassName}>
        {content}
      </Link>
    );
  }

  // 👈 button 태그에 onClick 연결
  return (
    <button className={logoutClassName} onClick={onClick}>
      {content}
    </button>
  );
};
