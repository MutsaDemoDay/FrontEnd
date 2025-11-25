import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { BackButton3 } from '../../components/BackButton3';
import { scanQrCode } from '../../api/OwnerQR';

export const QRScan = () => {
  // -------------------------------------------------------------------------
  // 1. 상태 및 Ref 관리
  // -------------------------------------------------------------------------
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('카메라 권한을 허용해주세요.');
  const [isError, setIsError] = useState(false);
  
  // [수정] 가게 ID 상태 관리 (초기값 null)
  const [storeId, setStoreId] = useState<number | null>(null);

  // 스캐너 인스턴스 Ref
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // -------------------------------------------------------------------------
  // 2. 가게 정보(StoreId) 가져오기
  // -------------------------------------------------------------------------
  useEffect(() => {
    const fetchStoreId = async () => {
      const apiUri = import.meta.env.VITE_API_URI;
      const token = localStorage.getItem('accessToken');

      if (!token) {
        console.error("로그인 토큰이 없습니다.");
        return;
      }

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
          // 응답 구조에 맞게 경로 설정 (data.data.storeId 인지 data.storeId 인지 확인 필요)
          // 작성해주신 코드 기반: profileData.data.storeId
          if (profileData.data && profileData.data.storeId) {
            console.log("가게 ID 확보:", profileData.data.storeId);
            setStoreId(profileData.data.storeId);
          } else {
            console.error("가게 ID를 찾을 수 없습니다.");
          }
        } else {
          console.error('가게 정보 불러오기 실패 status:', response.status);
        }
      } catch (error) {
        console.error('가게 정보 API 에러:', error);
      }
    };

    fetchStoreId();
  }, []);

  // -------------------------------------------------------------------------
  // 3. 컴포넌트 종료(Unmount) 시 클린업
  // -------------------------------------------------------------------------
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop().catch((err) => console.log('Stop failed', err));
          scannerRef.current.clear();
        } catch (e) {
          // 무시
        }
      }
    };
  }, []);

  // -------------------------------------------------------------------------
  // 4. 스캔 시작 함수
  // -------------------------------------------------------------------------
  const startScanning = async () => {
    // 가게 ID가 로드되지 않았으면 스캔 시작 막기
    if (storeId === null) {
      setIsError(true);
      setStatusMessage('가게 정보를 불러오는 중입니다.\n잠시 후 다시 시도해주세요.');
      return;
    }

    setIsError(false);
    setScanResult(null);
    setStatusMessage('카메라를 불러오는 중...');
    setIsScanning(true);

    // DOM 렌더링 대기 (흰 화면 방지)
    setTimeout(async () => {
      try {
        // 기존 인스턴스 정리
        if (scannerRef.current) {
          try {
            await scannerRef.current.stop();
            scannerRef.current.clear();
          } catch (e) { /* 무시 */ }
        }

        // 새 인스턴스 생성
        const html5QrCode = new Html5Qrcode('reader');
        scannerRef.current = html5QrCode;

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        };

        try {
          // 후면 카메라 우선 시도
          await html5QrCode.start(
            { facingMode: { exact: 'environment' } },
            config,
            onScanSuccess,
            onScanFailure
          );
        } catch (err) {
          console.warn('후면 카메라 강제 실행 실패, 호환 모드로 재시도:', err);
          // 실패 시 일반 모드 재시도
          await html5QrCode.start(
            { facingMode: 'environment' },
            config,
            onScanSuccess,
            onScanFailure
          );
        }
        setStatusMessage('QR 코드를 비춰주세요.');
      } catch (err) {
        console.error('카메라 시작 최종 실패:', err);
        setIsError(true);
        setStatusMessage('카메라를 실행할 수 없습니다.\n브라우저 권한을 확인해주세요.');
        setIsScanning(false);
      }
    }, 400);
  };

  // -------------------------------------------------------------------------
  // 5. 스캔 중지 함수
  // -------------------------------------------------------------------------
  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error('중지 실패:', err);
      }
    }
    setIsScanning(false);
    setStatusMessage('스캔이 중지되었습니다.');
  };

  // -------------------------------------------------------------------------
  // 6. 스캔 성공 핸들러
  // -------------------------------------------------------------------------
  const onScanSuccess = async (decodedText: string) => {
    // 카메라 중지
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch (e) {}
    }
    setIsScanning(false);
    setStatusMessage('확인 중...');

    // storeId 체크 (방어 코드)
    if (storeId === null) {
      setIsError(true);
      setScanResult('오류 발생');
      setStatusMessage('가게 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      // [API 호출] 가져온 storeId와 스캔된 loginId(decodedText) 사용
      const response = await scanQrCode(storeId, decodedText);

      if (response.code === 100 || response.code === 200) {
        setScanResult('적립 완료!');
        setStatusMessage(response.data || '스탬프가 정상적으로 적립되었습니다.');
      } else {
        setIsError(true);
        setScanResult('적립 실패');
        setStatusMessage(response.message || '알 수 없는 오류');
      }
    } catch (error) {
      setIsError(true);
      setScanResult('통신 오류');
      setStatusMessage('서버와 연결할 수 없습니다.');
    }
  };

  const onScanFailure = () => {};

  return (
    <div className="w-full h-full p-4 flex flex-col bg-white min-h-screen">
      <BackButton3 />

      <h1 className="text-[20px] text-black font-medium ml-3 mt-7 mb-6">
        QR코드를 스캔해주세요.
      </h1>

      <div className="w-full flex flex-col items-center justify-center">
        {/* 카메라 영역 */}
        <div
          id="reader"
          className="rounded-lg overflow-hidden bg-black border-2 border-gray-200"
          style={{
            width: '100%',
            maxWidth: '350px',
            minHeight: '350px',
          }}
        >
          {!isScanning && !scanResult && (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <p>카메라가 꺼져있습니다.</p>
            </div>
          )}
        </div>

        {/* 상태 메시지 박스 */}
        <div
          className={`mt-6 p-4 rounded-lg w-full max-w-[350px] text-center shadow-sm transition-colors duration-300 ${
            isError
              ? 'bg-red-50 text-red-600'
              : scanResult
              ? 'bg-blue-50 text-blue-600'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {scanResult && (
            <p className="text-xl font-bold mb-2">{scanResult}</p>
          )}
          <p className="text-sm whitespace-pre-wrap">{statusMessage}</p>
        </div>

        {/* 제어 버튼 */}
        <div className="mt-8 w-full max-w-[350px]">
          {!isScanning ? (
            <button
              onClick={startScanning}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              {scanResult ? '다시 스캔하기' : '카메라 켜기'}
            </button>
          ) : (
            <button
              onClick={stopScanning}
              className="w-full py-4 bg-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-300 transition-colors"
            >
              스캔 취소
            </button>
          )}
        </div>
      </div>
    </div>
  );
};