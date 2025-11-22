import { Link, useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { UserBottomBar } from '../../components/UserBottomBar';
import setting_mini from '../../assets/setting_mini.png';
import profile_mini from '../../assets/user_mini.png';

export default function Setting() {
  // const navigate = useNavigate();
  // const handleClick = ()=> {
  //   fetchlogout();
  // }

  // async function fetchlogout(){
  //   try{
  //     const apiuri = import.meta.env.VITE_API_URI;
  //     const response = await fetch(`${apiuri}/v1/auth/logout`,{
  //       method:'POST',
  //       headers:{
  //         'Content-Type': 'application/json',
  //         Authorization: Bearer ${localStorage.getItem('accessToken') || ''},
  //     },)
  //   }
  // }

  return (
    <div className="w-[399px] min-h-screen bg-white mx-auto border border-gray-300 overflow-y-auto">
      {/* 1. 설정 페이지 헤더 (페이지 전용) */}
      <SettingsHeader />

      {/* 2. 메인 컨텐츠 영역 */}
      <main className="p-4 flex flex-col gap-3">
        <SettingsLinkButton
          icon={true}
          label="프로필 설정"
          to="/mypage/profilesetting"
        />
        <SettingsLinkButton
          icon={true}
          label="계정 정보"
          to="/mypage/accountsetting"
        />

        {/* 하단 버튼 그룹 (위쪽과 간격 띄우기) 
          👇 'to' 속성이 없으므로 <button>으로 렌더링됩니다.
        */}
        <SettingsLinkButton label="로그아웃" />
      </main>
      <button className="w-20 h-20 bg-black" />
      <UserBottomBar />
    </div>
  );
}

/**
 * 설정 페이지 전용 헤더
 * (뒤로가기 버튼, 중앙 정렬된 제목)
 */
const SettingsHeader = () => (
  <header className="bg-white p-4 flex items-center sticky top-0 z-10 border-b border-gray-200 h-[60px]">
    <div className="relative w-full flex justify-center items-center">
      {/* 뒤로가기 버튼 (absolute로 좌측에 배치) */}
      <div className="absolute left-0">
        {/* <ArrowLeft className="w-6 h-6 text-gray-800 cursor-pointer" /> */}
        <BackButton />
      </div>
      {/* 제목 (중앙 배치) */}
      <h1 className="text-lg font-bold">설정</h1>
    </div>
  </header>
);

/**
 * 재사용 가능한 설정 버튼 컴포넌트
 * 👇 'to' 속성을 받도록 수정되었습니다.
 */
const SettingsLinkButton = ({
  label,
  to, // 👈 'to' 속성 추가
  icon = false,
  className = '',
}: {
  label: string;
  to?: string; // 👈 'to' 속성을 타입에 optional로 추가
  icon?: boolean;
  className?: string;
}) => {
  // 공통 스타일 클래스
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

  // 버튼/링크의 내부 컨텐츠
  const content = (
    <>
      {icon && (
        // 아이콘 플레이스홀더 (이미지상 흰색 원)
        <div className="w-[20px] h-[20px] bg-white rounded-full mr-4 flex-shrink-0">
          {label === '프로필 설정' && <img src={setting_mini}></img>}
          {label === '계정 정보' && <img src={profile_mini}></img>}
        </div>
      )}
      <span className="text-base font-medium">{label}</span>
    </>
  );

  // 'to' 속성이 있으면 Link 컴포넌트로 렌더링
  if (to) {
    return (
      <Link to={to} className={commonClassName}>
        {content}
      </Link>
    );
  }

  // 'to' 속성이 없으면 button 컴포넌트로 렌더링
  return <button className={logoutClassName}>{content}</button>;
};
