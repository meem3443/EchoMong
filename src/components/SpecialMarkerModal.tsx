// src/components/SpecialMarkerModal.tsx
import { X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface SpecialMarkerModalProps {
  onClose: () => void;
}

export default function SpecialMarkerModal({
  onClose,
}: SpecialMarkerModalProps) {
  const [dragProgress, setDragProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setDragProgress(percentage);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  // 캔의 변형 정도 계산
  const canDeformation = dragProgress / 100; // 0 ~ 1

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[390px] animate-slide-up">
        <div className="bg-white rounded-t-3xl shadow-2xl p-6 min-h-[500px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              올바른 캔 분리수거
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* 타이틀 */}
          <p className="text-center text-sm text-gray-600 mb-8">
            자우로 드래그해 캔을 써그러뜨려세요
          </p>

          {/* 캔 표시 영역 */}
          <div className="flex-1 flex items-center justify-center mb-8">
            <svg
              width="120"
              height="200"
              viewBox="0 0 120 200"
              className="drop-shadow-lg"
            >
              {/* 캔 원형 위치 계산 */}
              <defs>
                <linearGradient
                  id="canGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    style={{ stopColor: "#FF6B6B", stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#FF5252", stopOpacity: 1 }}
                  />
                </linearGradient>
                <filter
                  id="shadow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feDropShadow
                    dx="2"
                    dy="4"
                    stdDeviation="3"
                    floodOpacity="0.3"
                  />
                </filter>
              </defs>

              {/* 캔 몸체 - 드래그에 따라 변형 */}
              <g filter="url(#shadow)">
                {/* 상단 */}
                <ellipse
                  cx={60 + canDeformation * 8}
                  cy={20}
                  rx={40 - canDeformation * 8}
                  ry="12"
                  fill="#E8E8E8"
                />

                {/* 캔 몸체 - 곡선으로 찌그러짐 표현 */}
                <path
                  d={`M ${20 + canDeformation * 6} 32 
                     Q ${20 + canDeformation * 10} ${80 + canDeformation * 15}, 
                       ${20 + canDeformation * 6} 160
                     L ${100 - canDeformation * 6} 160
                     Q ${100 - canDeformation * 10} ${80 + canDeformation * 15},
                       ${100 - canDeformation * 6} 32 Z`}
                  fill="url(#canGradient)"
                />

                {/* 캔 위쪽 테두리 */}
                <rect
                  x={40 - canDeformation * 5}
                  y="16"
                  width={40 + canDeformation * 10}
                  height="8"
                  fill="#999"
                  rx="2"
                />

                {/* 캔 로고 동그란 부분 */}
                <circle cx={60} cy="85" r="8" fill="rgba(0,0,0,0.1)" />
              </g>
            </svg>
          </div>

          {/* 슬라이더 */}
          <div className="space-y-3 mb-4">
            <div
              ref={sliderRef}
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              className="relative h-14 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full shadow-inner cursor-pointer flex items-center"
            >
              {/* 슬라이더 채워지는 부분 */}
              <div
                className="absolute h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all"
                style={{ width: `${dragProgress}%` }}
              />

              {/* 손가락 아이콘과 함께 드래그 핸들 */}
              <div
                className="absolute left-0 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-all"
                style={{
                  transform: `translateX(${Math.max(0, dragProgress - 3)}%)`,
                }}
                onMouseDown={handleMouseDown}
              >
                <span className="text-lg">👉</span>
              </div>

              {/* 가이드 텍스트 */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-xs text-gray-600 font-medium">
                  {dragProgress < 50 ? "드래그해주세요" : "거의 다 왔어요!"}
                </p>
              </div>
            </div>

            {/* 진행도 표시 */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>0%</span>
              <span className="font-semibold text-gray-900">
                {Math.round(dragProgress)}%
              </span>
              <span>100%</span>
            </div>
          </div>

          {/* 완료 상태 */}
          {dragProgress >= 90 && (
            <div className="bg-green-50 border border-green-300 rounded-lg p-3 text-center mb-4 animate-pulse">
              <p className="text-sm font-semibold text-green-700">
                ✓ 완벽한 분리수거입니다!
              </p>
            </div>
          )}

          {/* 하단 설명 */}
          <p className="text-center text-xs text-gray-500 leading-relaxed">
            캔을 완전히 찌그러뜨려서 분리수거에 참여해보세요!
          </p>
        </div>
      </div>
    </>
  );
}
