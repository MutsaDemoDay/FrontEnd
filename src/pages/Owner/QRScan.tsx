import { BackButton3 } from "../../components/BackButton3";

export const QRScan = () => {
    return (
        <div className="w-full h-full p-4">
            <BackButton3 />
            <h1 className="text-[20px] text-black font-medium ml-3 mt-7">
                QR코드를 스캔해주세요.
            </h1>
        </div>
    );
}