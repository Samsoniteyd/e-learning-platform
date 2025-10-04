import { Header } from '@/components/layout/header'
import { QuizResults } from '@/components/quiz/quiz-results'
import { quizApi } from '@/lib/api'

async function getQuizResults(quizId: string) {
  try {
    const response = await quizApi.getResults(quizId)
    return response.data.attempts
  } catch (error) {
    console.error('Failed to fetch quiz results:', error)
    return []
  }
}

export default async function QuizResultsPage({ params }: { params: { quizId: string } }) {
  const attempts = await getQuizResults(params.quizId)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Quiz Results History</h1>
          {attempts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No quiz attempts found.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {attempts.map((attempt: any) => (
                <QuizResults 
                  key={attempt.id} 
                  quizId={params.quizId} 
                  answers={attempt.answers} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}