// src/components/EcomongDetailModal.tsx
import { X } from "lucide-react";

interface EcomongDetailModalProps {
  booth: {
    name: string;
    emoji: string;
  };
  onClose: () => void;
}

export default function EcomongDetailModal({
  onClose,
}: EcomongDetailModalProps) {
  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[390px] animate-slide-up">
        <div className="bg-white rounded-t-3xl shadow-2xl overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors z-10 shadow-lg"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          {/* 카테고리 태그 */}
          <div className="px-4 pt-4">
            <div className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              C구역 스래기통
            </div>
          </div>

          {/* 메인 이미지 영역 */}
          <div className="relative w-full bg-gradient-to-b from-sky-300 via-sky-200 to-green-200 aspect-square overflow-hidden">
            {/* 배경 - 숲 풍경 */}
            <div className="absolute inset-0">
              {/* 하늘 */}
              <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-sky-400 to-sky-200" />

              {/* 구름 */}
              <div className="absolute top-12 left-20 w-24 h-12 bg-white rounded-full opacity-70" />
              <div className="absolute top-24 right-16 w-32 h-10 bg-white rounded-full opacity-60" />

              {/* 나무 */}
              <div className="absolute bottom-0 left-0 w-32 h-40 bg-green-600 rounded-t-3xl opacity-80" />
              <div className="absolute bottom-0 right-0 w-32 h-40 bg-green-600 rounded-t-3xl opacity-80" />

              {/* 풀 */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-green-500" />
            </div>

            {/* 텐트 부스 */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48">
              {/* 텐트 천막 */}
              <div className="relative">
                {/* 주황색 천막 */}
                <div className="bg-gradient-to-b from-orange-400 to-orange-500 rounded-t-3xl h-32 relative shadow-lg">
                  {/* 천막 선 */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-orange-700 transform -translate-x-1/2" />
                    <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-orange-600 opacity-50" />
                    <div className="absolute right-1/4 top-0 bottom-0 w-0.5 bg-orange-600 opacity-50" />
                  </div>
                </div>

                {/* 텐트 기둥 */}
                <div className="absolute left-4 bottom-0 w-2 h-20 bg-amber-700 rounded" />
                <div className="absolute right-4 bottom-0 w-2 h-20 bg-amber-700 rounded" />
              </div>

              {/* 에코몽 - 다람쥐 */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-6xl drop-shadow-lg">
                🐿️
              </div>
            </div>

            {/* 오렌지 풍선/장식 */}
            <div className="absolute bottom-32 left-8 text-5xl opacity-80">
              🎈
            </div>
            <div className="absolute bottom-28 right-8 text-5xl opacity-80">
              🎈
            </div>
          </div>

          {/* 내용 */}
          <div className="px-6 py-6 space-y-4">
            {/* 제목과 설명 */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                내 팀에 온걸 환영해!
                <br />난 하더람치아
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                우리 팀의 마스코트 에코몽과 함께 재미있는 축제를 즐겨보세요!
              </p>
            </div>

            {/* 정보 카드 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 space-y-2">
              <p className="text-xs text-gray-600">
                <span className="font-semibold text-gray-900">팀 이름:</span>{" "}
                C구역 스래기통 팀
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-semibold text-gray-900">활동 내용:</span>{" "}
                환경 미션 수행 및 분리수거 캠페인
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-semibold text-gray-900">특징:</span>{" "}
                재미있고 의미있는 축제 부스 운영
              </p>
            </div>

            {/* 버튼 */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              팀 배정받기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
