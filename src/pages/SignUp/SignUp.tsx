import BackButton from "../../components/BackButton";

export const SignUp = () => {
    return (
        <div className="flex flex-col items-center h-screen">
            {/* 상단바 */}
            <div className="flex flex-row items-center justify-between mt-4 px-6 gap-32">
                <BackButton />
                <p className="">회원 가입</p>
                <div></div>
            </div>

            {/* 회원가입 선택지 */}
            <div className="flex flex-col mt-32 gap-6">
                <button className="w-[344px] h-[200px] bg-[#F3F3F3] rounded-[10px] text-black font-medium text-[20px]">개인 회원가입하기<br /> <p className="text-[14px] text-[#898989] font-semibold">손님이시라면</p></button>
                <button className="w-[344px] h-[200px] bg-[#F3F3F3] rounded-[10px] text-black font-medium text-[20px]">사장님으로 회원가입하기</button>
            </div>

        </div>
    );
};