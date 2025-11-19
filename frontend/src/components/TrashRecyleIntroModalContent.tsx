import React, { useState } from 'react'

export function TrashRecyleIntroModalContent() {
  const [sliderValue, setSliderValue] = useState<number>(0)
  const [isRecycled, setIsRecycled] = useState(false)

  const THRESHOLD = 70
  const SHAKE_START = 20

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setSliderValue(val)

    setIsRecycled(val >= THRESHOLD)
  }

  const isShaking = sliderValue > SHAKE_START && sliderValue < THRESHOLD

  const statusText = isRecycled
    ? '재활용 완료!'
    : isShaking
      ? '재활용 중...!'
      : '오른쪽으로 밀어주세요!!'

  const statusColor = isRecycled
    ? 'text-blue-600'
    : isShaking
      ? 'text-orange-500'
      : 'text-gray-400'

  return (
    <div className="flex flex-col items-center justify-center w-full h-auto bg-gray-50 px-4 py-6">
      <style>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        .animate-shake-hard {
          animation: shake 0.5s infinite;
        }
        .animate-pop {
          animation: pop 0.3s ease-out forwards;
        }
        @keyframes pop {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div className="max-w-md w-full flex flex-col items-center gap-6">
        <div className="relative w-64 h-64 md:w-72 md:h-72 shadow-xl rounded-full overflow-hidden bg-white border-4 border-white flex items-center justify-center">
          <div
            className={`absolute inset-0 transition-colors duration-500 ${isRecycled ? 'bg-blue-100' : 'bg-gray-100'}`}
          />

          {isRecycled ? (
            <img
              src="/can_2.png"
              alt="Recycled Can"
              className="relative w-3/4 h-3/4 object-contain animate-pop z-10"
            />
          ) : (
            <img
              src="/can_1.png"
              alt="Trash Can"
              className={`relative w-3/4 h-3/4 object-contain z-10 transition-transform ${isShaking ? 'animate-shake-hard' : ''}`}
              style={{
                filter: isShaking
                  ? `brightness(${100 + (sliderValue - SHAKE_START)}%) sepia(${sliderValue / 2}%)`
                  : 'none',
              }}
            />
          )}

          {isRecycled && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-full h-full bg-blue-400 opacity-20 rounded-full animate-ping"></div>
            </div>
          )}
        </div>

        <h2
          className={`text-xl font-bold transition-colors duration-300 ${statusColor}`}
        >
          {statusText}
        </h2>

        <div className="w-full px-4">
          <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
            <span>Trash</span>
            <span>Process</span>
            <span>Product</span>
          </div>

          <div className="relative flex items-center">
            <div className="absolute left-0 right-0 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-75 ${isRecycled ? 'bg-blue-500' : 'bg-yellow-400'}`}
                style={{ width: `${sliderValue}%` }}
              />
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={handleSliderChange}
              className="
                relative w-full h-3 opacity-0 cursor-pointer z-20
              "
            />

            <div
              className="absolute h-6 w-6 bg-white rounded-full shadow-md border border-gray-200 z-10 pointer-events-none transition-all duration-75 flex items-center justify-center"
              style={{ left: `calc(${sliderValue}% - 12px)` }}
            >
              {isRecycled ? (
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
              ) : (
                <div
                  className={`w-3 h-3 rounded-full ${isShaking ? 'bg-orange-400 animate-pulse' : 'bg-gray-400'}`}
                />
              )}
            </div>
          </div>

          <p className="text-center text-gray-400 text-xs mt-3 break-keep">
            {isRecycled ? '재활용 성공!' : '슬라이더를 끝까지 밀어주세요'}
          </p>
        </div>
      </div>
    </div>
  )
}
