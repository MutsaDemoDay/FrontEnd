import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../../components/BackButton';
import PlusIcon from '../../assets/plus.svg';
import GarbageIcon from '../../assets/garbage.svg';
import EmptyStar from '../../assets/emptystar.svg';
import YellowStar from '../../assets/yellowstar.svg';
import DeleteStampModal from '../../components/DeleteStampModal';

// API 주소 설정
const apiUri = import.meta.env.VITE_API_URI || 'http://localhost:8080';

// UI에 표시할 스탬프 아이템 타입
interface StampItem {
  id: number;
  name: string;
  count: string;
  isFavorite: boolean;
  theme: 'standard' | 'text' | 'green' | 'yellow';
}

// GET 요청 시 서버 응답 데이터 타입 (스탬프 목록)
interface StampResponseDto {
  storeName: string;
  currentCount: number;
  maxCount: number;
  stampImageUrl: string;
  stampId?: number; // 삭제를 위해선 DB의 PK(ID)가 필수입니다.
}

// DELETE 요청 시 서버 응답 데이터 타입
interface DeleteApiResponse {
  timestamp: string;
  code: number;
  message: string;
}

const StampSetting = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [stamps, setStamps] = useState<StampItem[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- API 연동: 스탬프 목록 조회 (GET) ---
  useEffect(() => {
    const fetchStamps = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        console.warn('로그인 토큰이 없습니다.');
        return;
      }

      try {
        const response = await axios.get<StampResponseDto[]>(
          `${apiUri}/v1/users/stamps`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = response.data;

        // DTO -> UI State 변환
        const formattedStamps: StampItem[] = data.map((item, index) => ({
          // [중요] 실제 삭제 API 호출을 위해선 서버에서 주는 고유 ID(stampId)를 사용해야 합니다.
          // stampId가 없다면 임시로 index를 쓰지만, 이 경우 삭제가 정상 동작하지 않을 수 있습니다.
          id: item.stampId || index,
          name: item.storeName,
          count: `${item.currentCount}/${item.maxCount}`,
          isFavorite: false, // 즐겨찾기 정보가 API에 없다면 기본값 false
          theme: ['standard', 'text', 'green', 'yellow'][
            index % 4
          ] as StampItem['theme'],
        }));

        setStamps(formattedStamps);
      } catch (error) {
        console.error('스탬프 목록 조회 실패:', error);
      }
    };

    fetchStamps();
  }, [navigate]);

  // --- 일반 핸들러 ---

  // 즐겨찾기 토글
  const toggleFavorite = (id: number) => {
    if (isDeleteMode) return;
    setStamps((prevStamps) =>
      prevStamps.map((stamp) =>
        stamp.id === id ? { ...stamp, isFavorite: !stamp.isFavorite } : stamp
      )
    );
  };

  // --- 삭제 모드 관련 핸들러 ---

  const toggleSelection = (id: number) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleDeleteModeToggle = () => {
    setIsDeleteMode(true);
    setSelectedIds(new Set());
  };

  const handleCancelDeleteMode = () => {
    setIsDeleteMode(false);
    setSelectedIds(new Set());
  };

  const handleOpenDeleteModal = () => {
    if (selectedIds.size === 0) return;
    setIsModalOpen(true);
  };

  // ★ 수정된 삭제 로직 (DELETE API 연동) ★
  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      // 선택된 ID들에 대해 병렬로 DELETE 요청 전송
      const deletePromises = Array.from(selectedIds).map(async (id) => {
        // [요청] DELETE /v1/stamps/{stampId}
        const response = await axios.delete<DeleteApiResponse>(
          `${apiUri}/v1/stamps/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // 서버 응답 확인 (옵션: code가 100인지 확인 등)
        console.log(`ID ${id} 삭제 결과:`, response.data);
        return response.data;
      });

      // 모든 삭제 요청 대기
      await Promise.all(deletePromises);

      // UI 업데이트: 삭제 성공한 항목들을 화면 목록에서 제거
      setStamps((prevStamps) =>
        prevStamps.filter((stamp) => !selectedIds.has(stamp.id))
      );

      // 모드 및 상태 초기화
      setIsModalOpen(false);
      setIsDeleteMode(false);
      setSelectedIds(new Set());

      alert('삭제되었습니다.');
    } catch (error) {
      console.error('스탬프 삭제 실패:', error);
      alert('스탬프 삭제 중 오류가 발생했습니다.');
    }
  };

  // --- 렌더링 헬퍼 (썸네일) ---
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
      {/* 1. Header */}
      <div className="mb-6">
        <BackButton />
        <h1 className="text-2xl font-bold text-gray-800 mt-4">스탬프 관리</h1>
      </div>

      {/* 2. Action Bar (삭제 모드 아닐 때) */}
      {!isDeleteMode && (
        <div className="flex justify-end space-x-2 mb-3">
          <button
            onClick={() => navigate('/stampregistration1')}
            className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
          >
            <img src={PlusIcon} alt="추가" className="w-4 h-4" />
          </button>
          <button
            onClick={handleDeleteModeToggle}
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
            onClick={() => isDeleteMode && toggleSelection(stamp.id)}
          >
            {/* Left: Checkbox & Image & Info */}
            <div className="flex items-center space-x-4">
              {isDeleteMode && (
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedIds.has(stamp.id)
                      ? 'bg-black border-black'
                      : 'bg-white border-gray-300'
                  }`}
                >
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
                ? 'bg-[#FF6B00] text-white hover:bg-orange-500'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
