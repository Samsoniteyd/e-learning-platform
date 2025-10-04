import { Header } from '@/components/layout/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { coursesApi, quizApi } from '@/lib/api'

async function getQuizzes() {
  try {
    const coursesResponse = await coursesApi.getAll()
    const courses = coursesResponse.data.courses || []
    
    const quizzesWithCourse = await Promise.all(
      courses.map(async (course:any) => {
        try {
          const quizzesResponse = await quizApi.getByCourse(course.id)
          const quizzes = quizzesResponse.data.quizzes || []
          return quizzes.map((quiz: any) => ({
            ...quiz,
            course: {
              id: course.id,
              title: course.title,
              level: course.level
            }
          }))
        } catch (error) {
          console.error(`Failed to fetch quizzes for course ${course.id}:`, error)
          return []
        }
      })
    )
    
    return quizzesWithCourse.flat()
  } catch (error) {
    console.error('Failed to fetch quizzes:', error)
    return []
  }
}

export default async function QuizPage() {
  const quizzes = await getQuizzes()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Available Quizzes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test your knowledge with our interactive nursing quizzes
          </p>
        </div>

        {quizzes.length === 0 ? (
          <div className="text-center py-12">
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">No Quizzes Available</h3>
                  <p className="text-gray-600">
                    There are no quizzes available at the moment. Please check back later or enroll in a course to access quizzes.
                  </p>
                  <Button asChild>
                    <a href="/courses">Browse Courses</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">
                      {quiz.course.level.toLowerCase()}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {quiz.duration}m
                    </div>
                  </div>
                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                  <CardDescription>
                    From: {quiz.course.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{quiz._count?.questions || 0} questions</span>
                      <span>{quiz._count?.attempts || 0} attempts</span>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <a href={`/quiz/${quiz.id}`}>
                          Start Quiz
                        </a>
                      </Button>
                      <Button asChild variant="outline">
                        <a href={`/courses/${quiz.course.id}`}>
                          View Course
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}