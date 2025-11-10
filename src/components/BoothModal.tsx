// src/components/BoothModal.tsx
import { Clock, MapPin, Share2 } from "lucide-react";

interface BoothModalProps {
  booth: {
    name: string;
    time: string;
    location: string;
    image: string;
  };
  onClose: () => void;
}

export default function BoothModal({ booth, onClose }: BoothModalProps) {
  return (
    <>
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* 모달 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[390px] animate-slide-up">
        <div className="bg-white rounded-t-3xl shadow-2xl p-6 max-h-[70vh] overflow-y-auto">
          {/* 드래그 핸들 */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* 콘텐츠 */}
          <div className="space-y-4">
            {/* 이미지 + 정보 카드 */}
            <div className="flex gap-3 bg-white">
              {/* 이미지 */}
              <div className="w-20 h-20 flex-shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 rounded-xl overflow-hidden">
                  <img
                    src={booth.image}
                    alt={booth.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </div>

              {/* 정보 */}
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-sm line-clamp-2">
                  {booth.name}
                </h3>
                <div className="mt-2 space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{booth.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{booth.location}</span>
                  </div>
                </div>
              </div>

              {/* 공유 버튼 */}
              <button className="mt-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* 버튼 */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
              상세정보 보기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
