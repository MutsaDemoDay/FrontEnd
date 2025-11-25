import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { BackButton3 } from "../../components/BackButton3";
import { scanQrCode } from "../../api/OwnerQR";

export const QRScan = () => {
    // -------------------------------------------------------------------------
    // 1. 상태 및 Ref 관리
    // -------------------------------------------------------------------------
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>("카메라 권한을 허용해주세요.");
    const [isError, setIsError] = useState(false);
    
    // 스캐너 인스턴스를 컴포넌트 생명주기 내내 유지하기 위해 ref 사용
    const scannerRef = useRef<Html5Qrcode | null>(null);

    // TODO: 사장님 로그인 정보에서 실제 storeId 가져오기
    const currentStoreId = 1; 

    // -------------------------------------------------------------------------
    // 2. 컴포넌트 종료(Unmount) 시 클린업
    // -------------------------------------------------------------------------
    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                try {
                    // 페이지 나갈 때 스캐너가 켜져있다면 끄기
                    scannerRef.current.stop().catch((err) => console.log("Stop failed", err));
                    scannerRef.current.clear();
                } catch (e) {
                    // 무시
                }
            }
        };
    }, []);

    // -------------------------------------------------------------------------
    // 3. 스캔 시작 함수 (핵심 수정 부분)
    // -------------------------------------------------------------------------
    const startScanning = async () => {
        setIsError(false);
        setScanResult(null);
        setStatusMessage("카메라를 불러오는 중...");
        
        // UI를 먼저 '스캔 중' 상태로 변경하여 <div id="reader">가 화면에 확실히 렌더링되게 함
        setIsScanning(true);

        // [중요] 리액트가 DOM을 그릴 시간을 400ms 줌 (흰 화면 방지 핵심)
        setTimeout(async () => {
            try {
                // 기존 인스턴스가 있다면 정리
                if (scannerRef.current) {
                    try {
                        await scannerRef.current.stop();
                        scannerRef.current.clear();
                    } catch (e) { /* 무시 */ }
                }

                // 새 인스턴스 생성
                const html5QrCode = new Html5Qrcode("reader");
                scannerRef.current = html5QrCode;

                const config = {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0, // 모바일에서 비율 깨짐 방지
                    // 지원 포맷 제한 (성능 최적화)
                    formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ]
                };

                // [전략 1] 후면 카메라 강제 실행 시도
                try {
                    await html5QrCode.start(
                        { facingMode: { exact: "environment" } }, 
                        config,
                        onScanSuccess,
                        onScanFailure
                    );
                } catch (err) {
                    console.warn("후면 카메라 강제 실행 실패, 호환 모드로 재시도:", err);
                    
                    // [전략 2] 실패 시 일반 모드(후면 선호)로 재시도
                    await html5QrCode.start(
                        { facingMode: "environment" }, 
                        config,
                        onScanSuccess,
                        onScanFailure
                    );
                }

                setStatusMessage("QR 코드를 비춰주세요.");

            } catch (err) {
                console.error("카메라 시작 최종 실패:", err);
                setIsError(true);
                setStatusMessage("카메라를 실행할 수 없습니다.\n브라우저 권한을 확인해주세요.");
                setIsScanning(false);
            }
        }, 400); 
    };

    // -------------------------------------------------------------------------
    // 4. 스캔 중지 함수
    // -------------------------------------------------------------------------
    const stopScanning = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
            } catch (err) {
                console.error("중지 실패:", err);
            }
        }
        setIsScanning(false);
        setStatusMessage("스캔이 중지되었습니다.");
    };

    // -------------------------------------------------------------------------
    // 5. 스캔 성공 핸들러
    // -------------------------------------------------------------------------
    const onScanSuccess = async (decodedText: string) => {
        // 중복 요청 방지를 위해 즉시 스캔 중지
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                // clear()는 하지 않고 화면을 유지하거나, 원하면 clear() 호출
            } catch (e) {}
        }
        
        // 상태 업데이트
        setIsScanning(false);
        setStatusMessage("확인 중...");
        
        try {
            // API 호출
            const response = await scanQrCode(currentStoreId, decodedText);

            if (response.code === 100) {
                setScanResult("✅ 적립 완료!");
                setStatusMessage(response.data); 
            } else {
                setIsError(true);
                setScanResult("⚠️ 적립 실패");
                setStatusMessage(response.message || "알 수 없는 오류");
            }
        } catch (error: any) {
            setIsError(true);
            setScanResult("❌ 에러 발생");
            setStatusMessage("서버와 통신할 수 없습니다.");
        }
    };

    // 스캔 실패 핸들러 (너무 잦은 로그 방지를 위해 비워둠)
    const onScanFailure = () => {};

    return (
        <div className="w-full h-full p-4 flex flex-col bg-white min-h-screen">
            <BackButton3 />
            
            <h1 className="text-[20px] text-black font-medium ml-3 mt-7 mb-6">
                QR코드를 스캔해주세요.
            </h1>

            <div className="w-full flex flex-col items-center justify-center">
                
                {/* [중요] 카메라 영역 
                   id="reader"는 라이브러리가 비디오를 삽입하는 타겟입니다.
                   width와 height를 명시적으로 주지 않으면 높이가 0이 되어 흰 화면만 보입니다.
                */}
                <div 
                    id="reader" 
                    className="rounded-lg overflow-hidden bg-black border-2 border-gray-200"
                    style={{ 
                        width: "100%", 
                        maxWidth: "350px", 
                        // 카메라가 꺼져있을 때도 공간을 차지하게 minHeight 설정 (매우 중요)
                        minHeight: "350px" 
                    }}
                >
                    {/* 카메라가 꺼져있고 결과도 없을 때만 안내 문구 표시 */}
                    {!isScanning && !scanResult && (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                            <p>카메라가 꺼져있습니다.</p>
                        </div>
                    )}
                </div>

                {/* 상태 메시지 박스 */}
                <div className={`mt-6 p-4 rounded-lg w-full max-w-[350px] text-center shadow-sm transition-colors duration-300 ${
                    isError ? 'bg-red-50 text-red-600' : 
                    scanResult ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                    {scanResult && <p className="text-xl font-bold mb-2">{scanResult}</p>}
                    <p className="text-sm whitespace-pre-wrap">{statusMessage}</p>
                </div>

                {/* 제어 버튼 */}
                <div className="mt-8 w-full max-w-[350px]">
                    {!isScanning ? (
                        <button 
                            onClick={startScanning}
                            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                        >
                            {scanResult ? "다시 스캔하기" : "카메라 켜기"}
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