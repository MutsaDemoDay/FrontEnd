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

// [설정] .env 설정이 없으면 기본값 사용
const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

// 뒤로가기 컴포넌트
const BackButton = () => (
  <button className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors">
    <ChevronLeft size={24} />
  </button>
);

const ProfileSetting = () => {
  // --- 상태 관리 ---
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('김멋사');
  const [gender, setGender] = useState('male'); // 'male' | 'female'
  const [selectedTitle, setSelectedTitle] = useState(0);
  const [address, setAddress] = useState('');
  const [profileImage, setProfileImage] = useState('');

  // 칭호 리스트
  const titles = [
    { id: 0, name: '전설의 바리스타', icon: '☕' },
    { id: 1, name: '테이크아웃 장인', icon: '🏃' },
    { id: 2, name: '고독한 미식가', icon: '🥘' },
  ];

  // --- API 호출 및 데이터 처리 ---
  useEffect(() => {
    const fetchProfileSettings = async () => {
      try {
        setLoading(true);

        // 1. 실제 API 요청 시도
        console.log(`Fetching from: ${apiUri}/v1/mypage/settings`);

        const response = await fetch(`${apiUri}/v1/mypage/settings`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('API Response:', result);

        // 2. 성공 조건 완화 (code가 0이거나 200이거나, data가 존재하면 성공으로 간주)
        if (result.code === 0 || result.code === 200 || result.data) {
          const { data } = result;
          applyProfileData(data);
        } else {
          // 서버에서 명시적인 에러 코드를 보낸 경우
          throw new Error(result.message || 'Unknown Server Error');
        }
      } catch (error) {
        // 3. [Fallback] API 호출 실패 또는 에러 발생 시 더미 데이터 사용
        console.warn(
          '⚠️ API 호출 실패 또는 에러 발생. 더미 데이터를 사용합니다.',
          error
        );

        const mockData = {
          profileImageUrl:
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
          representativeBadgeName: '테이크아웃 장인',
          gender: 'MALE',
          address: '서울 마포구 와우산로 94 (테스트 데이터)',
        };
        applyProfileData(mockData);
      } finally {
        setLoading(false);
      }
    };

    // 데이터를 State에 적용하는 함수
    const applyProfileData = (data) => {
      if (!data) return;

      // (1) 프로필 이미지
      setProfileImage(data.profileImageUrl || '');

      // (2) 성별 (대소문자 무관하게 처리)
      const genderValue = data.gender ? data.gender.toUpperCase() : 'MALE';
      setGender(genderValue === 'FEMALE' ? 'female' : 'male');

      // (3) 주소
      setAddress(data.address || '');

      // (4) 대표 칭호
      if (data.representativeBadgeName) {
        const badgeIndex = titles.findIndex(
          (t) => t.name === data.representativeBadgeName
        );
        if (badgeIndex !== -1) {
          setSelectedTitle(badgeIndex);
        }
      }
    };

    fetchProfileSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-50 min-h-screen py-10 font-sans">
      <div className="w-[390px] bg-white shadow-xl rounded-xl overflow-hidden flex flex-col relative pb-6">
        {/* 헤더 */}
        <header className="relative flex items-center h-14 px-4 mt-2">
          <div className="absolute left-4 z-10">
            <BackButton />
          </div>
          <h1 className="w-full text-center text-lg font-bold text-gray-800 pointer-events-none opacity-0">
            프로필 설정
          </h1>
        </header>

        <div className="px-5 mb-6">
          <h1 className="text-xl font-bold text-gray-800">프로필 설정</h1>
        </div>

        {/* 메인 영역 */}
        <main className="flex-1 px-5 overflow-y-auto scrollbar-hide pb-24">
          {/* 프로필 이미지 */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                <img
                  src={
                    profileImage ||
                    'https://via.placeholder.com/150?text=No+Image'
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150?text=Error';
                  }}
                />
              </div>
              <button className="absolute top-0 right-0 bg-gray-400 text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-gray-500 transition-colors">
                <Pencil size={14} fill="white" />
              </button>
            </div>
          </div>

          {/* 닉네임 */}
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
              />
              <span className="text-xs text-gray-400">
                {nickname.length}/10
              </span>
            </div>
          </div>

          {/* 대표 칭호 */}
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
                          ? 'border-orange-500 bg-white scale-105 shadow-sm'
                          : 'border-gray-800 bg-white group-hover:border-gray-400'
                      }`}
                    >
                      <div className="text-center">
                        <div className="flex justify-center space-x-[2px] mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={6}
                              fill={isSelected ? 'orange' : 'black'}
                              stroke="none"
                              className={!isSelected ? 'opacity-30' : ''}
                            />
                          ))}
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest ${
                            isSelected ? 'text-orange-500' : 'text-gray-300'
                          }`}
                        >
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

          {/* 성별 */}
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
                      ? 'border-orange-500 text-gray-900 bg-white ring-1 ring-orange-500'
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
                      ? 'border-orange-500 text-gray-900 bg-white ring-1 ring-orange-500'
                      : 'border-gray-200 text-gray-400 bg-white hover:bg-gray-50'
                  }`}
              >
                여
              </button>
            </div>
          </div>

          {/* 주소지 */}
          <div className="mb-8">
            <label className="block text-xs font-medium text-gray-500 mb-2">
              주소지
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="지번, 도로명, 건물명으로 검색"
                className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-xs placeholder-gray-300 focus:outline-none focus:border-orange-500 transition-colors"
              />
              <button className="bg-gray-100 text-gray-600 px-5 rounded-lg text-xs font-medium whitespace-nowrap hover:bg-gray-200 transition-colors">
                검색
              </button>
            </div>
          </div>

          {/* 단골 가게 등록 */}
          <div className="mb-8">
            <label className="block text-xs font-medium text-gray-500 mb-2">
              단골 가게 등록
            </label>
            <div className="space-y-2">
              <div className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 bg-white hover:border-orange-300 transition-colors cursor-pointer">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-900">
                    카페나무
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    서울 마포구 와우산로 94 롯폰기 1층 (상수동)
                  </span>
                </div>
                <button className="text-gray-300 hover:text-gray-500">
                  <MoreVertical size={16} />
                </button>
              </div>
              <button className="w-full py-4 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-200 hover:text-orange-500 hover:border-orange-300 transition-all">
                <Plus size={20} strokeWidth={1.5} />
              </button>
              <button className="w-full py-4 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-200 hover:text-orange-500 hover:border-orange-300 transition-all">
                <Plus size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </main>

        <div className="absolute bottom-0 left-0 right-0 p-5 bg-white bg-opacity-90 backdrop-blur-sm">
          <button className="w-full bg-[#FF5F00] hover:bg-[#e55600] text-white font-bold py-4 rounded-full text-sm shadow-md transition-all transform active:scale-95">
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
