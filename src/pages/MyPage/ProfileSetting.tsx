// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // import React, { useState, useEffect, useRef } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { Pencil, MoreVertical, Plus, Star } from 'lucide-react';
// // import BackButton from '../../components/BackButton';
// // import AddressModal from '../../components/AddressModal';

// // // [설정] .env 설정이 없으면 기본값 사용
// // const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

// // const ProfileSetting = () => {
// //   const navigate = useNavigate();

// //   // --- 상태 관리 ---
// //   const [loading, setLoading] = useState(true);
// //   const [isSaving, setIsSaving] = useState(false);

// //   // 프로필 데이터
// //   const [nickname, setNickname] = useState('');
// //   const [gender, setGender] = useState('male');
// //   const [selectedTitle, setSelectedTitle] = useState(0);
// //   const [address, setAddress] = useState('');

// //   // 이미지 관리
// //   const [profileImage, setProfileImage] = useState(''); // 화면 표시용 URL
// //   const [profileImageFile, setProfileImageFile] = useState<File | null>(null); // 전송용 파일
// //   const fileInputRef = useRef<HTMLInputElement>(null);

// //   const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
// //   const [favoriteStores, setFavoriteStores] = useState<any[]>([]);
// //   const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

// //   const titles = [
// //     { id: 0, name: '전설의 바리스타', icon: '☕' },
// //     { id: 1, name: '테이크아웃 장인', icon: '🏃' },
// //     { id: 2, name: '고독한 미식가', icon: '🥘' },
// //   ];

// //   // --- [1] 초기 데이터 조회 (GET) ---
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         setLoading(true);
// //         const token = localStorage.getItem('accessToken');
// //         const headers = {
// //           'Content-Type': 'application/json',
// //           Authorization: `Bearer ${token}`,
// //         };

// //         const [settingsRes, profileRes, favStoresRes] = await Promise.all([
// //           fetch(`${apiUri}/v1/mypage/settings`, { method: 'GET', headers }),
// //           fetch(`${apiUri}/v1/mypage/profile`, { method: 'GET', headers }),
// //           fetch(`${apiUri}/v1/favstores`, { method: 'GET', headers }),
// //         ]);

// //         const settingsResult = await settingsRes.json();
// //         const profileResult = await profileRes.json();
// //         const favStoresResult = await favStoresRes.json();

// //         // 1. 설정 데이터 적용
// //         if (checkSuccess(settingsResult) && settingsResult.data) {
// //           applySettingsData(settingsResult.data);
// //         }

// //         // 2. 닉네임 데이터 적용
// //         // settingsResult에 닉네임이 있으면 우선 사용, 없으면 profileResult 사용
// //         if (settingsResult.data?.nickname) {
// //           setNickname(settingsResult.data.nickname);
// //         } else if (
// //           checkSuccess(profileResult) &&
// //           profileResult.data?.nickname
// //         ) {
// //           setNickname(profileResult.data.nickname);
// //         }

// //         // 3. 단골 매장 데이터 적용
// //         if (
// //           checkSuccess(favStoresResult) &&
// //           Array.isArray(favStoresResult.data)
// //         ) {
// //           setFavoriteStores(favStoresResult.data);
// //         }
// //       } catch (error) {
// //         console.error('API Error:', error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     const checkSuccess = (result: any) => {
// //       return (
// //         result.code === 0 ||
// //         result.code === 200 ||
// //         String(result.code) === '0' ||
// //         String(result.code) === '200' ||
// //         result.message?.includes('성공') ||
// //         result.message?.includes('완료')
// //       );
// //     };

// //     const applySettingsData = (data: any) => {
// //       setProfileImage(data.profileImageUrl || '');

// //       const genderValue = data.gender ? data.gender.toUpperCase() : 'MALE';
// //       setGender(genderValue === 'FEMALE' ? 'female' : 'male');

// //       setAddress(data.address || '');
// //       setCoordinates({
// //         latitude: data.latitude || 0,
// //         longitude: data.longitude || 0,
// //       });

// //       if (data.representativeBadgeName) {
// //         const badgeIndex = titles.findIndex(
// //           (t) => t.name === data.representativeBadgeName
// //         );
// //         if (badgeIndex !== -1) setSelectedTitle(badgeIndex);
// //       }
// //     };

// //     fetchData();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = e.target.files?.[0];
// //     if (file) {
// //       setProfileImageFile(file);
// //       const previewUrl = URL.createObjectURL(file);
// //       setProfileImage(previewUrl);
// //     }
// //   };

// //   // --- [2] 저장 함수 (PATCH + FormData) ---
// //   const handleSave = async () => {
// //     if (isSaving) return;

// //     try {
// //       setIsSaving(true);
// //       const formData = new FormData();

// //       // [수정] 1. 파일 전송 키를 'profileImage'로 변경 (서버 DTO 필드명과 일치 확률 높음)
// //       if (profileImageFile) {
// //         formData.append('profileImage', profileImageFile);
// //       }

// //       // 2. 텍스트 데이터 전송
// //       // null이나 undefined가 들어가지 않도록 빈 문자열 처리
// //       formData.append('nickname', nickname || '');
// //       formData.append('representativeBadgeName', titles[selectedTitle].name);
// //       formData.append('gender', gender.toUpperCase());
// //       formData.append('address', address || '');

// //       // 숫자는 문자열로 변환
// //       formData.append('latitude', String(coordinates.latitude || 0));
// //       formData.append('longitude', String(coordinates.longitude || 0));

// //       const endpoint = `${apiUri}/v1/mypage/settings`;

// //       console.log(`Sending PATCH request to: ${endpoint}`);
// //       // 전송 데이터 확인용 로그
// //       // for (const [key, value] of formData.entries()) { console.log(`${key}:`, value); }

// //       const response = await fetch(endpoint, {
// //         method: 'PATCH',
// //         headers: {
// //           // Content-Type 헤더를 제거해야 브라우저가 boundary를 자동 생성함
// //           Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
// //         },
// //         body: formData,
// //       });

// //       const result = await response.json();
// //       console.log('Save Response:', result);

// //       const isSuccess =
// //         result.code === 0 ||
// //         result.code === 200 ||
// //         String(result.code) === '0' ||
// //         String(result.code) === '200';

// //       if (isSuccess) {
// //         alert('프로필이 성공적으로 수정되었습니다.');
// //       } else {
// //         alert(`저장 실패: ${result.message || '입력 정보를 확인해주세요.'}`);
// //       }
// //     } catch (error) {
// //       console.error('Save Error:', error);
// //       alert('서버 통신 중 오류가 발생했습니다.');
// //     } finally {
// //       setIsSaving(false);
// //     }
// //   };

// //   const handleAddressSelect = (data: {
// //     address: string;
// //     x: string;
// //     y: string;
// //   }) => {
// //     setAddress(data.address);
// //     setCoordinates({
// //       latitude: parseFloat(data.y) || 0,
// //       longitude: parseFloat(data.x) || 0,
// //     });
// //     setIsAddressModalOpen(false);
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center min-h-screen bg-gray-50">
// //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="flex justify-center bg-gray-50 min-h-screen py-10 font-sans">
// //       <div className="w-[390px] bg-white shadow-xl rounded-xl overflow-hidden flex flex-col relative pb-6">
// //         <header className="relative flex items-center h-14 px-4 mt-2">
// //           <div className="absolute left-4 z-10">
// //             <BackButton />
// //           </div>
// //           <h1 className="w-full text-center text-lg font-bold text-gray-800 pointer-events-none opacity-0">
// //             프로필 설정
// //           </h1>
// //         </header>

// //         <div className="px-5 mb-6">
// //           <h1 className="text-xl font-bold text-gray-800">프로필 설정</h1>
// //         </div>

// //         <main className="flex-1 px-5 overflow-y-auto scrollbar-hide pb-24">
// //           {/* 이미지 변경 */}
// //           <div className="flex justify-center mb-8">
// //             <div
// //               className="relative group cursor-pointer"
// //               onClick={() => fileInputRef.current?.click()}
// //             >
// //               <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
// //                 {profileImage && (
// //                   <img
// //                     src={profileImage}
// //                     alt="Profile"
// //                     className="w-full h-full object-cover"
// //                     onError={(e) => {
// //                       (e.target as HTMLImageElement).style.display = 'none';
// //                     }}
// //                   />
// //                 )}
// //               </div>
// //               <button
// //                 type="button"
// //                 className="absolute top-0 right-0 bg-gray-400 text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm group-hover:bg-gray-500 transition-colors"
// //               >
// //                 <Pencil size={14} fill="white" />
// //               </button>
// //               <input
// //                 type="file"
// //                 ref={fileInputRef}
// //                 onChange={handleImageChange}
// //                 className="hidden"
// //                 accept="image/*"
// //               />
// //             </div>
// //           </div>

// //           {/* 닉네임 수정 */}
// //           <div className="mb-8">
// //             <label className="block text-xs font-medium text-gray-500 mb-1">
// //               닉네임
// //             </label>
// //             <div className="flex items-center border-b border-gray-200 focus-within:border-black pb-2 transition-colors">
// //               <input
// //                 type="text"
// //                 value={nickname}
// //                 onChange={(e) => setNickname(e.target.value)}
// //                 maxLength={10}
// //                 className="flex-1 text-base font-medium text-gray-900 bg-transparent focus:outline-none placeholder-gray-300"
// //               />
// //               <span className="text-xs text-gray-400">
// //                 {nickname.length}/10
// //               </span>
// //             </div>
// //           </div>

// //           {/* 칭호 */}
// //           <div className="mb-8">
// //             <label className="block text-xs font-medium text-gray-500 mb-3">
// //               대표 칭호
// //             </label>
// //             <div className="border border-gray-200 rounded-2xl p-4 flex justify-between items-center bg-white">
// //               {titles.map((title, index) => {
// //                 const isSelected = selectedTitle === index;
// //                 return (
// //                   <div
// //                     key={title.id}
// //                     onClick={() => setSelectedTitle(index)}
// //                     className="flex flex-col items-center cursor-pointer w-1/3 group"
// //                   >
// //                     <div
// //                       className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all border-2 relative
// //                       ${
// //                         isSelected
// //                           ? 'border-orange-500 bg-white scale-105 shadow-sm'
// //                           : 'border-gray-800 bg-white group-hover:border-gray-400'
// //                       }`}
// //                     >
// //                       <div className="text-center">
// //                         <div className="flex justify-center space-x-[2px] mb-1">
// //                           {[1, 2, 3, 4, 5].map((star) => (
// //                             <Star
// //                               key={star}
// //                               size={6}
// //                               fill={isSelected ? 'orange' : 'black'}
// //                               stroke="none"
// //                               className={!isSelected ? 'opacity-30' : ''}
// //                             />
// //                           ))}
// //                         </div>
// //                         <span
// //                           className={`text-[10px] font-bold uppercase tracking-widest ${
// //                             isSelected ? 'text-orange-500' : 'text-gray-300'
// //                           }`}
// //                         >
// //                           VENVATO
// //                         </span>
// //                         <div className="w-full h-[1px] bg-gray-200 my-[2px]"></div>
// //                         <div className="text-lg">{title.icon}</div>
// //                       </div>
// //                     </div>
// //                     <span
// //                       className={`text-[10px] font-bold tracking-tight whitespace-nowrap transition-colors
// //                       ${isSelected ? 'text-orange-500' : 'text-gray-800'}`}
// //                     >
// //                       {title.name}
// //                     </span>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>

// //           {/* 성별 */}
// //           <div className="mb-8">
// //             <label className="block text-xs font-medium text-gray-500 mb-2">
// //               성별
// //             </label>
// //             <div className="flex space-x-3">
// //               <button
// //                 onClick={() => setGender('male')}
// //                 className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-all
// //                   ${
// //                     gender === 'male'
// //                       ? 'border-orange-500 text-gray-900 bg-white ring-1 ring-orange-500'
// //                       : 'border-gray-200 text-gray-400 bg-white hover:bg-gray-50'
// //                   }`}
// //               >
// //                 남
// //               </button>
// //               <button
// //                 onClick={() => setGender('female')}
// //                 className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-all
// //                   ${
// //                     gender === 'female'
// //                       ? 'border-orange-500 text-gray-900 bg-white ring-1 ring-orange-500'
// //                       : 'border-gray-200 text-gray-400 bg-white hover:bg-gray-50'
// //                   }`}
// //               >
// //                 여
// //               </button>
// //             </div>
// //           </div>

// //           {/* 주소지 */}
// //           <div className="mb-8">
// //             <label className="block text-xs font-medium text-gray-500 mb-1">
// //               주소지
// //             </label>
// //             <div className="flex items-center border-b border-gray-200 pb-2">
// //               <input
// //                 type="text"
// //                 value={address}
// //                 readOnly
// //                 placeholder="지번, 도로명, 건물명으로 검색"
// //                 className="flex-1 text-base font-medium text-gray-900 bg-transparent focus:outline-none placeholder-gray-300 truncate cursor-pointer"
// //                 onClick={() => setIsAddressModalOpen(true)}
// //               />
// //               <button
// //                 onClick={() => setIsAddressModalOpen(true)}
// //                 className="ml-2 px-3 py-1.5 bg-gray-100 text-xs font-bold text-gray-600 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
// //               >
// //                 검색
// //               </button>
// //             </div>
// //           </div>

// //           {/* 단골 가게 */}
// //           <div className="mb-8">
// //             <label className="block text-xs font-medium text-gray-500 mb-2">
// //               단골 가게 등록
// //             </label>
// //             <div className="space-y-2">
// //               {favoriteStores.map((store) => (
// //                 <div
// //                   key={store.storeId}
// //                   className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 bg-white hover:border-orange-300 transition-colors cursor-pointer"
// //                 >
// //                   <div className="flex flex-col">
// //                     <span className="text-xs font-bold text-gray-900">
// //                       {store.storeName}
// //                     </span>
// //                     <span className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[200px]">
// //                       {store.storeAddress}
// //                     </span>
// //                   </div>
// //                   <button className="text-gray-300 hover:text-gray-500">
// //                     <MoreVertical size={16} />
// //                   </button>
// //                 </div>
// //               ))}

// //               {[...Array(Math.max(0, 3 - favoriteStores.length))].map(
// //                 (_, index) => (
// //                   <button
// //                     key={`add-btn-${index}`}
// //                     onClick={() => navigate('/stampregistration2')}
// //                     className="w-full py-4 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-200 hover:text-orange-500 hover:border-orange-300 transition-all"
// //                   >
// //                     <Plus size={20} strokeWidth={1.5} />
// //                   </button>
// //                 )
// //               )}
// //             </div>
// //           </div>
// //         </main>

// //         <div className="absolute bottom-0 left-0 right-0 p-5 bg-white bg-opacity-90 backdrop-blur-sm">
// //           <button
// //             onClick={handleSave}
// //             disabled={isSaving}
// //             className={`w-full font-bold py-4 rounded-full text-sm shadow-md transition-all transform active:scale-95
// //               ${
// //                 isSaving
// //                   ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
// //                   : 'bg-[#FF5F00] hover:bg-[#e55600] text-white'
// //               }`}
// //           >
// //             {isSaving ? '저장 중...' : '저장'}
// //           </button>
// //         </div>

// //         {isAddressModalOpen && (
// //           <AddressModal
// //             onClose={() => setIsAddressModalOpen(false)}
// //             onSelect={handleAddressSelect}
// //           />
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProfileSetting;

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Pencil, MoreVertical, Plus } from 'lucide-react';
// import BackButton from '../../components/BackButton';
// import AddressModal from '../../components/AddressModal';

// // 이미지 import
// import badge1 from '../../assets/badge1.png';
// import badge21 from '../../assets/badge21.png';
// import badge22 from '../../assets/badge22.png';
// import badge31 from '../../assets/badge31.png';
// import badge32 from '../../assets/badge32.png';
// import badge41 from '../../assets/badge41.png';
// import badge42 from '../../assets/badge42.png';
// import badge51 from '../../assets/badge51.png';
// import badge52 from '../../assets/badge52.png';

// // [설정] .env 설정이 없으면 기본값 사용
// const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

// // 전체 뱃지 데이터 정의
// const ALL_BADGES = [
//   // Lv 1 (기본)
//   { id: 1, level: 1, name: '원두 탐험가', img: badge1, minStamps: 0 },
//   // Lv 2 (20개 이상)
//   { id: 2, level: 2, name: '브루 수련생', img: badge21, minStamps: 20 },
//   { id: 3, level: 2, name: '카페 수집가', img: badge22, minStamps: 20 },
//   // Lv 3 (40개 이상)
//   { id: 4, level: 3, name: '라떼 장인', img: badge31, minStamps: 40 },
//   { id: 5, level: 3, name: '오늘의 드립러', img: badge32, minStamps: 40 },
//   // Lv 4 (60개 이상)
//   { id: 6, level: 4, name: '로스트 마스터', img: badge41, minStamps: 60 },
//   { id: 7, level: 4, name: '커피 연금술사', img: badge42, minStamps: 60 },
//   // Lv 5 (80개 이상)
//   { id: 8, level: 5, name: '전설의 바리스타', img: badge51, minStamps: 80 },
//   { id: 9, level: 5, name: '카페 그랜드마스터', img: badge52, minStamps: 80 },
// ];

// const ProfileSetting = () => {
//   const navigate = useNavigate();

//   // --- 상태 관리 ---
//   const [loading, setLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);

//   // 프로필 데이터
//   const [nickname, setNickname] = useState('');
//   const [gender, setGender] = useState('male');
//   const [selectedBadgeIndex, setSelectedBadgeIndex] = useState(0);
//   const [address, setAddress] = useState('');

//   // 스탬프 및 뱃지 관련
//   const [totalStampCount, setTotalStampCount] = useState(0);
//   const [unlockedBadges, setUnlockedBadges] = useState<typeof ALL_BADGES>([]);

//   // 이미지 관리
//   const [profileImage, setProfileImage] = useState('');
//   const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
//   const [favoriteStores, setFavoriteStores] = useState<any[]>([]);
//   const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

//   // --- [1] 초기 데이터 조회 (GET) ---
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem('accessToken');
//         const headers = {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         };

//         const [settingsRes, profileRes, favStoresRes] = await Promise.all([
//           fetch(`${apiUri}/v1/mypage/settings`, { method: 'GET', headers }),
//           fetch(`${apiUri}/v1/mypage/profile`, { method: 'GET', headers }),
//           fetch(`${apiUri}/v1/favstores`, { method: 'GET', headers }),
//         ]);

//         const settingsResult = await settingsRes.json();
//         const profileResult = await profileRes.json();
//         const favStoresResult = await favStoresRes.json();

//         // 1. 프로필 정보 (스탬프 개수 확인)
//         let currentStamps = 0;
//         if (checkSuccess(profileResult) && profileResult.data) {
//           currentStamps = profileResult.data.totalStampCount || 0;
//           setTotalStampCount(currentStamps);

//           if (!settingsResult.data?.nickname && profileResult.data.nickname) {
//             setNickname(profileResult.data.nickname);
//           }
//         }

//         // 2. 획득 가능한 뱃지 필터링
//         const availableBadges = ALL_BADGES.filter(
//           (badge) => currentStamps >= badge.minStamps
//         );
//         setUnlockedBadges(availableBadges);

//         // 3. 설정 데이터 적용
//         if (checkSuccess(settingsResult) && settingsResult.data) {
//           applySettingsData(settingsResult.data, availableBadges);
//         }

//         // 4. 단골 매장 데이터 적용
//         if (
//           checkSuccess(favStoresResult) &&
//           Array.isArray(favStoresResult.data)
//         ) {
//           setFavoriteStores(favStoresResult.data);
//         }
//       } catch (error) {
//         console.error('API Error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const checkSuccess = (result: any) => {
//       return (
//         result.code === 0 ||
//         result.code === 200 ||
//         String(result.code) === '0' ||
//         String(result.code) === '200' ||
//         result.message?.includes('성공') ||
//         result.message?.includes('완료')
//       );
//     };

//     const applySettingsData = (
//       data: any,
//       availableBadges: typeof ALL_BADGES
//     ) => {
//       setProfileImage(data.profileImageUrl || '');

//       const genderValue = data.gender ? data.gender.toUpperCase() : 'MALE';
//       setGender(genderValue === 'FEMALE' ? 'female' : 'male');

//       setAddress(data.address || '');
//       setCoordinates({
//         latitude: data.latitude || 0,
//         longitude: data.longitude || 0,
//       });

//       if (data.nickname) setNickname(data.nickname);

//       if (data.representativeBadgeName) {
//         const badgeIndex = availableBadges.findIndex(
//           (t) => t.name === data.representativeBadgeName
//         );
//         if (badgeIndex !== -1) setSelectedBadgeIndex(badgeIndex);
//         else setSelectedBadgeIndex(0);
//       }
//     };

//     fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setProfileImageFile(file);
//       const previewUrl = URL.createObjectURL(file);
//       setProfileImage(previewUrl);
//     }
//   };

//   const handleSave = async () => {
//     if (isSaving) return;

//     try {
//       setIsSaving(true);
//       const formData = new FormData();

//       if (profileImageFile) {
//         formData.append('profileImage', profileImageFile);
//       }

//       const selectedBadgeName =
//         unlockedBadges[selectedBadgeIndex]?.name || ALL_BADGES[0].name;

//       formData.append('nickname', nickname || '');
//       formData.append('representativeBadgeName', selectedBadgeName);
//       formData.append('gender', gender.toUpperCase());
//       formData.append('address', address || '');
//       formData.append('latitude', String(coordinates.latitude || 0));
//       formData.append('longitude', String(coordinates.longitude || 0));

//       const response = await fetch(`${apiUri}/v1/mypage/settings`, {
//         method: 'PATCH',
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//         body: formData,
//       });

//       const result = await response.json();
//       const isSuccess =
//         result.code === 0 ||
//         result.code === 200 ||
//         String(result.code) === '0' ||
//         String(result.code) === '200';

//       if (isSuccess) {
//         alert('프로필이 성공적으로 수정되었습니다.');
//       } else {
//         alert(`저장 실패: ${result.message || '입력 정보를 확인해주세요.'}`);
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

//         <main className="flex-1 px-5 overflow-y-auto scrollbar-hide pb-24">
//           {/* 이미지 변경 */}
//           <div className="flex justify-center mb-8">
//             <div
//               className="relative group cursor-pointer"
//               onClick={() => fileInputRef.current?.click()}
//             >
//               <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden border border-gray-100 shadow-inner">
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
//               <button
//                 type="button"
//                 className="absolute top-0 right-0 bg-gray-400 text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm group-hover:bg-gray-500 transition-colors"
//               >
//                 <Pencil size={14} fill="white" />
//               </button>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleImageChange}
//                 className="hidden"
//                 accept="image/*"
//               />
//             </div>
//           </div>

//           {/* 닉네임 수정 */}
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

//           {/* 대표 칭호 섹션 */}
//           <div className="mb-8">
//             <div className="flex justify-between items-end mb-3">
//               <label className="block text-xs font-medium text-gray-500">
//                 대표 칭호 (보유 스탬프:{' '}
//                 <span className="text-orange-500 font-bold">
//                   {totalStampCount}
//                 </span>
//                 개)
//               </label>
//             </div>

//             <div className="border border-gray-200 rounded-2xl p-5 bg-white">
//               {/* 뱃지 그리드 */}
//               <div className="grid grid-cols-3 gap-y-6 gap-x-2">
//                 {unlockedBadges.map((badge, index) => {
//                   const isSelected = selectedBadgeIndex === index;
//                   return (
//                     <div
//                       key={badge.id}
//                       onClick={() => setSelectedBadgeIndex(index)}
//                       className="flex flex-col items-center cursor-pointer group"
//                     >
//                       {/* 뱃지 이미지 원형 프레임 */}
//                       <div
//                         className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all duration-200 border-2 overflow-hidden bg-gray-50
//                       ${
//                         isSelected
//                           ? 'border-orange-500 shadow-md scale-105 ring-2 ring-orange-100'
//                           : 'border-transparent group-hover:border-gray-200'
//                       }`}
//                       >
//                         <img
//                           src={badge.img}
//                           alt={badge.name}
//                           className="w-full h-full object-cover p-1" // 이미지가 원 안에 꽉 차도록 하거나, 여백을 주려면 p-2 등으로 조절
//                         />
//                       </div>

//                       {/* 뱃지 이름 및 레벨 태그 */}
//                       <div className="flex flex-col items-center space-y-0.5">
//                         <span
//                           className={`text-[11px] font-bold tracking-tight text-center whitespace-nowrap transition-colors
//                         ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}
//                         >
//                           {badge.name}
//                         </span>

//                         <span
//                           className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold
//                           ${
//                             isSelected
//                               ? 'bg-orange-100 text-orange-600'
//                               : 'bg-gray-100 text-gray-400'
//                           }`}
//                         >
//                           Lv.{badge.level}
//                         </span>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {unlockedBadges.length === 0 && (
//                 <div className="text-center py-8 flex flex-col items-center justify-center">
//                   <div className="text-2xl mb-2">📭</div>
//                   <div className="text-xs text-gray-400">
//                     아직 획득한 뱃지가 없습니다.
//                     <br />
//                     스탬프를 모아 뱃지를 획득해보세요!
//                   </div>
//                 </div>
//               )}
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

//           {/* 주소지 */}
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

//           {/* 단골 가게 */}
//           <div className="mb-8">
//             <label className="block text-xs font-medium text-gray-500 mb-2">
//               단골 가게 등록
//             </label>
//             <div className="space-y-2">
//               {favoriteStores.map((store) => (
//                 <div
//                   key={store.storeId}
//                   className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 bg-white hover:border-orange-300 transition-colors cursor-pointer"
//                 >
//                   <div className="flex flex-col">
//                     <span className="text-xs font-bold text-gray-900">
//                       {store.storeName}
//                     </span>
//                     <span className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[200px]">
//                       {store.storeAddress}
//                     </span>
//                   </div>
//                   <button className="text-gray-300 hover:text-gray-500">
//                     <MoreVertical size={16} />
//                   </button>
//                 </div>
//               ))}

//               {[...Array(Math.max(0, 3 - favoriteStores.length))].map(
//                 (_, index) => (
//                   <button
//                     key={`add-btn-${index}`}
//                     onClick={() => navigate('/stampregistration2')}
//                     className="w-full py-4 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-200 hover:text-orange-500 hover:border-orange-300 transition-all"
//                   >
//                     <Plus size={20} strokeWidth={1.5} />
//                   </button>
//                 )
//               )}
//             </div>
//           </div>
//         </main>

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
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, MoreVertical, Plus } from 'lucide-react';
import BackButton from '../../components/BackButton';
import AddressModal from '../../components/AddressModal';

// 이미지 import
import badge1 from '../../assets/badge1.png';
import badge21 from '../../assets/badge21.png';
import badge22 from '../../assets/badge22.png';
import badge31 from '../../assets/badge31.png';
import badge32 from '../../assets/badge32.png';
import badge41 from '../../assets/badge41.png';
import badge42 from '../../assets/badge42.png';
import badge51 from '../../assets/badge51.png';
import badge52 from '../../assets/badge52.png';

// [설정] .env 설정이 없으면 기본값 사용
const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

// 전체 뱃지 데이터 정의
const ALL_BADGES = [
  // Lv 1 (기본)
  { id: 1, level: 1, name: '원두 탐험가', img: badge1, minStamps: 0 },
  // Lv 2 (20개 이상)
  { id: 2, level: 2, name: '브루 수련생', img: badge21, minStamps: 20 },
  { id: 3, level: 2, name: '카페 수집가', img: badge22, minStamps: 20 },
  // Lv 3 (40개 이상)
  { id: 4, level: 3, name: '라떼 장인', img: badge31, minStamps: 40 },
  { id: 5, level: 3, name: '오늘의 드립러', img: badge32, minStamps: 40 },
  // Lv 4 (60개 이상)
  { id: 6, level: 4, name: '로스트 마스터', img: badge41, minStamps: 60 },
  { id: 7, level: 4, name: '커피 연금술사', img: badge42, minStamps: 60 },
  // Lv 5 (80개 이상)
  { id: 8, level: 5, name: '전설의 바리스타', img: badge51, minStamps: 80 },
  { id: 9, level: 5, name: '카페 그랜드마스터', img: badge52, minStamps: 80 },
];

const ProfileSetting = () => {
  const navigate = useNavigate();

  // --- 상태 관리 ---
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 프로필 데이터
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('male');
  const [selectedBadgeIndex, setSelectedBadgeIndex] = useState(0);
  const [address, setAddress] = useState('');

  // 스탬프 및 뱃지 관련
  const [totalStampCount, setTotalStampCount] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState<typeof ALL_BADGES>([]);

  // 이미지 관리
  const [profileImage, setProfileImage] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [favoriteStores, setFavoriteStores] = useState<any[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

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

        const [settingsRes, profileRes, favStoresRes] = await Promise.all([
          fetch(`${apiUri}/v1/mypage/settings`, { method: 'GET', headers }),
          fetch(`${apiUri}/v1/mypage/profile`, { method: 'GET', headers }),
          fetch(`${apiUri}/v1/favstores`, { method: 'GET', headers }),
        ]);

        const settingsResult = await settingsRes.json();
        const profileResult = await profileRes.json();
        const favStoresResult = await favStoresRes.json();

        // 1. 프로필 정보 (스탬프 개수 확인)
        let currentStamps = 0;
        if (checkSuccess(profileResult) && profileResult.data) {
          currentStamps = profileResult.data.totalStampCount || 0;
          setTotalStampCount(currentStamps);

          if (!settingsResult.data?.nickname && profileResult.data.nickname) {
            setNickname(profileResult.data.nickname);
          }
        }

        // 2. 획득 가능한 뱃지 필터링
        const availableBadges = ALL_BADGES.filter(
          (badge) => currentStamps >= badge.minStamps
        );
        setUnlockedBadges(availableBadges);

        // 3. 설정 데이터 적용
        if (checkSuccess(settingsResult) && settingsResult.data) {
          applySettingsData(settingsResult.data, availableBadges);
        }

        // 4. 단골 매장 데이터 적용
        if (
          checkSuccess(favStoresResult) &&
          Array.isArray(favStoresResult.data)
        ) {
          setFavoriteStores(favStoresResult.data);
        }
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setLoading(false);
      }
    };

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

    const applySettingsData = (
      data: any,
      availableBadges: typeof ALL_BADGES
    ) => {
      setProfileImage(data.profileImageUrl || '');

      const genderValue = data.gender ? data.gender.toUpperCase() : 'MALE';
      setGender(genderValue === 'FEMALE' ? 'female' : 'male');

      setAddress(data.address || '');
      setCoordinates({
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
      });

      if (data.nickname) setNickname(data.nickname);

      if (data.representativeBadgeName) {
        const badgeIndex = availableBadges.findIndex(
          (t) => t.name === data.representativeBadgeName
        );
        if (badgeIndex !== -1) setSelectedBadgeIndex(badgeIndex);
        else setSelectedBadgeIndex(0);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setProfileImage(previewUrl);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      const formData = new FormData();

      if (profileImageFile) {
        // 프로필 이미지 파일은 'profileImage' 필드로 추가
        formData.append('profileImage', profileImageFile);
      }

      const selectedBadgeName =
        unlockedBadges[selectedBadgeIndex]?.name || ALL_BADGES[0].name;

      // 🚨 이 부분을 API 명세에 맞춰 JSON 문자열로 변경합니다.
      const settingsData = {
        nickname: nickname || '',
        representativeBadgeName: selectedBadgeName,
        gender: gender.toUpperCase(),
        address: address || '',
        latitude: coordinates.latitude || 0,
        longitude: coordinates.longitude || 0,
      };

      // 모든 설정 데이터를 JSON 문자열로 만들어 'data' 필드로 추가
      formData.append('data', JSON.stringify(settingsData));

      // 💡 기존 코드 (개별 필드 추가)는 제거합니다.
      /*
      formData.append('nickname', nickname || '');
      formData.append('representativeBadgeName', selectedBadgeName);
      formData.append('gender', gender.toUpperCase());
      formData.append('address', address || '');
      formData.append('latitude', String(coordinates.latitude || 0));
      formData.append('longitude', String(coordinates.longitude || 0));
*/

      const response = await fetch(`${apiUri}/v1/mypage/settings`, {
        method: 'PATCH',
        headers: {
          // multipart/form-data를 사용할 때는 Content-Type 헤더를 명시적으로 설정하지 않습니다. (브라우저가 경계(boundary) 정보를 포함하여 자동으로 설정)
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });

      const result = await response.json();
      const isSuccess =
        result.code === 0 ||
        result.code === 200 ||
        String(result.code) === '0' ||
        String(result.code) === '200';

      if (isSuccess) {
        alert('프로필이 성공적으로 수정되었습니다.');
      } else {
        alert(`${result.message || '입력 정보를 확인해주세요.'}`);
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

        <main className="flex-1 px-5 overflow-y-auto scrollbar-hide pb-24">
          {/* 이미지 변경 */}
          <div className="flex justify-center mb-8">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden border border-gray-100 shadow-inner">
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
              <button
                type="button"
                className="absolute top-0 right-0 bg-gray-400 text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm group-hover:bg-gray-500 transition-colors"
              >
                <Pencil size={14} fill="white" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>

          {/* 닉네임 수정 */}
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

          {/* 대표 칭호 섹션 */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-3">
              <label className="block text-xs font-medium text-gray-500">
                대표 칭호 (보유 스탬프:{' '}
                <span className="text-orange-500 font-bold">
                  {totalStampCount}
                </span>
                개)
              </label>
            </div>

            <div className="border border-gray-200 rounded-2xl p-5 bg-white">
              {/* 뱃지 그리드 */}
              <div className="grid grid-cols-3 gap-y-6 gap-x-2">
                {unlockedBadges.map((badge, index) => {
                  const isSelected = selectedBadgeIndex === index;
                  return (
                    <div
                      key={badge.id}
                      onClick={() => setSelectedBadgeIndex(index)}
                      className="flex flex-col items-center cursor-pointer group"
                    >
                      {/* 뱃지 이미지 원형 프레임 */}
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all duration-200 border-2 overflow-hidden bg-gray-50
                      ${
                        isSelected
                          ? 'border-orange-500 shadow-md scale-105 ring-2 ring-orange-100'
                          : 'border-transparent group-hover:border-gray-200'
                      }`}
                      >
                        <img
                          src={badge.img}
                          alt={badge.name}
                          className="w-full h-full object-cover p-1" // 이미지가 원 안에 꽉 차도록 하거나, 여백을 주려면 p-2 등으로 조절
                        />
                      </div>

                      {/* 뱃지 이름 및 레벨 태그 */}
                      <div className="flex flex-col items-center space-y-0.5">
                        <span
                          className={`text-[11px] font-bold tracking-tight text-center whitespace-nowrap transition-colors
                        ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}
                        >
                          {badge.name}
                        </span>

                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold
                          ${
                            isSelected
                              ? 'bg-orange-100 text-orange-600'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          Lv.{badge.level}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {unlockedBadges.length === 0 && (
                <div className="text-center py-8 flex flex-col items-center justify-center">
                  <div className="text-2xl mb-2">📭</div>
                  <div className="text-xs text-gray-400">
                    아직 획득한 뱃지가 없습니다.
                    <br />
                    스탬프를 모아 뱃지를 획득해보세요!
                  </div>
                </div>
              )}
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

          {/* 단골 가게 */}
          <div className="mb-8">
            <label className="block text-xs font-medium text-gray-500 mb-2">
              단골 가게 등록
            </label>
            <div className="space-y-2">
              {favoriteStores.map((store) => (
                <div
                  key={store.storeId}
                  className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 bg-white hover:border-orange-300 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-900">
                      {store.storeName}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[200px]">
                      {store.storeAddress}
                    </span>
                  </div>
                  <button className="text-gray-300 hover:text-gray-500">
                    <MoreVertical size={16} />
                  </button>
                </div>
              ))}

              {[...Array(Math.max(0, 3 - favoriteStores.length))].map(
                (_, index) => (
                  <button
                    key={`add-btn-${index}`}
                    onClick={() => navigate('/stampregistration2')}
                    className="w-full py-4 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-200 hover:text-orange-500 hover:border-orange-300 transition-all"
                  >
                    <Plus size={20} strokeWidth={1.5} />
                  </button>
                )
              )}
            </div>
          </div>
        </main>

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
