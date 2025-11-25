// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Pencil, MoreVertical, Plus, Star } from 'lucide-react';
// import BackButton from '../../components/BackButton';
// import AddressModal from '../../components/AddressModal';

// // [설정] .env 설정이 없으면 기본값 사용
// const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

// const ProfileSetting = () => {
//   const navigate = useNavigate();

//   // --- 상태 관리 ---
//   const [loading, setLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);

//   // 프로필 데이터
//   const [nickname, setNickname] = useState('김멋사');
//   const [gender, setGender] = useState('male');
//   const [selectedTitle, setSelectedTitle] = useState(0);
//   const [address, setAddress] = useState('');
//   const [profileImage, setProfileImage] = useState('');

//   // 좌표 상태 관리
//   const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });

//   // 모달 상태 관리
//   const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

//   // 칭호 리스트
//   const titles = [
//     { id: 0, name: '전설의 바리스타', icon: '☕' },
//     { id: 1, name: '테이크아웃 장인', icon: '🏃' },
//     { id: 2, name: '고독한 미식가', icon: '🥘' },
//   ];

//   // --- [1] 초기 데이터 조회 (GET) ---
//   useEffect(() => {
//     const fetchProfileSettings = async () => {
//       try {
//         setLoading(true);
//         // console.log(`Fetching from: ${apiUri}/v1/mypage/settings`);

//         const response = await fetch(`${apiUri}/v1/mypage/settings`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP Status: ${response.status}`);
//         }

//         const result = await response.json();
//         console.log('API Result:', result); // [디버깅] 실제 응답 구조 확인

//         // [수정] 성공 조건 완화 (문자열/숫자 모두 허용, 메시지 확인 등)
//         const isSuccess =
//           result.code === 0 ||
//           result.code === 200 ||
//           String(result.code) === '0' ||
//           String(result.code) === '200' ||
//           result.message === '유저 설정 조회가 완료되었습니다.'; // 메시지가 성공이면 통과

//         if (isSuccess) {
//           // 데이터가 있으면 적용, 없어도 성공 처리(초기 상태일 수 있음)
//           if (result.data) {
//             applyProfileData(result.data);
//           } else {
//             console.log('데이터가 비어있습니다 (초기 상태 가능성)');
//           }
//         } else {
//           // 성공 조건이 아니면 에러로 던짐
//           throw new Error(result.message || '데이터 조회 실패');
//         }
//       } catch (error) {
//         console.error('API Error:', error);
//         // 에러가 발생해도 화면이 멈추지 않게 기본값 유지 혹은 알림
//         // alert('설정을 불러오는 중 문제가 발생했습니다.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     const applyProfileData = (data: any) => {
//       if (!data) return;

//       setProfileImage(data.profileImageUrl || '');

//       const genderValue = data.gender ? data.gender.toUpperCase() : 'MALE';
//       setGender(genderValue === 'FEMALE' ? 'female' : 'male');

//       setAddress(data.address || '');
//       setCoordinates({
//         latitude: data.latitude || 0,
//         longitude: data.longitude || 0,
//       });

//       if (data.representativeBadgeName) {
//         const badgeIndex = titles.findIndex(
//           (t) => t.name === data.representativeBadgeName
//         );
//         if (badgeIndex !== -1) setSelectedTitle(badgeIndex);
//       }
//     };

//     fetchProfileSettings();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // --- [2] 프로필 저장 함수 (POST) ---
//   const handleSave = async () => {
//     if (isSaving) return;

//     try {
//       setIsSaving(true);

//       const payload = {
//         profileImageUrl: profileImage,
//         representativeBadgeName: titles[selectedTitle].name,
//         gender: gender.toUpperCase(),
//         address: address,
//         latitude: coordinates.latitude,
//         longitude: coordinates.longitude,
//       };

//       console.log('Sending Payload:', payload);

//       const response = await fetch(`${apiUri}/v1/mypage`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();
//       console.log('Save Response:', result);

//       // 저장 시에도 유연한 성공 체크
//       const isSuccess =
//         result.code === 0 ||
//         result.code === 200 ||
//         String(result.code) === '0' ||
//         String(result.code) === '200';

//       if (isSuccess) {
//         alert('프로필이 성공적으로 저장되었습니다.');
//       } else {
//         alert(`저장 실패: ${result.message}`);
//       }
//     } catch (error) {
//       console.error('Save Error:', error);
//       alert('서버 통신 중 오류가 발생했습니다.');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleAddressSelect = (data: {
//     address: string;
//     x: string;
//     y: string;
//   }) => {
//     setAddress(data.address);
//     setCoordinates({
//       latitude: parseFloat(data.y) || 0,
//       longitude: parseFloat(data.x) || 0,
//     });
//     setIsAddressModalOpen(false);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-50">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex justify-center bg-gray-50 min-h-screen py-10 font-sans">
//       <div className="w-[390px] bg-white shadow-xl rounded-xl overflow-hidden flex flex-col relative pb-6">
//         {/* 헤더 */}
//         <header className="relative flex items-center h-14 px-4 mt-2">
//           <div className="absolute left-4 z-10">
//             <BackButton />
//           </div>
//           <h1 className="w-full text-center text-lg font-bold text-gray-800 pointer-events-none opacity-0">
//             프로필 설정
//           </h1>
//         </header>

//         <div className="px-5 mb-6">
//           <h1 className="text-xl font-bold text-gray-800">프로필 설정</h1>
//         </div>

//         {/* 메인 영역 */}
//         <main className="flex-1 px-5 overflow-y-auto scrollbar-hide pb-24">
//           {/* 프로필 이미지 */}
//           <div className="flex justify-center mb-8">
//             <div className="relative">
//               <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
//                 {profileImage && (
//                   <img
//                     src={profileImage}
//                     alt="Profile"
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).style.display = 'none';
//                     }}
//                   />
//                 )}
//               </div>
//               <button className="absolute top-0 right-0 bg-gray-400 text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-gray-500 transition-colors">
//                 <Pencil size={14} fill="white" />
//               </button>
//             </div>
//           </div>

//           {/* 닉네임 */}
//           <div className="mb-8">
//             <label className="block text-xs font-medium text-gray-500 mb-1">
//               닉네임
//             </label>
//             <div className="flex items-center border-b border-gray-200 focus-within:border-black pb-2 transition-colors">
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

//           {/* 대표 칭호 */}
//           <div className="mb-8">
//             <label className="block text-xs font-medium text-gray-500 mb-3">
//               대표 칭호
//             </label>
//             <div className="border border-gray-200 rounded-2xl p-4 flex justify-between items-center bg-white">
//               {titles.map((title, index) => {
//                 const isSelected = selectedTitle === index;
//                 return (
//                   <div
//                     key={title.id}
//                     onClick={() => setSelectedTitle(index)}
//                     className="flex flex-col items-center cursor-pointer w-1/3 group"
//                   >
//                     <div
//                       className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all border-2 relative
//                       ${
//                         isSelected
//                           ? 'border-orange-500 bg-white scale-105 shadow-sm'
//                           : 'border-gray-800 bg-white group-hover:border-gray-400'
//                       }`}
//                     >
//                       <div className="text-center">
//                         <div className="flex justify-center space-x-[2px] mb-1">
//                           {[1, 2, 3, 4, 5].map((star) => (
//                             <Star
//                               key={star}
//                               size={6}
//                               fill={isSelected ? 'orange' : 'black'}
//                               stroke="none"
//                               className={!isSelected ? 'opacity-30' : ''}
//                             />
//                           ))}
//                         </div>
//                         <span
//                           className={`text-[10px] font-bold uppercase tracking-widest ${
//                             isSelected ? 'text-orange-500' : 'text-gray-300'
//                           }`}
//                         >
//                           VENVATO
//                         </span>
//                         <div className="w-full h-[1px] bg-gray-200 my-[2px]"></div>
//                         <div className="text-lg">{title.icon}</div>
//                       </div>
//                     </div>
//                     <span
//                       className={`text-[10px] font-bold tracking-tight whitespace-nowrap transition-colors
//                       ${isSelected ? 'text-orange-500' : 'text-gray-800'}`}
//                     >
//                       {title.name}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* 성별 */}
//           <div className="mb-8">
//             <label className="block text-xs font-medium text-gray-500 mb-2">
//               성별
//             </label>
//             <div className="flex space-x-3">
//               <button
//                 onClick={() => setGender('male')}
//                 className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-all
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
//                 className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-all
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

//           {/* 주소지 영역 */}
//           <div className="mb-8">
//             <label className="block text-xs font-medium text-gray-500 mb-1">
//               주소지
//             </label>
//             <div className="flex items-center border-b border-gray-200 pb-2">
//               <input
//                 type="text"
//                 value={address}
//                 readOnly
//                 placeholder="지번, 도로명, 건물명으로 검색"
//                 className="flex-1 text-base font-medium text-gray-900 bg-transparent focus:outline-none placeholder-gray-300 truncate cursor-pointer"
//                 onClick={() => setIsAddressModalOpen(true)}
//               />
//               <button
//                 onClick={() => setIsAddressModalOpen(true)}
//                 className="ml-2 px-3 py-1.5 bg-gray-100 text-xs font-bold text-gray-600 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
//               >
//                 검색
//               </button>
//             </div>
//           </div>

//           {/* 단골 가게 등록 */}
//           <div className="mb-8">
//             <label className="block text-xs font-medium text-gray-500 mb-2">
//               단골 가게 등록
//             </label>
//             <div className="space-y-2">
//               <div className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 bg-white hover:border-orange-300 transition-colors cursor-pointer">
//                 <div className="flex flex-col">
//                   <span className="text-xs font-bold text-gray-900">
//                     카페나무
//                   </span>
//                   <span className="text-[10px] text-gray-400 mt-0.5">
//                     서울 마포구 와우산로 94 롯폰기 1층 (상수동)
//                   </span>
//                 </div>
//                 <button className="text-gray-300 hover:text-gray-500">
//                   <MoreVertical size={16} />
//                 </button>
//               </div>

//               <button
//                 onClick={() => navigate('/stampregistration2')}
//                 className="w-full py-4 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-200 hover:text-orange-500 hover:border-orange-300 transition-all"
//               >
//                 <Plus size={20} strokeWidth={1.5} />
//               </button>

//               <button
//                 onClick={() => navigate('/stampregistration2')}
//                 className="w-full py-4 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-200 hover:text-orange-500 hover:border-orange-300 transition-all"
//               >
//                 <Plus size={20} strokeWidth={1.5} />
//               </button>
//             </div>
//           </div>
//         </main>

//         {/* 저장 버튼 */}
//         <div className="absolute bottom-0 left-0 right-0 p-5 bg-white bg-opacity-90 backdrop-blur-sm">
//           <button
//             onClick={handleSave}
//             disabled={isSaving}
//             className={`w-full font-bold py-4 rounded-full text-sm shadow-md transition-all transform active:scale-95
//               ${
//                 isSaving
//                   ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                   : 'bg-[#FF5F00] hover:bg-[#e55600] text-white'
//               }`}
//           >
//             {isSaving ? '저장 중...' : '저장'}
//           </button>
//         </div>

//         {/* 주소 모달 연결 */}
//         {isAddressModalOpen && (
//           <AddressModal
//             onClose={() => setIsAddressModalOpen(false)}
//             onSelect={handleAddressSelect}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProfileSetting;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, MoreVertical, Plus, Star } from 'lucide-react';
import BackButton from '../../components/BackButton';
import AddressModal from '../../components/AddressModal';

// [설정] .env 설정이 없으면 기본값 사용
const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

const ProfileSetting = () => {
  const navigate = useNavigate();

  // --- 상태 관리 ---
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 프로필 데이터
  const [nickname, setNickname] = useState(''); // 초기값 비워둠 (API로 채움)
  const [gender, setGender] = useState('male');
  const [selectedTitle, setSelectedTitle] = useState(0);
  const [address, setAddress] = useState('');
  const [profileImage, setProfileImage] = useState('');

  // 좌표 상태 관리
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });

  // 모달 상태 관리
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // 칭호 리스트
  const titles = [
    { id: 0, name: '전설의 바리스타', icon: '☕' },
    { id: 1, name: '테이크아웃 장인', icon: '🏃' },
    { id: 2, name: '고독한 미식가', icon: '🥘' },
  ];

  // --- [1] 초기 데이터 조회 (GET) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };

        // 두 개의 API를 병렬로 호출 (설정 데이터 + 닉네임 데이터)
        const [settingsRes, profileRes] = await Promise.all([
          fetch(`${apiUri}/v1/mypage/settings`, { method: 'GET', headers }),
          fetch(`${apiUri}/v1/mypage/profile`, { method: 'GET', headers }),
        ]);

        if (!settingsRes.ok || !profileRes.ok) {
          throw new Error('API 호출 중 오류가 발생했습니다.');
        }

        const settingsResult = await settingsRes.json();
        const profileResult = await profileRes.json();

        console.log('Settings API Result:', settingsResult);
        console.log('Profile API Result:', profileResult);

        // 1. 설정 데이터 적용 (이미지, 주소, 성별, 칭호)
        if (checkSuccess(settingsResult)) {
          if (settingsResult.data) {
            applySettingsData(settingsResult.data);
          }
        }

        // 2. 프로필 데이터 적용 (닉네임)
        if (checkSuccess(profileResult)) {
          if (profileResult.data && profileResult.data.nickname) {
            setNickname(profileResult.data.nickname);
          }
        }
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setLoading(false);
      }
    };

    // 성공 여부 판단 헬퍼 함수
    const checkSuccess = (result: any) => {
      return (
        result.code === 0 ||
        result.code === 200 ||
        String(result.code) === '0' ||
        String(result.code) === '200' ||
        result.message?.includes('성공') ||
        result.message?.includes('완료')
      );
    };

    // 설정 데이터 적용 함수
    const applySettingsData = (data: any) => {
      setProfileImage(data.profileImageUrl || '');

      const genderValue = data.gender ? data.gender.toUpperCase() : 'MALE';
      setGender(genderValue === 'FEMALE' ? 'female' : 'male');

      setAddress(data.address || '');
      setCoordinates({
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
      });

      if (data.representativeBadgeName) {
        const badgeIndex = titles.findIndex(
          (t) => t.name === data.representativeBadgeName
        );
        if (badgeIndex !== -1) setSelectedTitle(badgeIndex);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- [2] 프로필 저장 함수 (POST) ---
  const handleSave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);

      // 저장 시 닉네임도 포함해야 하는지 서버 스펙 확인 필요 (현재 페이로드에는 닉네임 없음)
      const payload = {
        profileImageUrl: profileImage,
        representativeBadgeName: titles[selectedTitle].name,
        gender: gender.toUpperCase(),
        address: address,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      };

      console.log('Sending Payload:', payload);

      const response = await fetch(`${apiUri}/v1/mypage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('Save Response:', result);

      const isSuccess =
        result.code === 0 ||
        result.code === 200 ||
        String(result.code) === '0' ||
        String(result.code) === '200';

      if (isSuccess) {
        alert('프로필이 성공적으로 저장되었습니다.');
      } else {
        alert(`저장 실패: ${result.message}`);
      }
    } catch (error) {
      console.error('Save Error:', error);
      alert('서버 통신 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddressSelect = (data: {
    address: string;
    x: string;
    y: string;
  }) => {
    setAddress(data.address);
    setCoordinates({
      latitude: parseFloat(data.y) || 0,
      longitude: parseFloat(data.x) || 0,
    });
    setIsAddressModalOpen(false);
  };

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
                {profileImage && (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
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
                readOnly // 닉네임 수정 API가 별도로 없다면 readOnly 처리하거나, onChange 유지
                // onChange={(e) => setNickname(e.target.value)}
                className="flex-1 text-base font-medium text-gray-900 bg-transparent focus:outline-none placeholder-gray-300"
              />
              {/* <span className="text-xs text-gray-400">
                {nickname.length}/10
              </span> */}
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

          {/* 주소지 영역 */}
          <div className="mb-8">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              주소지
            </label>
            <div className="flex items-center border-b border-gray-200 pb-2">
              <input
                type="text"
                value={address}
                readOnly
                placeholder="지번, 도로명, 건물명으로 검색"
                className="flex-1 text-base font-medium text-gray-900 bg-transparent focus:outline-none placeholder-gray-300 truncate cursor-pointer"
                onClick={() => setIsAddressModalOpen(true)}
              />
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="ml-2 px-3 py-1.5 bg-gray-100 text-xs font-bold text-gray-600 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
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

              <button
                onClick={() => navigate('/stampregistration2')}
                className="w-full py-4 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-200 hover:text-orange-500 hover:border-orange-300 transition-all"
              >
                <Plus size={20} strokeWidth={1.5} />
              </button>

              <button
                onClick={() => navigate('/stampregistration2')}
                className="w-full py-4 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-200 hover:text-orange-500 hover:border-orange-300 transition-all"
              >
                <Plus size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </main>

        {/* 저장 버튼 */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-white bg-opacity-90 backdrop-blur-sm">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full font-bold py-4 rounded-full text-sm shadow-md transition-all transform active:scale-95
              ${
                isSaving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#FF5F00] hover:bg-[#e55600] text-white'
              }`}
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>

        {/* 주소 모달 연결 */}
        {isAddressModalOpen && (
          <AddressModal
            onClose={() => setIsAddressModalOpen(false)}
            onSelect={handleAddressSelect}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileSetting;
