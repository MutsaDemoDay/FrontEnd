import React, { useState, useRef, type ChangeEvent } from 'react';
import BackButton from '../../components/BackButton';

// 이미지 에셋 import
// (TypeScript에서 svg/png import 오류가 난다면 global.d.ts 선언이 필요할 수 있습니다)
import emptystar from '../../assets/emptystar.svg';
import fullstar from '../../assets/star_full_icon.png';
import insertPhotoIcon from '../../assets/insert_photo_icon.png';
import photoEmptyIcon from '../../assets/photo_empty_icon.png';

export const StoreReview: React.FC = () => {
  // 1. 별점 상태 관리 (number 타입)
  const [score, setScore] = useState<number>(0);
  const [hoverScore, setHoverScore] = useState<number>(0);

  // 2. 이미지 상태 관리 (File 객체 배열, URL string 배열)
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // input 태그 제어를 위한 Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 별점 클릭 핸들러
  const handleStarClick = (idx: number) => {
    setScore(idx + 1);
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;

    // 파일이 선택되지 않았을 경우 처리
    if (!fileList || fileList.length === 0) return;

    const file = fileList[0];

    // 최대 3장 제한
    if (imageFiles.length >= 3) {
      alert('사진은 최대 3장까지 업로드 가능합니다.');
      return;
    }

    // 1. 백엔드 전송용 파일 저장 (불변성 유지)
    setImageFiles((prev) => [...prev, file]);

    // 2. 미리보기용 URL 생성 및 저장
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrls((prev) => [...prev, fileUrl]);

    // 연속해서 같은 파일을 올릴 수 있도록 input 값 초기화
    e.target.value = '';
  };

  // 카메라 아이콘 클릭 시 hidden input 트리거
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full flex flex-col">
      {/* 헤더 영역 */}
      <header className="relative flex items-center justify-center p-4 border-b border-gray-200 flex-shrink-0">
        <div className="absolute left-4">
          <BackButton />
        </div>
        <h1 className="text-[16px] font-semibold">Store Review</h1>
      </header>

      <div className="flex flex-col items-center justify-center mt-[60px] px-4">
        {/* 1. 별점 섹션 */}
        <p className="font-medium text-[color:var(--fill-color7)] text-[20px]">
          후기를 작성해보세요!
        </p>
        <div className="flex flex-row w-[200px] h-[40px] items-center justify-between mt-4">
          {[0, 1, 2, 3, 4].map((idx) => (
            <img
              key={idx}
              // 마우스 오버 점수가 있으면 그걸 사용, 아니면 확정 점수 사용
              src={idx < (hoverScore || score) ? fullstar : emptystar}
              alt={`star-${idx + 1}`}
              className="w-[35px] h-[35px] cursor-pointer transition-transform hover:scale-110"
              onMouseEnter={() => setHoverScore(idx + 1)}
              onMouseLeave={() => setHoverScore(0)}
              onClick={() => handleStarClick(idx)}
            />
          ))}
        </div>

        {/* 2. 사진 업로드 섹션 */}
        <div className="flex flex-row items-center justify-center mt-15 gap-3">
          {/* 숨겨진 파일 Input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* 1번: 사진 추가 버튼 (클릭 시 파일창 열림) */}
          <div
            onClick={triggerFileInput}
            className="w-[71px] h-[71px] rounded-lg overflow-hidden cursor-pointer active:scale-95 transition-transform"
          >
            <img
              src={insertPhotoIcon}
              alt="Add photo"
              className="w-[71px] h-[71px]"
            />
          </div>

          {/* 2번: 미리보기 슬롯 (3개 고정) */}
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className="w-[71px] h-[71px] rounded-lg overflow-hidden flex-shrink-0"
            >
              <img
                // 해당 인덱스에 이미지가 있으면 미리보기, 없으면 빈 아이콘
                src={previewUrls[idx] ? previewUrls[idx] : photoEmptyIcon}
                alt={`slot-${idx}`}
                className={`w-full h-full ${
                  previewUrls[idx] ? 'object-cover' : 'object-contain'
                }`}
              />
            </div>
          ))}
        </div>

        <textarea
          className="w-[340px] h-[168px] border border-(--fill-color3) rounded-[20px] p-4 mt-8 text-[13px] text-(--fill-color7) placeholder:text-(--fill-color3) focus:outline-none resize-none"
          placeholder={`유용한 후기를 알려주세요!\n작성 내용은 마이페이지와 가게 리뷰탭에 노출됩니다.`}
        />

        {/* (테스트용) 데이터 확인 버튼 */}
        <button
          onClick={() => {
            console.log('Score:', score);
            console.log('Files:', imageFiles);
          }}
          className="mt-10 w-full max-w-[320px] h-[48px] bg-(--main-color) text-white py-3 rounded-[40px] font-bold transition-colors cursor-pointer"
        >
          등록하기
        </button>
      </div>
    </div>
  );
};
