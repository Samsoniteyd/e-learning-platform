import { Header } from '@/components/layout/header'
import { QuizInterface } from '@/components/quiz/quiz-interface'
import { quizApi } from '@/lib/api'

async function getQuiz(id: string) {
  try {
    const response = await quizApi.getById(id)
    return response.data.quiz
  } catch (error) {
    console.error('Failed to fetch quiz:', error)
    return null
  }
}

export default async function QuizPage({ params }: { params: { id: string } }) {
  const quiz = await getQuiz(params.id)

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Quiz not found</h1>
            <p className="text-gray-600 mt-2">The quiz you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <QuizInterface quiz={quiz} />
    </div>
  )
}