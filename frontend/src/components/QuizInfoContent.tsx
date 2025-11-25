import { useNavigate } from '@tanstack/react-router'
import TopNav from './common/TopNav'

export function QuizInfoContent(props: {
  title: string
  imgSrc: string
  answer: Array<string>
}) {
  const navigate = useNavigate()

  const handleAnswerClick = (selectedAnswer: string) => {
    if (selectedAnswer == props.answer[0]) navigate({ to: '/reward' })
  }

  return (
    <div className="flex flex-col w-full h-full bg-white">
      <TopNav title="퀴즈 풀기" />
      <div className="flex flex-col mx-auto bg-white w-full h-auto text-black items-center justify-center">
        <img className="w-full h-full object-contain p-10" src={props.imgSrc} />
        <p className="font-bold text-2xl bg-sky-200 p-2 rounded-2xl mb-5">
          위 공연의 이름은 무엇일까요?
        </p>
        <div className="grid grid-cols-1 w-full gap-2 justify-items-center">
          {props.answer.map((item, index) => (
            <button
              key={index}
              className="border-2 border-b-black w-3/4 p-3 rounded-2xl hover:bg-gray-100 transition-colors"
              onClick={() => handleAnswerClick(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
