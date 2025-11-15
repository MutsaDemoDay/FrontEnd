/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import type { KakaoAddress } from './KakaoAddress';
import road_search_button from '../assets/road_search_button.png';

// 이 컴포넌트가 받을 Props 타입 정의
type AddressModalProps = {
  onClose: () => void;
  onSelect: (data: { address: string; x: string; y: string }) => void;
};

export const AddressModal = ({ onClose, onSelect }: AddressModalProps) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const geocoderRef = useRef<any | null>(null);
  const [searchResults, setSearchResults] = useState<KakaoAddress[]>([]);

  useEffect(() => {
    // 카카오 맵 스크립트가 로드되었는지 확인
    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      geocoderRef.current = new window.kakao.maps.services.Geocoder();
    } else {
      console.error('Kakao Maps script가 로드되지 않았습니다.');
    }
  }, []);

  // 주소 검색 실행 함수
  const onSearchMap = () => {
    if (searchQuery.trim() === '') {
      alert('검색어를 입력해주세요.');
      return;
    }
    if (!geocoderRef.current) {
      alert('지도 검색 기능이 아직 준비되지 않았습니다.');
      return;
    }

    // Geocoder를 사용하여 주소 검색
    geocoderRef.current.addressSearch(
      searchQuery,
      (result: KakaoAddress[], status: any) => {
        if (status === (window.kakao as any).maps.services.Status.OK) {
          setSearchResults(result);
        } else if (
          status === (window.kakao as any).maps.services.Status.ZERO_RESULT
        ) {
          alert('검색 결과가 없습니다.');
          setSearchResults([]);
        } else {
          alert('주소 검색 중 오류가 발생했습니다.');
        }
      }
    );
  };

  // 검색 결과에서 주소를 선택했을 때의 핸들러
  const handleAddressSelect = (address: KakaoAddress) => {
    setSearchResults([]); // 검색 결과 목록 초기화

    // 도로명 주소 > 지번 주소 순으로 주소 문자열 선택
    const addressString =
      address.road_address?.address_name ||
      address.address?.address_name ||
      address.address_name;

    // 부모 컴포넌트로 선택된 데이터 전달
    onSelect({
      address: addressString,
      x: address.x, // 경도 (longitude)
      y: address.y, // 위도 (latitude)
    });
  };

  return (
    // 모달 오버레이
    <div
      className="fixed inset-0 z-50 backdrop-brightness-75"
      onClick={onClose} // 배경 클릭 시 닫기
    >
      {/* 모달 컨텐츠 */}
      <div
        className="absolute w-screen bottom-0 top-[30%] bg-white p-6 flex flex-col rounded-t-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="self-start mb-4 text-lg font-bold">주소검색</h2>

        {/* 검색창 */}
        <div className="flex items-center w-full gap-2 mb-4 text-gray-500">
          <input
            type="text"
            className="pl-5 rounded-[10px] w-full h-10 bg-gray-100"
            placeholder="지번, 도로명, 건물명으로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearchMap();
            }}
          />
          <img
            src={road_search_button}
            onClick={onSearchMap}
            className="flex shrink-0 text-white rounded-[10px] h-10 cursor-pointer"
            alt="검색"
          />
        </div>

        {/* 검색 결과 목록 */}
        <div className="flex-1 w-full overflow-y-auto">
          {searchResults.length > 0 && (
            <ul className="w-full bg-white rounded-[10px] shadow-lg border border-gray-200 overflow-hidden">
              {searchResults.map((address, index) => (
                <li
                  key={index}
                  className="p-3 text-sm text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleAddressSelect(address)}
                >
                  <div className="font-medium text-gray-800">
                    {address.road_address?.address_name || address.address_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    [지번] {address.address?.address_name || ''}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="px-4 py-2 mt-4 bg-gray-200 rounded hover:bg-gray-300"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default AddressModal;