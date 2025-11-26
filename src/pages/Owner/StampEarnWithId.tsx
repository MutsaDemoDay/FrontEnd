import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton3 } from "../../components/BackButton3";
import findUserButton from "../../assets/findUserButton.png";

export const StampEarnWithId = () => {
    // DB의 PK가 아닌, 유저가 사용하는 '로그인 아이디'를 입력받음
    const [loginId, setLoginId] = useState(""); 
    const navigate = useNavigate();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (loginId.trim()) {
            navigate(`/stamp-earn/confirm/${loginId}`);
        }
    };

    return (
        <div className="w-full h-full p-4">
            <BackButton3 />
            <h1 className="text-[20px] text-black font-medium ml-3 mt-25">
                적립할 회원의 아이디를 입력해주세요.
            </h1>

            <form onSubmit={onSubmit} className="w-full flex flex-row items-center justify-between mt-30 px-3">
                <input 
                    type="text" 
                    placeholder="예: user1234" 
                    className="flex-1 border-b border-[var(--fill-color2)] focus:outline-none mr-5 text-lg py-1"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                />
                <button type="submit" className="w-[40px] h-[40px] cursor-pointer">
                    <img src={findUserButton} alt="Find User" className="w-full h-full" />
                </button>
            </form>
        </div>
    );
}