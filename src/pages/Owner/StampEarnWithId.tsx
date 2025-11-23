import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton3 } from "../../components/BackButton3";
import findUserButton from "../../assets/findUserButton.png";

export const StampEarnWithId = () => {
    const [userId, setUserId] = useState("");
    const navigate = useNavigate();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userId) {
            navigate(`/stamp-earn/confirm/${userId}`);
        }
    };

    return (
        <div className="w-full h-full p-4">
            <BackButton3 />
            <h1 className="text-[20px] text-black font-medium ml-3 mt-25">
                적립할 회원 ID를 입력해주세요.
            </h1>

            <form onSubmit={onSubmit} className="w-full flex flex-row items-center justify-between mt-30 px-3">
                <input 
                    type="text" 
                    placeholder="" 
                    className="flex-1 border-b border-[var(--fill-color2)] focus:outline-none mr-5 text-lg py-1"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <button type="submit" className="w-[40px] h-[40px]">
                    <img src={findUserButton} alt="Find User" className="w-full h-full" />
                </button>
            </form>
        </div>
    );
}