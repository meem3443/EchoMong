// src/components/BoothPopup.tsx
import { X, Clock, MapPin } from "lucide-react";

interface BoothPopupProps {
  booth: {
    name: string;
    time: string;
    location: string;
    image: string;
  };
  onClose: () => void;
}

export default function BoothPopup({ booth, onClose }: BoothPopupProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="mx-6 bg-white rounded-2xl shadow-2xl overflow-hidden w-80 animate-scale-in">
        {/* Header */}
        <div className="relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          {/* Image */}
          <div className="h-32 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center">
            <img
              src={booth.image}
              alt={booth.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-3">{booth.name}</h3>

          <div className="space-y-2">
            {/* Time */}
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{booth.time}</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{booth.location}</span>
            </div>
          </div>

          {/* Action Button */}
          <button className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-colors">
            상세정보 보기
          </button>
        </div>
      </div>
    </div>
  );
}
