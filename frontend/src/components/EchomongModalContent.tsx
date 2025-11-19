export function EchomongModalContent(props: {
  lyrics: string
  imgSrc: string
  backgroundSrc: string
  onClick?: () => void
}) {
  return (
    <div className="relative w-full flex flex-col items-center overflow-hidden rounded-lg bg-white pb-6">
      <div className="relative w-full h-64 sm:h-80">
        <img
          className="w-full h-full object-cover rounded-t-lg"
          src={props.backgroundSrc}
          alt="background"
        />

        <img
          className="absolute w-32 h-32 left-1/2 -translate-x-1/2 -bottom-10 object-cover z-10 drop-shadow-lg"
          src={props.imgSrc}
          alt="character"
        />
      </div>

      {/* 2. 텍스트 영역 (캐릭터 아래 여백 확보) */}
      <div className="mt-12 px-6 text-center">
        <div className="bg-gray-50/80 p-4 rounded-xl shadow-sm">
          <span className="text-black text-lg font-bold break-keep">
            {props.lyrics}
          </span>
        </div>
      </div>

      {/* 3. 버튼 영역 */}
      <div className="w-full px-6 mt-6">
        <button
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-xl font-bold transition-colors shadow-md"
          onClick={props.onClick}
        >
          팀 확정하기!
        </button>
      </div>
    </div>
  )
}
