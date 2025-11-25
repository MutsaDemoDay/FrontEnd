import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { BackButton3 } from '../../components/BackButton3';
import { requestStampEarn } from '../../api/OwnerQR';

// --- 내부 컴포넌트: 확인 모달 ---
interface ConfirmModalProps {
  userId: string;
  onConfirm: (count: number) => void;
  onCancel: () => void;
}

const ConfirmModal = ({ userId, onConfirm, onCancel }: ConfirmModalProps) => {
  const [count, setCount] = useState(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white w-full max-w-[320px] rounded-[20px] overflow-hidden p-6">
        <h2 className="text-[16px] font-bold text-center mb-6">
          다음 회원에게 적립하시겠습니까?
        </h2>
        <div className="flex justify-between text-[14px] mb-2">
          <span className="text-gray-500">회원ID(식별자)</span>
          <span className="font-bold">{userId}</span>
        </div>
        <div className="flex items-center justify-between mt-4 mb-6">
          <span className="text-[14px] font-medium">스탬프 개수</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => count > 1 && setCount((c) => c - 1)}
              className="w-8 h-8 border rounded-full text-gray-500"
            >
              -
            </button>
            <span className="text-[20px] font-bold text-[#FF6B00]">
              {count}
            </span>
            <button
              onClick={() => setCount((c) => c + 1)}
              className="w-8 h-8 border rounded-full text-gray-500"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 rounded-xl text-gray-600 font-bold"
          >
            취소
          </button>
          <button
            onClick={() => onConfirm(count)}
            className="flex-1 py-3 bg-[#FF6B00] rounded-xl text-white font-bold"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 메인 페이지 ---
export const QRScan = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] =
    useState<string>('가게 정보를 불러오는 중...');

  const [showModal, setShowModal] = useState(false);
  const [scannedUserId, setScannedUserId] = useState<string>(''); // QR에서 읽은 값 ("1")
  const [storeId, setStoreId] = useState<number | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);

  // 1. 가게 정보(StoreId) 로드
  useEffect(() => {
    const fetchStoreId = async () => {
      const apiUri = import.meta.env.VITE_API_URI;
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setStatusMessage('로그인이 필요합니다.');
        return;
      }

      try {
        const response = await fetch(`${apiUri}/v1/managers/profile`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const json = await response.json();
          // 데이터 구조 안전하게 접근
          const id = json.data?.store?.storeId || json.data?.storeId;
          if (id) {
            setStoreId(id);
            setStatusMessage('QR 코드를 스캔해주세요.');
          } else {
            setStatusMessage('가게 ID를 찾을 수 없습니다.');
          }
        } else {
          setStatusMessage('가게 정보를 불러오지 못했습니다.');
        }
      } catch (e) {
        console.error(e);
        setStatusMessage('서버 오류 발생');
      }
    };
    fetchStoreId();
  }, []);

  // 2. 스캔 시작
  const startScanning = async () => {
    if (storeId === null) {
      setStatusMessage('가게 정보 로딩 실패. 다시 시도해주세요.');
      return;
    }
    setScanResult(null);
    setStatusMessage('QR 코드를 사각형 안에 맞춰주세요.');
    setIsScanning(true);

    setTimeout(async () => {
      if (scannerRef.current)
        try {
          await scannerRef.current.stop();
        } catch {}
      const html5QrCode = new Html5Qrcode('reader');
      scannerRef.current = html5QrCode;

      try {
        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            // 스캔 성공 시
            setIsScanning(false);
            html5QrCode.stop();
            console.log('QR Scanned:', decodedText);
            setScannedUserId(decodedText); // "1" 저장
            setShowModal(true); // 모달 오픈
          },
          () => {}
        );
      } catch (err) {
        setStatusMessage('카메라 실행 실패');
        setIsScanning(false);
      }
    }, 300);
  };

  const stopScanning = async () => {
    if (scannerRef.current)
      try {
        await scannerRef.current.stop();
      } catch {}
    setIsScanning(false);
    setStatusMessage('스캔 중지');
  };

  // 3. 모달 확인 -> API 호출
  const handleConfirmEarn = async (count: number) => {
    setShowModal(false);
    setStatusMessage('적립 요청 중...');

    if (!storeId) return;

    try {
      // 실제 적립 요청
      const res = await requestStampEarn(storeId, scannedUserId, count);

      if (res.code === 100 || res.code === 200 || res.code === 0) {
        setScanResult('적립 성공!');
        setStatusMessage(`${count}개 적립 완료!`);
      } else {
        setScanResult('적립 실패');
        setStatusMessage(res.message || '오류 발생');
      }
    } catch (e) {
      setScanResult('에러');
      setStatusMessage('통신 오류');
    }
  };

  return (
    <div className="w-full h-screen bg-[#222] flex flex-col items-center justify-center relative">
      <div className="absolute top-4 left-4 z-10">
        <BackButton3 />
      </div>

      <div className="relative w-[300px] h-[300px] bg-black rounded-2xl overflow-hidden border border-gray-600">
        <div id="reader" className="w-full h-full" />
        {!isScanning && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            카메라 꺼짐
          </div>
        )}
      </div>

      <div className="mt-6 text-center h-[60px]">
        {scanResult ? (
          <p className="text-[#FF6B00] text-xl font-bold">{scanResult}</p>
        ) : (
          <p className="text-white text-sm">{statusMessage}</p>
        )}
      </div>

      <div className="mt-8">
        {!isScanning ? (
          <button
            onClick={startScanning}
            className="px-8 py-3 bg-[#FF6B00] rounded-full text-white font-bold"
          >
            스캔 시작
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="px-8 py-3 bg-white rounded-full text-black font-bold"
          >
            중지
          </button>
        )}
      </div>

      {showModal && (
        <ConfirmModal
          userId={scannedUserId}
          onConfirm={handleConfirmEarn}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
