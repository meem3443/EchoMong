export function BoothInfoModalContent(props: {
  clubName: string
  imgSrc: string
  btnText1: string
  btnText2: string
  onClick1?: () => void
  onClick2?: () => void
}) {
  return (
    <div className="w-full h-auto flex flex-col items-center justify-center mt-10 gap-3 p-5">
      <p className="text-black text-2xl font-bold">새로운 부스를 발견했어요</p>
      <p className="text-black text-sm">
        퀴즈를 풀고 부스에서 사용 가능한 쿠폰을 받으세요!
      </p>
      <img className="rounded-lg" src={props.imgSrc} />
      <p>{props.clubName}</p>
      <div className="flex  w-full items-center justify-center gap-5">
        <button
          className="w-20 p-2 rounded-sm h-auto  bg-blue-600"
          onClick={props.onClick1}
        >
          {props.btnText1}
        </button>
        <button
          className="w-20 p-2 rounded-sm bg-blue-300"
          onClick={props.onClick2}
        >
          {props.btnText2}
        </button>
      </div>
    </div>
  )
}
