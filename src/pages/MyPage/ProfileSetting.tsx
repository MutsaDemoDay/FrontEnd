// import React, { useState } from 'react';
// import { ChevronLeft, Pencil, MoreVertical, Plus, Star } from 'lucide-react';
// import BackButton from '../../components/BackButton';

// const ProfileSetting = () => {
//   // 상태 관리 (UI 상호작용을 위해 추가)
//   const [nickname, setNickname] = useState('김멋사');
//   const [gender, setGender] = useState('male'); // 'male' | 'female'
//   const [selectedTitle, setSelectedTitle] = useState(0); // 0: 첫번째, 1: 두번째 ...

//   // 칭호 더미 데이터
//   const titles = [
//     { id: 0, name: '전설의 바리스타', icon: '☕' },
//     { id: 1, name: '테이크아웃 장인', icon: '🏃' },
//     { id: 2, name: '고독한 미식가', icon: '🥘' },
//   ];

//   return (
//     <div className="flex justify-center bg-gray-50 min-h-screen py-10">
//       {/* 모바일 컨테이너: 가로 390px 고정 */}
//       <div className="w-[390px] bg-white shadow-xl rounded-xl overflow-hidden flex flex-col relative pb-6">
//         {/* 1. 헤더 */}
//         <header className="relative flex items-center h-14 px-4 mt-2">
//           <div className="absolute left-4">
//             <BackButton />
//           </div>
//           <h1 className="absolute left-0 right-0 text-center text-lg font-bold text-gray-800 pointer-events-none">
//             {/* 중앙 정렬을 위한 공간 확보, 텍스트는 좌측 정렬된 것처럼 보일 수 있으나 이미지상 타이틀 위치 확인하여 조정 */}
//           </h1>
//           {/* 이미지상의 "프로필 설정" 텍스트 위치가 헤더 하단 혹은 좌측 상단일 수 있어 레이아웃 조정 */}
//         </header>

//         {/* 헤더 타이틀 (이미지 스타일: 좌측 정렬, 굵게) */}
//         <div className="px-5 mb-6">
//           <h1 className="text-xl font-bold text-gray-800">프로필 설정</h1>
//         </div>

//         {/* 메인 스크롤 영역 */}
//         <main className="flex-1 px-5 overflow-y-auto scrollbar-hide pb-24">
//           {/* 2. 프로필 이미지 */}
//           <div className="flex justify-center mb-8">
//             <div className="relative">
//               <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
//                 {/* 임시 프로필 이미지 (사람 얼굴) */}
//                 <img
//                   src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
//                   alt="Profile"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               {/* 편집 버튼 (연필) */}
//               <button className="absolute top-0 right-0 bg-gray-400 text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
//                 <Pencil size={14} fill="white" />
//               </button>
//             </div>
//           </div>

//           {/* 3. 닉네임 */}
//           <div className="mb-8">
//             <label className="block text-xs font-medium text-gray-500 mb-1">
//               닉네임
//             </label>
//             <div className="flex items-center border-b border-gray-200 focus-within:border-black pb-2">
//               <input
//                 type="text"
//                 value={nickname}
//                 onChange={(e) => setNickname(e.target.value)}
//                 maxLength={10}
//                 className="flex-1 text-base font-medium text-gray-900 bg-transparent focus:outline-none placeholder-gray-300"
//               />
//               <span className="text-xs text-gray-400">
//                 {nickname.length}/10
//               </span>
//             </div>
//           </div>

//           {/* 4. 대표 칭호 */}
//           <div className="mb-8">
//             <label className="block text-xs font-medium text-gray-500 mb-3">
//               대표 칭호
//             </label>
//             {/* 칭호 컨테이너 (박스 형태) */}
//             <div className="border border-gray-200 rounded-2xl p-4 flex justify-between items-center bg-white">
//               {titles.map((title, index) => {
//                 const isSelected = selectedTitle === index;
//                 return (
//                   <div
//                     key={title.id}
//                     onClick={() => setSelectedTitle(index)}
//                     className="flex flex-col items-center cursor-pointer w-1/3"
//                   >
//                     {/* 칭호 아이콘 (원형) */}
//                     <div
//                       className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all border-2 relative
//                       ${
//                         isSelected
//                           ? 'border-orange-500 bg-white'
//                           : 'border-gray-800 bg-white'
//                       }`}
//                     >
//                       {/* 뱃지 내부 디자인 (별 모양 흉내) */}
//                       <div className="text-center">
//                         <div className="flex justify-center space-x-[2px] mb-1">
//                           {[1, 2, 3, 4, 5].map((star) => (
//                             <Star
//                               key={star}
//                               size={6}
//                               fill="black"
//                               stroke="none"
//                             />
//                           ))}
//                         </div>
//                         <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
//                           VENVATO
//                         </span>
//                         <div className="w-full h-[1px] bg-gray-200 my-[2px]"></div>
//                         {/* 실제 아이콘이나 텍스트 대신 간단한 이모지 사용 */}
//                         <div className="text-lg">{title.icon}</div>
//                       </div>
//                     </div>

//                     {/* 칭호 이름 */}
//                     <span
//                       className={`text-[10px] font-bold tracking-tight whitespace-nowrap
//                       ${isSelected ? 'text-orange-500' : 'text-gray-800'}`}
//                     >
//                       {title.name}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* 5. 성별 */}
//           <div className="mb-8">
//             <label className="block text-xs font-medium text-gray-500 mb-2">
//               성별
//             </label>
//             <div className="flex space-x-3">
//               <button
//                 onClick={() => setGender('male')}
//                 className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors
//                   ${
//                     gender === 'male'
//                       ? 'border-orange-500 text-gray-900 bg-white ring-1 ring-orange-500'
//                       : 'border-gray-200 text-gray-400 bg-white hover:bg-gray-50'
//                   }`}
//               >
//                 남
//               </button>
//               <button
//                 onClick={() => setGender('female')}
//                 className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors
//                   ${
//                     gender === 'female'
//                       ? 'border-orange-500 text-gray-900 bg-white ring-1 ring-orange-500'
//                       : 'border-gray-200 text-gray-400 bg-white hover:bg-gray-50'
//                   }`}
//               >
//                 여
//               </button>
//             </div>
//           </div>

//           {/* 6. 주소지 (기존 코드에 없었으나 이미지에 있어 추가) */}
//           <div className="mb-8">
//             <label className="block text-xs font-medium text-gray-500 mb-2">
//               주소지
//             </label>
//             <div className="flex space-x-2">
//               <input
//                 type="text"
//                 placeholder="지번, 도로명, 건물명으로 검색"
//                 className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-xs placeholder-gray-300 focus:outline-none focus:border-orange-500"
//               />
//               <button className="bg-gray-100 text-gray-600 px-5 rounded-lg text-xs font-medium whitespace-nowrap">
//                 검색
//               </button>
//             </div>
//           </div>

//           {/* 7. 단골 가게 등록 */}
//           <div className="mb-8">
//             <label className="block text-xs font-medium text-gray-500 mb-2">
//               단골 가게 등록
//             </label>
//             <div className="space-y-2">
//               {/* 등록된 가게 아이템 */}
//               <div className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 bg-white">
//                 <div className="flex flex-col">
//                   <span className="text-xs font-bold text-gray-900">
//                     카페나무
//                   </span>
//                   <span className="text-[10px] text-gray-400 mt-0.5">
//                     서울 마포구 와우산로 94 롯폰기 1층 (상수동)
//                   </span>
//                 </div>
//                 <button className="text-gray-300">
//                   <MoreVertical size={16} />
//                 </button>
//               </div>

//               {/* 빈 슬롯 1 */}
//               <button className="w-full py-4 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-200 hover:text-gray-400 transition-colors">
//                 <Plus size={20} strokeWidth={1.5} />
//               </button>

//               {/* 빈 슬롯 2 */}
//               <button className="w-full py-4 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-200 hover:text-gray-400 transition-colors">
//                 <Plus size={20} strokeWidth={1.5} />
//               </button>
//             </div>
//           </div>
//         </main>

//         {/* 8. 하단 저장 버튼 */}
//         <div className="absolute bottom-0 left-0 right-0 p-5 bg-white bg-opacity-90 backdrop-blur-sm">
//           <button className="w-full bg-[#FF5F00] hover:bg-[#e55600] text-white font-bold py-4 rounded-full text-sm shadow-md transition-colors">
//             저장
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileSetting;
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Pencil, MoreVertical, Plus, Star } from 'lucide-react';

// API 기본 주소 설정
const apiUri = 'http://localhost:8080';

// 기본 프로필 이미지 상수
const DEFAULT_PROFILE_IMAGE =
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80';

// 뒤로가기 버튼 컴포넌트
const BackButton = () => (
  <button className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
    <ChevronLeft size={24} />
  </button>
);

// 간단한 토스트 메시지 컴포넌트
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // 3초 후 자동 닫힘
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-[90%] bg-gray-800/90 text-white text-xs py-3 px-4 rounded-lg shadow-lg z-50 flex items-center justify-center animate-fade-in-up backdrop-blur-sm">
      {message}
    </div>
  );
};

const ProfileSetting = () => {
  // --- 상태 관리 ---
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [gender, setGender] = useState('male');
  const [selectedTitle, setSelectedTitle] = useState(0);

  // 오류 메시지 표시용 상태
  const [toastMessage, setToastMessage] = useState('');

  // 칭호 더미 데이터
  const titles = [
    { id: 0, name: '전설의 바리스타', icon: '☕' },
    { id: 1, name: '테이크아웃 장인', icon: '🏃' },
    { id: 2, name: '고독한 미식가', icon: '🥘' },
  ];

  // --- API 연동 (GET) ---
  useEffect(() => {
    const fetchMyInfo = async () => {
      setLoading(true);
      try {
        const baseUrl = apiUri.endsWith('/') ? apiUri.slice(0, -1) : apiUri;
        const targetUrl = `${baseUrl}/v1/rewords/dashboard`;

        console.log(`[API 요청 시작] ${targetUrl}`);

        // 타임아웃 기능을 추가하여 5초 이상 응답 없으면 에러 처리 (선택 사항)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(targetUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();

        if (json.code === 0 && json.data && json.data.myInfo) {
          const { nickname, profileImageUrl } = json.data.myInfo;
          setNickname(nickname || '');
          setProfileImage(profileImageUrl || DEFAULT_PROFILE_IMAGE);
          console.log('데이터 로드 성공:', json.data.myInfo);
        } else {
          // 서버 응답은 왔으나 비즈니스 로직상 에러인 경우
          throw new Error(json.message || '알 수 없는 오류');
        }
      } catch (error) {
        console.warn('API 호출 실패 (데모 데이터 사용):', error);

        // 연결 거부(서버 꺼짐) 등의 에러 발생 시 사용자에게 알림
        if (error.name === 'AbortError') {
          setToastMessage(
            '서버 응답 시간이 초과되었습니다. 데모 모드로 전환합니다.'
          );
        } else if (error.message.includes('Failed to fetch')) {
          setToastMessage('서버에 연결할 수 없습니다. (Localhost 확인 필요)');
        } else {
          setToastMessage(`데이터 로드 실패: ${error.message}`);
        }

        // 에러 발생 시 기본값 세팅 (Fallback)
        setNickname('김멋사');
        setProfileImage(DEFAULT_PROFILE_IMAGE);
      } finally {
        setLoading(false);
      }
    };

    fetchMyInfo();
  }, []);

  // --- 저장 버튼 핸들러 ---
  const handleSave = async () => {
    console.log('저장 요청 데이터:', { nickname, gender, selectedTitle });
    // 실제 저장 로직도 여기에 구현
    setToastMessage('저장되었습니다! (콘솔 확인)');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-50 min-h-screen py-10">
      {/* 모바일 컨테이너: 가로 390px 고정 */}
      <div className="w-[390px] bg-white shadow-xl rounded-xl overflow-hidden flex flex-col relative pb-6">
        {/* 1. 헤더 */}
        <header className="relative flex items-center h-14 px-4 mt-2">
          <div className="absolute left-4">
            <BackButton />
          </div>
        </header>

        {/* 헤더 타이틀 */}
        <div className="px-5 mb-6">
          <h1 className="text-xl font-bold text-gray-800">프로필 설정</h1>
        </div>

        {/* 메인 스크롤 영역 */}
        <main className="flex-1 px-5 overflow-y-auto scrollbar-hide pb-24">
          {/* 2. 프로필 이미지 */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
              </div>
              <button className="absolute top-0 right-0 bg-gray-400 text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-gray-500 transition-colors">
                <Pencil size={14} fill="white" />
              </button>
            </div>
          </div>

          {/* 3. 닉네임 */}
          <div className="mb-8">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              닉네임
            </label>
            <div className="flex items-center border-b border-gray-200 focus-within:border-black pb-2 transition-colors">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={10}
                className="flex-1 text-base font-medium text-gray-900 bg-transparent focus:outline-none placeholder-gray-300"
                placeholder="닉네임을 입력하세요"
              />
              <span className="text-xs text-gray-400">
                {nickname.length}/10
              </span>
            </div>
          </div>

          {/* 4. 대표 칭호 */}
          <div className="mb-8">
            <label className="block text-xs font-medium text-gray-500 mb-3">
              대표 칭호
            </label>
            <div className="border border-gray-200 rounded-2xl p-4 flex justify-between items-center bg-white">
              {titles.map((title, index) => {
                const isSelected = selectedTitle === index;
                return (
                  <div
                    key={title.id}
                    onClick={() => setSelectedTitle(index)}
                    className="flex flex-col items-center cursor-pointer w-1/3 group"
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all border-2 relative
                      ${
                        isSelected
                          ? 'border-orange-500 bg-white shadow-md transform scale-105'
                          : 'border-gray-800 bg-white group-hover:border-gray-400'
                      }`}
                    >
                      <div className="text-center">
                        <div className="flex justify-center space-x-[2px] mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={6}
                              fill="black"
                              stroke="none"
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                          VENVATO
                        </span>
                        <div className="w-full h-[1px] bg-gray-200 my-[2px]"></div>
                        <div className="text-lg">{title.icon}</div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold tracking-tight whitespace-nowrap transition-colors
                      ${isSelected ? 'text-orange-500' : 'text-gray-800'}`}
                    >
                      {title.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. 성별 */}
          <div className="mb-8">
            <label className="block text-xs font-medium text-gray-500 mb-2">
              성별
            </label>
            <div className="flex space-x-3">
              <button
                onClick={() => setGender('male')}
                className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-all
                  ${
                    gender === 'male'
                      ? 'border-orange-500 text-gray-900 bg-white ring-1 ring-orange-500 shadow-sm'
                      : 'border-gray-200 text-gray-400 bg-white hover:bg-gray-50'
                  }`}
              >
                남
              </button>
              <button
                onClick={() => setGender('female')}
                className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-all
                  ${
                    gender === 'female'
                      ? 'border-orange-500 text-gray-900 bg-white ring-1 ring-orange-500 shadow-sm'
                      : 'border-gray-200 text-gray-400 bg-white hover:bg-gray-50'
                  }`}
              >
                여
              </button>
            </div>
          </div>

          {/* 6. 주소지 */}
          <div className="mb-8">
            <label className="block text-xs font-medium text-gray-500 mb-2">
              주소지
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="지번, 도로명, 건물명으로 검색"
                className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-xs placeholder-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors">
                검색
              </button>
            </div>
          </div>

          {/* 7. 단골 가게 등록 */}
          <div className="mb-8">
            <label className="block text-xs font-medium text-gray-500 mb-2">
              단골 가게 등록
            </label>
            <div className="space-y-2">
              <div className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-shadow">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-900">
                    카페나무
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    서울 마포구 와우산로 94 롯폰기 1층 (상수동)
                  </span>
                </div>
                <button className="text-gray-300 hover:text-gray-500 transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>

              <button className="w-full py-4 rounded-lg border border-gray-200 border-dashed bg-white flex items-center justify-center text-gray-300 hover:text-gray-500 hover:border-gray-400 transition-all">
                <Plus size={20} strokeWidth={1.5} />
              </button>

              <button className="w-full py-4 rounded-lg border border-gray-200 border-dashed bg-white flex items-center justify-center text-gray-300 hover:text-gray-500 hover:border-gray-400 transition-all">
                <Plus size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </main>

        {/* 8. 하단 저장 버튼 */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-white/90 backdrop-blur-sm border-t border-gray-100">
          <button
            onClick={handleSave}
            className="w-full bg-[#FF5F00] hover:bg-[#e55600] active:scale-[0.98] text-white font-bold py-4 rounded-full text-sm shadow-md transition-all"
          >
            저장
          </button>
        </div>

        {/* 토스트 메시지 표시 */}
        {toastMessage && (
          <Toast message={toastMessage} onClose={() => setToastMessage('')} />
        )}
      </div>
    </div>
  );
};

export default ProfileSetting;
