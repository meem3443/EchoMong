// src/components/SpecialMarker.tsx
import { useState } from "react";

interface SpecialMarkerProps {
  onPopClick: () => void;
}

export default function SpecialMarker({ onPopClick }: SpecialMarkerProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onPopClick();

    // 애니메이션 완료 후 리셋
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="absolute top-[68%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-20"
      >
        {/* 배경 파이 애니메이션 */}
        {isAnimating && (
          <>
            {/* 첫 번째 원 - 파란색 */}
            <div className="absolute inset-0 -left-4 -top-4 w-14 h-14 border-2 border-blue-400 rounded-full animate-pop-ring opacity-0" />

            {/* 두 번째 원 - 파란색 */}
            <div
              className="absolute inset-0 -left-8 -top-8 w-20 h-20 border-2 border-blue-300 rounded-full animate-pop-ring-slow opacity-0"
              style={{ animationDelay: "0.1s" }}
            />

            {/* 세 번째 원 - 파란색 */}
            <div
              className="absolute inset-0 -left-12 -top-12 w-28 h-28 border-2 border-blue-200 rounded-full animate-pop-ring-slow opacity-0"
              style={{ animationDelay: "0.2s" }}
            />
          </>
        )}

        {/* 메인 마커 */}
        <div
          className={`relative w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full border-3 border-yellow-600 shadow-lg flex items-center justify-center transform transition-transform duration-300 ${
            isAnimating ? "scale-150" : "scale-100"
          }`}
        >
          <span className="text-lg font-bold text-white">!</span>
        </div>

        {/* 하단 포인터 */}
        <div className="absolute left-1/2 -translate-x-1/2 top-10 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-yellow-600" />

        {/* 펄싱 배경 */}
        <div
          className="absolute inset-0 w-12 h-12 bg-yellow-400 rounded-full opacity-75 animate-pulse"
          style={{ zIndex: -1 }}
        />
      </button>
    </>
  );
}
