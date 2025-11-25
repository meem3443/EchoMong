import { QuizInfoContent } from '@/components/QuizInfoContent'

export function QuizPage() {
  // TODO : need to add api (title, imgSrc, answer)
  return (
    <div className="flex flex-col w-full h-full bg-white">
      <QuizInfoContent
        title="퀴즈 풀기"
        imgSrc="poster_1.jpg"
        answer={['오해', '오예', '오우예']}
      />
    </div>
  )
}
