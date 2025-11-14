export function EchomongModalContent(props: {
  lyrics: string
  imgSrc: string
  backgroundSrc: string
  onClick?: () => void
}) {
  return (
    <div className="relative w-full h-[70vh]">
      <div className="flex absolute bg-white w-4/5 h-auto text-black items-center justify-center left-1/2 -translate-x-1/2 top-1/6 rounded-lg shadow-2xl ">
        <span className="p-10 text-black  text-lg font-bold">
          {props.lyrics}
        </span>
      </div>
      <img className="w-full h-8/10 rounded-t-lg" src={props.backgroundSrc} />
      <img
        className="w-40 h-40 absolute left-1/2 -translate-x-1/2 bottom-1/4 object-cover "
        src={props.imgSrc}
      />
      <div className="w-full h-5"></div>
      <button
        className="w-4/5 h-1/10 bg-blue-500 rounded-2xl text-2xl font-bold mx-auto block"
        onClick={props.onClick}
      >
        팀 확정하기!
      </button>
    </div>
  )
}
