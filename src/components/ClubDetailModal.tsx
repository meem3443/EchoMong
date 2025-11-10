// src/components/ClubDetailModal.tsx
import { X, MapPin, Clock } from "lucide-react";

interface ClubDetailModalProps {
  club: {
    name: string;
    history: string;
    poster: string;
    boothDescription: string;
    boothTime: string;
    location: string;
    emoji: string;
  };
  onClose: () => void;
}

export default function ClubDetailModal({
  club,
  onClose,
}: ClubDetailModalProps) {
  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[390px] animate-slide-up">
        <div className="bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          {/* Poster Image */}
          <div className="w-full h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 relative">
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {club.emoji}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-4">
            {/* Club Name */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{club.name}</h2>
            </div>

            {/* Club History Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                동아리 소개
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
                {club.history}
              </p>
            </div>

            {/* Booth Information Section */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                부스 정보
              </h3>

              {/* Time */}
              <div className="flex items-start gap-3 mb-3">
                <Clock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">운영 시간</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {club.boothTime}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">위치</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {club.location}
                  </p>
                </div>
              </div>

              {/* Booth Description */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-900 leading-relaxed">
                  {club.boothDescription}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-colors">
                좋아요
              </button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
                더 알아보기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
