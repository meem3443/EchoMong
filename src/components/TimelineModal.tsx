// src/components/TimelineModal.tsx
import { X, Clock } from "lucide-react";

interface Performance {
  id: string;
  time: string;
  title: string;
  artist: string;
  stage: string;
}

interface TimelineModalProps {
  performances: Performance[];
  onClose: () => void;
}

export default function TimelineModal({
  performances,
  onClose,
}: TimelineModalProps) {
  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[390px] animate-slide-up">
        <div className="bg-white rounded-t-3xl shadow-2xl max-h-[70vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">공연 일정</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Timeline */}
          <div className="px-6 py-4 space-y-4">
            <div className="space-y-6">
              {performances.map((perf, index) => (
                <div key={perf.id} className="relative">
                  {/* Timeline Line */}
                  {index !== performances.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-blue-400 to-transparent" />
                  )}

                  {/* Timeline Item */}
                  <div className="flex gap-4">
                    {/* Timeline Dot */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-sm font-bold text-gray-900">
                            {perf.time}
                          </span>
                          <span className="text-xs text-gray-500">
                            {perf.stage}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          {perf.title}
                        </h3>
                        <p className="text-xs text-gray-600">{perf.artist}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Button */}
          <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
              전체 일정 보기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
