import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { BackButton3 } from '../../components/BackButton3';
import { requestStampEarn } from '../../api/OwnerQR';

// ---------------------------------------------------------
// [내부 컴포넌트] 적립 확인 모달
// ---------------------------------------------------------
interface ConfirmModalProps {
  userId: string;
  onConfirm: (count: number) => void;
  onCancel: () => void;
}

const ConfirmModal = ({ userId, onConfirm, onCancel }: ConfirmModalProps) => {
  const [count, setCount] = useState(1);

  const handleDecrease = () => {
    if (count > 1) setCount(count - 1);
  };

  const handleIncrease = () => {
    setCount(count + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-[320px] rounded-[20px] overflow-hidden shadow-2xl animate-fade-in-up">
        {/* 헤더 */}
        <div className="py-5 px-6 border-b border-gray-100">
          <h2 className="text-[16px] font-bold text-[#333] text-center">
            다음 회원에게 적립하시겠습니까?
          </h2>
        </div>

        {/* 내용 */}
        <div className="py-6 px-6">
          {/* 회원 정보 표시 */}
          <div className="flex flex-col gap-2 mb-6 bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-gray-500">회원ID</span>
              <span className="font-bold text-black">{userId}</span>
            </div>
          </div>

          {/* 스탬프 개수 조절 */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[14px] font-medium text-[#333]">
              스탬프 개수
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDecrease}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 active:scale-95 transition"
              >
                -
              </button>
              <span className="text-[20px] font-bold w-8 text-center text-[#FF6B00]">
                {count}
              </span>
              <button
                onClick={handleIncrease}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 active:scale-95 transition"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex border-t border-gray-100">
          <button
            onClick={onCancel}
            className="flex-1 py-4 bg-white text-[#888] font-medium text-[15px] hover:bg-gray-50 active:bg-gray-100 transition border-r border-gray-100"
          >
            취소
          </button>
          <button
            onClick={() => onConfirm(count)}
            className="flex-1 py-4 bg-[#FF6B00] text-white font-bold text-[15px] hover:bg-[#E56000] active:bg-[#CC5600] transition"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------
// [메인 컴포넌트] QR 스캔 페이지
// ---------------------------------------------------------
export const QRScan = () => {
  // 상태 관리
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] =
    useState<string>('카메라 권한을 허용해주세요.');

  // 모달 제어
  const [showModal, setShowModal] = useState(false);
  const [scannedUserId, setScannedUserId] = useState<string>(''); // QR에서 읽은 값

  const [storeId, setStoreId] = useState<number | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // 1. 가게 정보(StoreId) 가져오기
  useEffect(() => {
    const fetchStoreId = async () => {
      const apiUri = import.meta.env.VITE_API_URI;
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const response = await fetch(`${apiUri}/v1/managers/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const profileData = await response.json();
          if (profileData.data?.store?.storeId) {
            // 데이터 구조에 따라 경로 확인 필요 (data.store.storeId 또는 data.storeId)
            // 기존 코드 문맥상 data.store.storeId일 확률이 높음
            setStoreId(profileData.data.store.storeId);
          } else if (profileData.data?.storeId) {
            setStoreId(profileData.data.storeId);
          }
        }
      } catch (error) {
        console.error('Store Info Error:', error);
      }
    };
    fetchStoreId();
  }, []);

  // 2. 스캔 시작
  const startScanning = async () => {
    if (storeId === null) {
      setStatusMessage('가게 정보를 불러오는 중입니다.');
      return;
    }

    setScanResult(null);
    setStatusMessage('QR 코드를 사각형 안에 맞춰주세요.');
    setIsScanning(true);

    // DOM 렌더링 대기
    setTimeout(async () => {
      // 기존 인스턴스 정리
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch (e) {}
      }

      const html5QrCode = new Html5Qrcode('reader');
      scannerRef.current = html5QrCode;

      try {
        await html5QrCode.start(
          { facingMode: 'environment' }, // 후면 카메라
          { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
          onScanSuccess,
          () => {} // 스캔 실패시(매 프레임) 콜백은 비워둠
        );
      } catch (err) {
        console.error('Camera Start Error:', err);
        setStatusMessage('카메라 실행 실패. 권한을 확인해주세요.');
        setIsScanning(false);
      }
    }, 300);
  };

  // 3. 스캔 중지
  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (e) {}
    }
    setIsScanning(false);
    setStatusMessage('스캔이 중지되었습니다.');
  };

  // 4. [핵심] 스캔 성공 -> 모달 띄우기
  const onScanSuccess = async (decodedText: string) => {
    // 1. 카메라 중지 (사용자 경험상 멈추는 게 좋음)
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (e) {}
    }
    setIsScanning(false);

    // 2. 스캔된 ID 저장 및 모달 오픈
    console.log('Scanned User ID:', decodedText);
    setScannedUserId(decodedText);
    setShowModal(true);
  };

  // 5. 모달 확인 버튼 -> 실제 API 호출
  const handleConfirmEarn = async (stampCount: number) => {
    setShowModal(false); // 모달 닫기
    setStatusMessage('적립 요청 중...');

    if (storeId === null) return;

    try {
      const response = await requestStampEarn(
        storeId,
        scannedUserId,
        stampCount
      );

      if (
        response.code === 0 ||
        response.code === 100 ||
        response.code === 200
      ) {
        setScanResult('적립 성공!');
        setStatusMessage(
          `${scannedUserId}님에게\n스탬프 ${stampCount}개가 적립되었습니다.`
        );
      } else {
        setScanResult('적립 실패');
        setStatusMessage(response.message || '오류가 발생했습니다.');
      }
    } catch (error) {
      setScanResult('에러 발생');
      setStatusMessage('서버 통신 중 오류가 발생했습니다.');
    }
  };

  // 6. 모달 취소 버튼
  const handleCancelEarn = () => {
    setShowModal(false);
    setScannedUserId('');
    setStatusMessage('취소되었습니다. 다시 스캔하려면 버튼을 눌러주세요.');
    // 필요하다면 여기서 바로 startScanning()을 호출해도 됩니다.
  };

  return (
    <div className="w-full h-screen bg-[#222] flex flex-col items-center justify-center relative overflow-hidden">
      {/* 상단 헤더 영역 */}
      <div className="absolute top-0 left-0 w-full p-4 z-10 flex items-center">
        <BackButton3 /> {/* 아이콘 색상이 어두우면 필터나 색상 변경 필요 */}
        <h1 className="text-white text-[18px] font-medium ml-4">스탬프 적립</h1>
      </div>

      {/* 카메라 뷰파인더 */}
      <div className="relative w-full max-w-[320px] aspect-square bg-black rounded-[20px] overflow-hidden shadow-2xl border border-gray-700">
        <div id="reader" className="w-full h-full" />

        {/* 카메라 꺼져있을 때 표시 */}
        {!isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-2 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-sm">카메라가 꺼져있습니다.</p>
          </div>
        )}

        {/* 스캔 가이드 라인 (카메라 켜져있을 때만) */}
        {isScanning && (
          <div className="absolute inset-0 border-[40px] border-black/50 pointer-events-none z-10">
            <div className="w-full h-full border-2 border-[#FF6B00] relative">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#FF6B00] -mt-1 -ml-1" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#FF6B00] -mt-1 -mr-1" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#FF6B00] -mb-1 -ml-1" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#FF6B00] -mb-1 -mr-1" />
            </div>
          </div>
        )}
      </div>

      {/* 상태 메시지 */}
      <div className="mt-8 text-center px-6 min-h-[60px]">
        {scanResult ? (
          <p className="text-[#FF6B00] text-[20px] font-bold animate-bounce">
            {scanResult}
          </p>
        ) : (
          <p className="text-white/80 text-[15px] whitespace-pre-line leading-relaxed">
            {statusMessage}
          </p>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="mt-10">
        {!isScanning ? (
          <button
            onClick={startScanning}
            className="w-[70px] h-[70px] rounded-full bg-[#FF6B00] flex items-center justify-center shadow-lg shadow-orange-500/30 hover:scale-105 active:scale-95 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="w-[70px] h-[70px] rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition"
          >
            <div className="w-6 h-6 bg-black rounded-sm" />
          </button>
        )}
      </div>

      {/* 모달 렌더링 */}
      {showModal && (
        <ConfirmModal
          userId={scannedUserId}
          onConfirm={handleConfirmEarn}
          onCancel={handleCancelEarn}
        />
      )}
    </div>
  );
};
