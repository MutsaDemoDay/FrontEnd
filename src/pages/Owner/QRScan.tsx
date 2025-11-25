import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { BackButton3 } from "../../components/BackButton3";
import { scanQrCode } from "../../api/OwnerQR"; // 위에서 만든 API 임포트

export const QRScan = () => {
    // 상태 관리
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>("카메라 권한을 허용하고 스캔을 시작하세요.");
    const [isError, setIsError] = useState(false);

    // TODO: 실제 앱에서는 로그인한 사장님의 storeId를 전역 상태(Context/Redux)나 로컬 스토리지에서 가져와야 합니다.
    // 테스트를 위해 임시 값 '1'을 설정했습니다.
    const currentStoreId = 1; 

    // HTML5Qrcode 인스턴스를 저장할 변수
    let html5QrCode: Html5Qrcode | null = null;

    useEffect(() => {
        // 컴포넌트 언마운트 시 정리(Cleanup)
        return () => {
            if (isScanning) {
                stopScanning();
            }
        };
    }, [isScanning]);

    // 스캔 시작 함수
    const startScanning = async () => {
        setIsError(false);
        setScanResult(null);
        setStatusMessage("카메라를 불러오는 중...");

        try {
            html5QrCode = new Html5Qrcode("reader");

            await html5QrCode.start(
                { facingMode: "environment" }, // 후면 카메라 우선 사용
                {
                    fps: 10, // 초당 프레임
                    qrbox: { width: 250, height: 250 }, // 스캔 영역 크기
                },
                onScanSuccess,
                onScanFailure
            );

            setIsScanning(true);
            setStatusMessage("QR 코드를 네모 칸 안에 맞춰주세요.");
        } catch (err) {
            console.error("카메라 시작 실패:", err);
            setIsError(true);
            setStatusMessage("카메라를 시작할 수 없습니다. 권한을 확인해주세요.");
            setIsScanning(false);
        }
    };

    // 스캔 중지 함수
    const stopScanning = async () => {
        try {
            if (html5QrCode) {
                await html5QrCode.stop();
                html5QrCode.clear();
            }
        } catch (err) {
            console.error("카메라 중지 실패:", err);
        }
        setIsScanning(false);
    };

    // 스캔 성공 핸들러
    const onScanSuccess = async (decodedText: string, decodedResult: any) => {
        console.log(`스캔 성공: ${decodedText}`, decodedResult);
        
        // 1. 스캔 중지 (중복 요청 방지)
        // 주의: React 상태 업데이트 문제로 인해 인스턴스를 직접 정리하거나 플래그를 사용해야 함
        // 여기서는 html5-qrcode의 stop()을 호출하지 않고 화면을 전환하거나 상태만 변경합니다.
        // 하지만 UX상 바로 멈추는 것이 깔끔하므로 stopScanning() 로직을 수행합니다.
        
        // html5QrCode 객체는 지역변수라 여기서 접근이 어려울 수 있으니
        // 실제로는 new Html5Qrcode("reader")를 다시 잡아 stop 하거나
        // isScanning 상태를 이용해 useEffect에서 정리되도록 유도합니다.
        const scanner = new Html5Qrcode("reader");
        try {
           await scanner.stop();
           scanner.clear();
        } catch(e) { /* 이미 멈췄거나 에러 무시 */ }
        
        setIsScanning(false);
        setStatusMessage("QR 확인 중...");

        // 2. API 호출
        try {
            // decodedText가 userId라고 가정 (UserQR 로직에 따라)
            const userId = decodedText; 
            
            const response = await scanQrCode(currentStoreId, userId);

            if (response.code === 100) {
                setScanResult("적립이 완료되었습니다!");
                setStatusMessage(response.data); // "스탬프가 정상적으로 적립되었습니다."
            } else {
                setIsError(true);
                setScanResult("적립에 실패했습니다.");
                setStatusMessage(response.message || "알 수 없는 오류가 발생했습니다.");
            }
        } catch (error: any) {
            setIsError(true);
            setScanResult("에러가 발생했습니다.");
            setStatusMessage(error.response?.data?.message || "서버 통신 중 오류가 발생했습니다.");
        }
    };

    // 스캔 실패 핸들러 (계속 호출됨 - 로그 너무 많이 찍히니 비워두거나 필요한 경우만 사용)
    const onScanFailure = (error: any) => {
        // console.warn(`Code scan error = ${error}`);
    };

    return (
        <div className="w-full h-full p-4 flex flex-col bg-white">
            <BackButton3 />
            
            <h1 className="text-[20px] text-black font-medium ml-3 mt-7 mb-6">
                QR코드를 스캔해주세요.
            </h1>

            {/* 카메라 영역 */}
            <div className="w-full flex flex-col items-center justify-center">
                <div 
                    id="reader" 
                    className="w-full max-w-[300px] h-[300px] bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200"
                >
                    {!isScanning && !scanResult && (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            카메라가 꺼져있습니다.
                        </div>
                    )}
                </div>

                {/* 상태 메시지 및 결과 표시 */}
                <div className={`mt-6 p-4 rounded-lg w-full max-w-[300px] text-center ${
                    isError ? 'bg-red-50 text-red-600' : 
                    scanResult ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'
                }`}>
                    {scanResult && <p className="text-xl font-bold mb-2">{scanResult}</p>}
                    <p className="text-sm">{statusMessage}</p>
                </div>

                {/* 제어 버튼 */}
                <div className="mt-8 w-full max-w-[300px]">
                    {!isScanning ? (
                        <button 
                            onClick={startScanning}
                            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                        >
                            {scanResult ? "다시 스캔하기" : "카메라 켜기"}
                        </button>
                    ) : (
                        <button 
                            onClick={() => {
                                // 강제 중지 시 로직
                                const scanner = new Html5Qrcode("reader");
                                scanner.stop().then(() => scanner.clear());
                                setIsScanning(false);
                                setStatusMessage("스캔이 중지되었습니다.");
                            }}
                            className="w-full py-4 bg-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-300 transition-colors"
                        >
                            스캔 중지
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}