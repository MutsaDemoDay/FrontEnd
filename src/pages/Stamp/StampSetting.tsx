import React, { useState } from 'react';
import BackButton from '../../components/BackButton';
import PlusIcon from '../../assets/plus.svg';
import GarbageIcon from '../../assets/garbage.svg';
import EmptyStar from '../../assets/emptystar.svg';
import YellowStar from '../../assets/yellowstar.svg';
import DeleteStampModal from '../../components/DeleteStampModal';
interface StampItem {
  id: number;
  name: string;
  count: string;
  isFavorite: boolean;
  theme: 'standard' | 'text' | 'green' | 'yellow';
}

const StampSetting = () => {
  const [stamps, setStamps] = useState<StampItem[]>([
    {
      id: 1,
      name: '카페나무',
      count: '2/10',
      isFavorite: true,
      theme: 'standard',
    },
    {
      id: 2,
      name: '열공커피 홍대입구역점',
      count: '2/10',
      isFavorite: true,
      theme: 'text',
    },
    {
      id: 3,
      name: '카페드림',
      count: '2/10',
      isFavorite: false,
      theme: 'green',
    },
    {
      id: 4,
      name: '스탠스커피',
      count: '2/10',
      isFavorite: false,
      theme: 'yellow',
    },
  ]);

  // --- 추가된 상태 ---
  const [isDeleteMode, setIsDeleteMode] = useState(false); // 삭제 모드 여부
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set()); // 삭제할 ID 선택 (Set 사용으로 중복 방지)
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 표시 여부

  // 즐겨찾기 토글 (삭제 모드가 아닐 때만 동작)
  const toggleFavorite = (id: number) => {
    if (isDeleteMode) return; // 삭제 모드일 땐 무시
    setStamps((prevStamps) =>
      prevStamps.map((stamp) =>
        stamp.id === id ? { ...stamp, isFavorite: !stamp.isFavorite } : stamp
      )
    );
  };

  // --- 삭제 관련 핸들러 ---

  // 삭제할 스탬프 선택/해제
  const toggleSelection = (id: number) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);
  };

  // 휴지통 아이콘 클릭 -> 삭제 모드 진입
  const handleDeleteModeToggle = () => {
    setIsDeleteMode(true);
    setSelectedIds(new Set()); // 선택 초기화
  };

  // '취소' 버튼 클릭 -> 삭제 모드 해제
  const handleCancelDeleteMode = () => {
    setIsDeleteMode(false);
    setSelectedIds(new Set()); // 선택 초기화
  };

  // '삭제' 버튼 클릭 -> 모달 열기
  const handleOpenDeleteModal = () => {
    if (selectedIds.size === 0) {
      // 선택된 항목이 없으면 아무것도 안 함 (또는 알림)
      return;
    }
    setIsModalOpen(true);
  };

  // 모달에서 '확인' 클릭 -> 실제 삭제 실행
  const handleConfirmDelete = () => {
    setStamps((prevStamps) =>
      prevStamps.filter((stamp) => !selectedIds.has(stamp.id))
    );
    setIsModalOpen(false);
    setIsDeleteMode(false);
    setSelectedIds(new Set());
  };

  // 미니 카드 썸네일 렌더링 헬퍼 함수
  const renderThumbnail = (theme: string) => {
    const baseClass =
      'w-[80px] h-[50px] rounded-md shadow-sm flex items-center justify-center overflow-hidden relative border border-gray-100';

    switch (theme) {
      case 'standard':
        return (
          <div className={`${baseClass} bg-white`}>
            <div className="grid grid-cols-5 gap-0.5">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full border border-gray-400"
                ></div>
              ))}
            </div>
            <div className="absolute bottom-1 text-[3px] bg-gray-100 px-1 rounded-full">
              COFFEE
            </div>
          </div>
        );
      case 'text':
        return (
          <div className={`${baseClass} bg-white`}>
            <div className="flex flex-col items-center">
              <div className="w-full h-[1px] border-t border-dashed border-gray-300 mb-1"></div>
              <span className="text-[4px] font-bold text-gray-600">
                Your Cafe
              </span>
              <div className="w-full h-[1px] border-t border-dashed border-gray-300 mt-1"></div>
            </div>
          </div>
        );
      case 'green':
        return (
          <div className={`${baseClass} bg-[#1E4D45]`}>
            <div className="text-[4px] text-white absolute top-1 left-1">
              Coffee
            </div>
            <div className="w-full h-[1px] bg-white/20 rotate-12"></div>
          </div>
        );
      case 'yellow':
        return (
          <div className={`${baseClass} bg-[#FFD700]`}>
            <div className="grid grid-cols-5 gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-white border border-yellow-600"
                ></div>
              ))}
            </div>
          </div>
        );
      default:
        return <div className={`${baseClass} bg-gray-200`} />;
    }
  };

  return (
    <div className="min-h-screen bg-white px-5 pt-4 pb-28">
      {' '}
      {/* 하단 버튼 여백 확보 */}
      {/* 1. Header */}
      <div className="mb-6">
        <BackButton />
        <h1 className="text-2xl font-bold text-gray-800 mt-4">스탬프 관리</h1>
      </div>
      {/* 2. Action Bar (삭제 모드 아닐 때) */}
      {!isDeleteMode && (
        <div className="flex justify-end space-x-2 mb-3">
          <button className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition">
            <img src={PlusIcon} alt="추가" className="w-4 h-4" />
          </button>
          <button
            onClick={handleDeleteModeToggle} // 휴지통 클릭
            className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
          >
            <img src={GarbageIcon} alt="삭제" className="w-4 h-4" />
          </button>
        </div>
      )}
      {/* 3. Stamp List Container */}
      <div className="border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {stamps.map((stamp) => (
          <div
            key={stamp.id}
            className={`flex items-center justify-between p-4 border-b border-gray-50 last:border-b-0 bg-white ${
              isDeleteMode ? 'cursor-pointer' : 'hover:bg-gray-50'
            }`}
            onClick={() => isDeleteMode && toggleSelection(stamp.id)} // 삭제 모드일 때만 클릭 가능
          >
            {/* Left: Checkbox & Image & Info */}
            <div className="flex items-center space-x-4">
              {/* 삭제 모드일 때 보이는 원형 버튼 */}
              {isDeleteMode && (
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedIds.has(stamp.id)
                      ? 'bg-black border-black'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {/* 선택 시 체크 (흰색 점으로 대체) */}
                  {selectedIds.has(stamp.id) && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </div>
              )}

              {renderThumbnail(stamp.theme)}

              <div>
                <h3 className="font-bold text-gray-800 text-sm mb-0.5">
                  {stamp.name}
                </h3>
                <p className="text-gray-400 text-xs">{stamp.count}</p>
              </div>
            </div>

            {/* Right: Star Toggle (삭제 모드가 아닐 때) */}
            {!isDeleteMode && (
              <button onClick={() => toggleFavorite(stamp.id)} className="p-2">
                <img
                  src={stamp.isFavorite ? YellowStar : EmptyStar}
                  alt="favorite"
                  className="w-5 h-5"
                />
              </button>
            )}
          </div>
        ))}
      </div>
      {/* 4. Delete Mode Buttons (Fixed at bottom) */}
      {isDeleteMode && (
        <div className="fixed bottom-0 left-0 right-0 z-10 grid grid-cols-2 gap-3 p-5 bg-white border-t border-gray-100">
          <button
            onClick={handleCancelDeleteMode}
            className="w-full py-4 bg-gray-100 text-gray-800 font-bold rounded-xl hover:bg-gray-200 transition"
          >
            취소
          </button>
          <button
            onClick={handleOpenDeleteModal}
            className={`w-full py-4 font-bold rounded-xl transition ${
              selectedIds.size > 0
                ? 'bg-[#FF6B00] text-white hover:bg-orange-500' // 활성화
                : 'bg-gray-200 text-gray-400 cursor-not-allowed' // 비활성화
            }`}
            disabled={selectedIds.size === 0}
          >
            삭제
          </button>
        </div>
      )}
      {/* 5. Delete Confirmation Modal */}
      <DeleteStampModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default StampSetting;
