// import React, { useState } from 'react';
// import { UserBottomBar } from '../../components/UserBottomBar';
// import BackButton from '../../components/BackButton';
// import EmptyHeart from '../../assets/heart_empty_icon.png';
// import Heart from '../../assets/heart_icon.png';
// import SearchIcon from '../../assets/searchIcon.png';

// // 더미 데이터
// const MOCK_STORES = [
//   {
//     id: 1,
//     name: '카페나무',
//     category: '커피전문',
//     address: '서울특별시 관악구 남부순환로 1831',
//     isFavorite: true,
//     image:
//       'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
//   },
//   {
//     id: 2,
//     name: '카페드림',
//     category: '테이크아웃 전문',
//     address: '서울특별시 관악구 남부순환로 1831',
//     isFavorite: false,
//     image:
//       'https://images.unsplash.com/photo-1453614512568-c4024d13c247?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
//   },
//   {
//     id: 3,
//     name: '열공커피 홍대입구역점',
//     category: '테마형 카페',
//     address: '서울특별시 관악구 남부순환로 1831',
//     isFavorite: false,
//     image:
//       'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
//   },
//   {
//     id: 4,
//     name: '잇츠커피',
//     category: '테마형 카페',
//     address: '서울특별시 관악구 남부순환로 1831',
//     isFavorite: false,
//     image:
//       'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
//   },
//   {
//     id: 5,
//     name: '스탠스커피',
//     category: '주류제공',
//     address: '서울특별시 관악구 남부순환로 1831',
//     isFavorite: false,
//     image:
//       'https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
//   },
// ];

// export const StampRegistration1 = () => {
//   // State 관리
//   const [stores, setStores] = useState(MOCK_STORES);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [activeTab, setActiveTab] = useState<'all' | 'liked'>('all');

//   // 1. 하트 토글 기능
//   const toggleHeart = (id: number) => {
//     setStores((prevStores) =>
//       prevStores.map((store) =>
//         store.id === id ? { ...store, isFavorite: !store.isFavorite } : store
//       )
//     );
//   };

//   // 2. 검색 기능 핸들러
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   };

//   // 3. 필터링 로직 (탭 + 검색어)
//   const filteredStores = stores.filter((store) => {
//     // 탭 필터: 찜한 매장이면 isFavorite가 true인 것만
//     const matchTab = activeTab === 'liked' ? store.isFavorite : true;

//     // 검색 필터: 이름이나 주소에 검색어가 포함되어 있는지
//     const matchSearch =
//       store.name.includes(searchTerm) || store.address.includes(searchTerm);

//     return matchTab && matchSearch;
//   });

//   return (
//     <div className="w-full min-h-screen bg-white flex flex-col relative pb-20">
//       {/* --- Header --- */}
//       <div className="flex items-center justify-between px-4 py-4 sticky top-0 bg-white z-10">
//         {/* Import한 BackButton 컴포넌트 사용 */}
//         <BackButton />
//         <h1 className="text-xl font-bold text-gray-800">스탬프 등록</h1>

//         {/* QR 아이콘 (Header 우측 아이콘이 별도로 있다면 교체 필요, 현재는 SVG 유지) */}
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
//             className="w-full bg-gray-100 text-sm text-gray-700 rounded-lg py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
//           />
//           <button className="absolute right-0 top-0 h-full w-12 bg-orange-500 rounded-r-lg flex items-center justify-center hover:bg-orange-600 transition-colors">
//             {/* Import한 SearchIcon 사용 */}
//             {/* 배경이 주황색이므로 아이콘이 흰색이 아니라면 filter invert 등을 추가하세요. */}
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
//           우리 동네 매장
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
//         {filteredStores.length > 0 ? (
//           filteredStores.map((store) => (
//             <div
//               key={store.id}
//               className="flex items-start w-full border-b border-gray-100 pb-6 last:border-0"
//             >
//               {/* Store Image */}
//               <div className="w-24 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200 mr-4 shadow-sm">
//                 <img
//                   src={store.image}
//                   alt={store.name}
//                   className="w-full h-full object-cover"
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

//                   {/* Heart Button: Import한 Heart/EmptyHeart 이미지 사용 */}
//                   <button
//                     onClick={() => toggleHeart(store.id)}
//                     className="ml-2 p-1 transition-transform active:scale-90 focus:outline-none"
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

//       {/* 하단 바 (고정) */}
//       <div className="fixed bottom-0 w-[432px] z-30 bg-white border-t border-gray-100">
//         <UserBottomBar />
//       </div>
//     </div>
//   );
// };

// export default StampRegistration1;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 네비게이션 훅 임포트
import { UserBottomBar } from '../../components/UserBottomBar';
import BackButton from '../../components/BackButton';
import EmptyHeart from '../../assets/heart_empty_icon.png';
import Heart from '../../assets/heart_icon.png';
import SearchIcon from '../../assets/searchIcon.png';

// 더미 데이터
const MOCK_STORES = [
  {
    id: 1,
    name: '카페나무',
    category: '커피전문',
    address: '서울특별시 관악구 남부순환로 1831',
    isFavorite: true,
    image:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 2,
    name: '카페드림',
    category: '테이크아웃 전문',
    address: '서울특별시 관악구 남부순환로 1831',
    isFavorite: false,
    image:
      'https://images.unsplash.com/photo-1453614512568-c4024d13c247?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 3,
    name: '열공커피 홍대입구역점',
    category: '테마형 카페',
    address: '서울특별시 관악구 남부순환로 1831',
    isFavorite: false,
    image:
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 4,
    name: '잇츠커피',
    category: '테마형 카페',
    address: '서울특별시 관악구 남부순환로 1831',
    isFavorite: false,
    image:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 5,
    name: '스탠스커피',
    category: '주류제공',
    address: '서울특별시 관악구 남부순환로 1831',
    isFavorite: false,
    image:
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
];

export const StampRegistration1 = () => {
  const navigate = useNavigate(); // 네비게이션 함수 사용

  // State 관리
  const [stores, setStores] = useState(MOCK_STORES);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'liked'>('all');

  // 1. 하트 토글 기능
  const toggleHeart = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // 부모(리스트 아이템)의 클릭 이벤트 전파 방지
    setStores((prevStores) =>
      prevStores.map((store) =>
        store.id === id ? { ...store, isFavorite: !store.isFavorite } : store
      )
    );
  };

  // 2. 검색 기능 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 3. 매장 클릭 시 이동 핸들러
  const handleStoreClick = (storeId: number) => {
    navigate('/StampRegistration4');
  };

  // 4. 필터링 로직 (탭 + 검색어)
  const filteredStores = stores.filter((store) => {
    // 탭 필터: 찜한 매장이면 isFavorite가 true인 것만
    const matchTab = activeTab === 'liked' ? store.isFavorite : true;

    // 검색 필터: 이름이나 주소에 검색어가 포함되어 있는지
    const matchSearch =
      store.name.includes(searchTerm) || store.address.includes(searchTerm);

    return matchTab && matchSearch;
  });

  return (
    // w-[430px] mx-auto로 너비 고정 및 중앙 정렬
    <div className="w-[430px] min-h-screen bg-white flex flex-col relative pb-20 mx-auto shadow-lg">
      {/* --- Header --- */}
      <div className="flex items-center justify-between px-4 py-4 sticky top-0 bg-white z-10">
        {/* Import한 BackButton 컴포넌트 사용 */}
        <BackButton />
        <h1 className="text-xl font-bold text-gray-800">스탬프 등록</h1>

        {/* QR 아이콘 */}
        <button>
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
            ></path>
          </svg>
        </button>
      </div>

      {/* --- Search Bar --- */}
      <div className="px-5 mt-2">
        <div className="relative flex items-center w-full">
          <input
            type="text"
            placeholder="스탬프를 등록할 가게명 검색"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-gray-100 text-sm text-gray-700 rounded-lg py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
          />
          <button className="absolute right-0 top-0 h-full w-12 bg-orange-500 rounded-r-lg flex items-center justify-center hover:bg-orange-600 transition-colors">
            <img
              src={SearchIcon}
              alt="검색"
              className="w-5 h-5 filter invert brightness-0"
            />
          </button>
        </div>
      </div>

      {/* --- Tabs --- */}
      <div className="flex items-center px-5 mt-6 mb-4 text-sm">
        <button
          onClick={() => setActiveTab('all')}
          className={`font-bold cursor-pointer ${
            activeTab === 'all'
              ? 'text-gray-900'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          우리 동네 매장
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

      {/* --- Store List --- */}
      <div className="flex-1 overflow-y-auto px-5 space-y-6 pb-4">
        {filteredStores.length > 0 ? (
          filteredStores.map((store) => (
            <div
              key={store.id}
              onClick={() => handleStoreClick(store.id)} // 클릭 시 이동 함수 호출
              className="flex items-start w-full border-b border-gray-100 pb-6 last:border-0 cursor-pointer hover:bg-gray-50 active:scale-[0.99] transition-all"
            >
              {/* Store Image */}
              <div className="w-24 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200 mr-4 shadow-sm">
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Store Info */}
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

                  {/* Heart Button */}
                  <button
                    onClick={(e) => toggleHeart(e, store.id)} // 이벤트 객체 전달
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

      {/* 하단 바 (고정) */}
      {/* w-full 대신 부모 너비(430px)에 맞추기 위해 w-full 유지 (부모가 relative/flex-col이므로) 
          혹은 fixed를 사용할 경우 width를 명시해야 합니다. 여기선 fixed 유지. */}
      <div className="fixed bottom-0 w-[430px] z-30 bg-white border-t border-gray-100">
        <UserBottomBar />
      </div>
    </div>
  );
};

export default StampRegistration1;
