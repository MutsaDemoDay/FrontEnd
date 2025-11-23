// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { UserBottomBar } from '../../components/UserBottomBar';
// import BackButton from '../../components/BackButton';
// import EmptyHeart from '../../assets/heart_empty_icon.png';
// import Heart from '../../assets/heart_icon.png';
// import SearchIcon from '../../assets/searchIcon.png';

// // API 기본 주소
// const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

// // 내부 컴포넌트에서 사용할 데이터 타입
// interface Store {
//   id: number;
//   name: string;
//   category: string;
//   address: string;
//   isFavorite: boolean;
//   image: string;
// }

// // 1. 초기 로딩(로컬 스토어) API 응답 타입
// interface LocalApiStoreData {
//   storeId: number;
//   storeName: string;
//   address: string;
//   category: string;
//   storeImageUrl: string;
// }

// // 2. 검색 API 응답 타입
// interface SearchApiStoreData {
//   storeId: number;
//   storeName: string;
//   storeAddress: string; // 로컬 API와 필드명이 다름 (address vs storeAddress)
//   category: string;
//   phone: string;
//   storeUrl: string;
//   stampImageUrl: string;
//   storeImageUrl: string;
//   reward: string;
//   stampReward: string;
//   sns: string;
// }

// export const StampRegistration1 = () => {
//   const navigate = useNavigate();

//   // State 관리
//   const [stores, setStores] = useState<Store[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [activeTab, setActiveTab] = useState<'all' | 'liked'>('all');
//   const [loading, setLoading] = useState(false);

//   // 토큰 가져오기 (헤더용)
//   const getToken = () => localStorage.getItem('accessToken');

//   // ----------------------------------------------------------------
//   // 1. 초기 데이터 로딩 (내 주변 매장)
//   // ----------------------------------------------------------------
//   const fetchInitialStores = async () => {
//     setLoading(true);
//     try {
//       const token = getToken();
//       const response = await axios.get(`${apiUri}/v1/users/stores/local`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // 응답 구조: { data: { data: [...] } } 가정
//       const apiData = response.data.data;

//       const mappedStores: Store[] = apiData.map((item: LocalApiStoreData) => ({
//         id: item.storeId,
//         name: item.storeName,
//         category: item.category,
//         address: item.address,
//         isFavorite: false,
//         image: item.storeImageUrl,
//       }));

//       setStores(mappedStores);
//     } catch (error) {
//       console.error('초기 매장 목록 로딩 실패:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 컴포넌트 마운트 시 초기 데이터 로딩
//   useEffect(() => {
//     fetchInitialStores();
//   }, []);

//   // ----------------------------------------------------------------
//   // 2. 검색 기능 (서버 API 호출)
//   // ----------------------------------------------------------------
//   const searchStores = async () => {
//     // 검색어가 없으면 초기 목록으로 복귀
//     if (!searchTerm.trim()) {
//       fetchInitialStores();
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = getToken();

//       // GET /v1/stores/search?storeName={searchTerm}
//       const response = await axios.get(`${apiUri}/v1/stores/search`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: {
//           storeName: searchTerm,
//         },
//       });

//       // 검색 결과 매핑
//       const searchData = response.data;

//       // SearchApiStoreData -> Store 타입 변환
//       const mappedStores: Store[] = searchData.map(
//         (item: SearchApiStoreData) => ({
//           id: item.storeId,
//           name: item.storeName,
//           category: item.category,
//           address: item.storeAddress, // 검색 API는 storeAddress 사용
//           isFavorite: false,
//           image: item.storeImageUrl,
//         })
//       );

//       setStores(mappedStores);
//     } catch (error) {
//       console.error('매장 검색 실패:', error);
//       setStores([]); // 에러 시 빈 목록
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 입력값 변경 핸들러
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   };

//   // Enter 키 입력 핸들러
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       searchStores();
//     }
//   };

//   // ----------------------------------------------------------------
//   // 3. 기타 기능 (하트 토글, 이동, 탭 필터링)
//   // ----------------------------------------------------------------
//   const toggleHeart = (e: React.MouseEvent, id: number) => {
//     e.stopPropagation();
//     setStores((prevStores) =>
//       prevStores.map((store) =>
//         store.id === id ? { ...store, isFavorite: !store.isFavorite } : store
//       )
//     );
//   };

//   const handleStoreClick = (storeId: number) => {
//     // 클릭한 매장의 정보를 찾습니다.
//     const selectedStore = stores.find((s) => s.id === storeId);

//     if (selectedStore) {
//       navigate('/StampRegistration4', {
//         state: {
//           storeId: selectedStore.id,
//           storeName: selectedStore.name,
//         },
//       });
//     }
//   };

//   // 화면에 보여줄 데이터 필터링
//   const filteredStores = stores.filter((store) => {
//     if (activeTab === 'liked') {
//       return store.isFavorite;
//     }
//     return true; // 'all' 탭일 경우 전체 표시
//   });

//   return (
//     <div className="w-[430px] min-h-screen bg-white flex flex-col relative pb-20 mx-auto shadow-lg">
//       {/* --- Header --- */}
//       <div className="flex items-center justify-between px-4 py-4 sticky top-0 bg-white z-10">
//         <BackButton />
//         <h1 className="text-xl font-bold text-gray-800">스탬프 등록</h1>
//         <button>
//           <svg
//             className="w-6 h-6 text-gray-600"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
//             ></path>
//           </svg>
//         </button>
//       </div>

//       {/* --- Search Bar --- */}
//       <div className="px-5 mt-2">
//         <div className="relative flex items-center w-full">
//           <input
//             type="text"
//             placeholder="스탬프를 등록할 가게명 검색"
//             value={searchTerm}
//             onChange={handleSearchChange}
//             onKeyDown={handleKeyDown}
//             className="w-full bg-gray-100 text-sm text-gray-700 rounded-lg py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
//           />
//           <button
//             onClick={searchStores}
//             className="absolute right-0 top-0 h-full w-12 bg-orange-500 rounded-r-lg flex items-center justify-center hover:bg-orange-600 transition-colors"
//           >
//             <img
//               src={SearchIcon}
//               alt="검색"
//               className="w-5 h-5 filter invert brightness-0"
//             />
//           </button>
//         </div>
//       </div>

//       {/* --- Tabs --- */}
//       <div className="flex items-center px-5 mt-6 mb-4 text-sm">
//         <button
//           onClick={() => setActiveTab('all')}
//           className={`font-bold cursor-pointer ${
//             activeTab === 'all'
//               ? 'text-gray-900'
//               : 'text-gray-400 hover:text-gray-600'
//           }`}
//         >
//           {searchTerm ? '검색 결과' : '우리 동네 매장'}
//         </button>
//         <span className="mx-3 text-gray-300">|</span>
//         <button
//           onClick={() => setActiveTab('liked')}
//           className={`font-bold cursor-pointer ${
//             activeTab === 'liked'
//               ? 'text-gray-900'
//               : 'text-gray-400 hover:text-gray-600'
//           }`}
//         >
//           찜한 매장
//         </button>
//       </div>

//       {/* --- Store List --- */}
//       <div className="flex-1 overflow-y-auto px-5 space-y-6 pb-4">
//         {loading ? (
//           <div className="flex justify-center items-center h-40 text-gray-400 text-sm">
//             데이터를 불러오는 중입니다...
//           </div>
//         ) : filteredStores.length > 0 ? (
//           filteredStores.map((store) => (
//             <div
//               key={store.id}
//               onClick={() => handleStoreClick(store.id)}
//               className="flex items-start w-full border-b border-gray-100 pb-6 last:border-0 cursor-pointer hover:bg-gray-50 active:scale-[0.99] transition-all"
//             >
//               {/* Store Image */}
//               <div className="w-24 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200 mr-4 shadow-sm">
//                 <img
//                   src={store.image}
//                   alt={store.name}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     // [수정됨] 에러 발생 시 안정적인 대체 이미지 서비스로 연결
//                     (e.target as HTMLImageElement).src =
//                       'https://placehold.co/150?text=No+Image';
//                   }}
//                 />
//               </div>

//               {/* Store Info */}
//               <div className="flex-1 flex flex-col justify-between h-20 py-1">
//                 <div className="flex justify-between items-start">
//                   <div className="flex flex-col">
//                     <div className="flex items-end gap-2 mb-1">
//                       <h3 className="font-bold text-gray-800 text-base leading-none">
//                         {store.name}
//                       </h3>
//                       <span className="text-xs text-gray-400 font-light leading-none transform translate-y-[1px]">
//                         {store.category}
//                       </span>
//                     </div>
//                     <p className="text-xs text-gray-400 font-light mt-1">
//                       {store.address}
//                     </p>
//                   </div>

//                   {/* Heart Button */}
//                   <button
//                     onClick={(e) => toggleHeart(e, store.id)}
//                     className="ml-2 p-1 transition-transform active:scale-90 focus:outline-none z-10"
//                   >
//                     <img
//                       src={store.isFavorite ? Heart : EmptyHeart}
//                       alt="찜하기"
//                       className="w-5 h-5 object-contain"
//                     />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="flex flex-col items-center justify-center h-64 text-gray-400">
//             <p>검색 결과가 없습니다.</p>
//           </div>
//         )}
//       </div>

//       {/* 하단 바 */}
//       <div className="fixed bottom-0 w-[430px] z-30 bg-white border-t border-gray-100">
//         <UserBottomBar />
//       </div>
//     </div>
//   );
// };

// export default StampRegistration1;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserBottomBar } from '../../components/UserBottomBar';
import BackButton from '../../components/BackButton';
import EmptyHeart from '../../assets/heart_empty_icon.png';
import Heart from '../../assets/heart_icon.png';
import SearchIcon from '../../assets/searchIcon.png';

// API 기본 주소
const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

interface Store {
  id: number;
  name: string;
  category: string;
  address: string;
  isFavorite: boolean;
  image: string;
}

interface LocalApiStoreData {
  storeId: number;
  storeName: string;
  address: string;
  category: string;
  storeImageUrl: string;
}

interface SearchApiStoreData {
  storeId: number;
  storeName: string;
  storeAddress: string;
  category: string;
  phone: string;
  storeUrl: string;
  stampImageUrl: string;
  storeImageUrl: string;
  reward: string;
  stampReward: string;
  sns: string;
}

export const StampRegistration1 = () => {
  const navigate = useNavigate();

  // State 관리
  const [stores, setStores] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'liked'>('all');
  const [loading, setLoading] = useState(false);

  // 토큰 가져오기
  const getToken = () => localStorage.getItem('accessToken');

  // 1. 초기 데이터 로딩
  const fetchInitialStores = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get(`${apiUri}/v1/users/stores/local`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const apiData = response.data.data;

      const mappedStores: Store[] = apiData.map((item: LocalApiStoreData) => ({
        id: item.storeId,
        name: item.storeName,
        category: item.category,
        address: item.address,
        isFavorite: false, // 초기 로딩 시 서버가 값을 안 주면 false (에러 시 자동 보정됨)
        image: item.storeImageUrl,
      }));

      setStores(mappedStores);
    } catch (error) {
      console.error('초기 매장 목록 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialStores();
  }, []);

  // 2. 검색 기능
  const searchStores = async () => {
    if (!searchTerm.trim()) {
      fetchInitialStores();
      return;
    }

    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get(`${apiUri}/v1/stores/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { storeName: searchTerm },
      });

      const searchData = response.data;
      const mappedStores: Store[] = searchData.map(
        (item: SearchApiStoreData) => ({
          id: item.storeId,
          name: item.storeName,
          category: item.category,
          address: item.storeAddress,
          isFavorite: false,
          image: item.storeImageUrl,
        })
      );

      setStores(mappedStores);
    } catch (error) {
      console.error('매장 검색 실패:', error);
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchStores();
    }
  };

  // ----------------------------------------------------------------
  // 3. 찜하기 (Heart) 토글 - [서버 500 에러 대응 강화]
  // ----------------------------------------------------------------
  const toggleHeart = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    e.preventDefault();

    const token = getToken();
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    // 현재 UI 상의 매장 상태 확인
    const targetStore = stores.find((s) => s.id === id);
    if (!targetStore) return;

    const headers = { Authorization: `Bearer ${token}` };

    try {
      // [CASE A] 이미 찜한 상태라면 -> 취소(DELETE)
      if (targetStore.isFavorite) {
        await axios.delete(`${apiUri}/v1/favstores/${id}`, { headers });
        // 성공 시 화면을 '찜 해제' 상태로 변경
        updateStoreFavorite(id, false);
      }
      // [CASE B] 찜 안 한 상태라면 -> 등록(POST)
      else {
        await axios.post(`${apiUri}/v1/favstores/${id}`, {}, { headers });
        // 성공 시 화면을 '찜 설정' 상태로 변경
        updateStoreFavorite(id, true);
      }
    } catch (error: any) {
      // [중요] 500 에러 발생 시 처리 (서버가 터져도 화면은 동작하게 함)
      if (error.response && error.response.status === 500) {
        console.warn(
          `[자동 복구] 500 에러 감지. 화면 상태를 강제 동기화합니다.`
        );

        // POST 하다가 500 뜸 -> "이미 있거나 서버 오류지만, 사용자는 찜하길 원함" -> True로 강제 변경
        if (!targetStore.isFavorite) {
          updateStoreFavorite(id, true);
        }
        // DELETE 하다가 500 뜸 -> "이미 없거나 서버 오류지만, 사용자는 취소하길 원함" -> False로 강제 변경
        else {
          updateStoreFavorite(id, false);
        }
      } else {
        console.error('API 요청 실패:', error);
      }
    }
  };

  // 상태 업데이트 헬퍼 함수
  const updateStoreFavorite = (id: number, isFav: boolean) => {
    setStores((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isFavorite: isFav } : s))
    );
  };

  // 4. 기타 기능 (페이지 이동, 필터링)
  const handleStoreClick = (storeId: number) => {
    const selectedStore = stores.find((s) => s.id === storeId);
    if (selectedStore) {
      navigate('/StampRegistration4', {
        state: {
          storeId: selectedStore.id,
          storeName: selectedStore.name,
        },
      });
    }
  };

  const filteredStores = stores.filter((store) => {
    if (activeTab === 'liked') {
      return store.isFavorite;
    }
    return true;
  });

  return (
    <div className="w-[430px] min-h-screen bg-white flex flex-col relative pb-20 mx-auto shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 sticky top-0 bg-white z-10">
        <BackButton />
        <h1 className="text-xl font-bold text-gray-800">스탬프 등록</h1>
        <button>
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
            />
          </svg>
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-5 mt-2">
        <div className="relative flex items-center w-full">
          <input
            type="text"
            placeholder="스탬프를 등록할 가게명 검색"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="w-full bg-gray-100 text-sm text-gray-700 rounded-lg py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
          />
          <button
            onClick={searchStores}
            className="absolute right-0 top-0 h-full w-12 bg-orange-500 rounded-r-lg flex items-center justify-center hover:bg-orange-600 transition-colors"
          >
            <img
              src={SearchIcon}
              alt="검색"
              className="w-5 h-5 filter invert brightness-0"
            />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center px-5 mt-6 mb-4 text-sm">
        <button
          onClick={() => setActiveTab('all')}
          className={`font-bold cursor-pointer ${
            activeTab === 'all'
              ? 'text-gray-900'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {searchTerm ? '검색 결과' : '우리 동네 매장'}
        </button>
        <span className="mx-3 text-gray-300">|</span>
        <button
          onClick={() => setActiveTab('liked')}
          className={`font-bold cursor-pointer ${
            activeTab === 'liked'
              ? 'text-gray-900'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          찜한 매장
        </button>
      </div>

      {/* Store List */}
      <div className="flex-1 overflow-y-auto px-5 space-y-6 pb-4">
        {loading ? (
          <div className="flex justify-center items-center h-40 text-gray-400 text-sm">
            데이터를 불러오는 중입니다...
          </div>
        ) : filteredStores.length > 0 ? (
          filteredStores.map((store) => (
            <div
              key={store.id}
              onClick={() => handleStoreClick(store.id)}
              className="flex items-start w-full border-b border-gray-100 pb-6 last:border-0 cursor-pointer hover:bg-gray-50 active:scale-[0.99] transition-all"
            >
              <div className="w-24 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200 mr-4 shadow-sm">
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://placehold.co/150?text=No+Image';
                  }}
                />
              </div>

              <div className="flex-1 flex flex-col justify-between h-20 py-1">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <div className="flex items-end gap-2 mb-1">
                      <h3 className="font-bold text-gray-800 text-base leading-none">
                        {store.name}
                      </h3>
                      <span className="text-xs text-gray-400 font-light leading-none transform translate-y-[1px]">
                        {store.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-light mt-1">
                      {store.address}
                    </p>
                  </div>

                  <button
                    onClick={(e) => toggleHeart(e, store.id)}
                    className="ml-2 p-1 transition-transform active:scale-90 focus:outline-none z-10"
                  >
                    <img
                      src={store.isFavorite ? Heart : EmptyHeart}
                      alt="찜하기"
                      className="w-5 h-5 object-contain"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p>검색 결과가 없습니다.</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 w-[430px] z-30 bg-white border-t border-gray-100">
        <UserBottomBar />
      </div>
    </div>
  );
};

export default StampRegistration1;
