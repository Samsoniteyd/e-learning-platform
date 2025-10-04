'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { quizApi } from '@/lib/api'

interface QuizResultsProps {
  quizId: string
  answers: number[]
}

interface QuizResult {
  id: string
  score: number
  total: number
  percentage: number
  completedAt: string
  quiz: {
    title: string
    course: {
      title: string
    }
  }
}

export function QuizResults({ quizId, answers }: QuizResultsProps) {
  const [result, setResult] = useState<QuizResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function submitQuiz() {
      try {
        const response = await quizApi.submit({
          quizId,
          answers,
        })
        setResult(response.data.attempt)
      } catch (error: any) {
        setError(error.response?.data?.error || 'Failed to submit quiz')
      } finally {
        setLoading(false)
      }
    }

    submitQuiz()
  }, [quizId, answers])

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreVariant = (percentage: number) => {
    if (percentage >= 80) return 'default'
    if (percentage >= 60) return 'secondary'
    return 'destructive'
  }

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return 'Excellent! You have mastered this material.'
    if (percentage >= 80) return 'Great job! You have a good understanding.'
    if (percentage >= 70) return 'Good work! You have a solid foundation.'
    if (percentage >= 60) return 'Not bad! Review the material and try again.'
    return 'Keep practicing! Review the course material and retake the quiz.'
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              </div>
              <div className="flex justify-center">
                <div className="w-32 h-32 bg-muted rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-destructive/15 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-destructive">Submission Failed</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">No Results Available</h2>
              <p className="text-muted-foreground">Unable to load quiz results.</p>
              <Button onClick={() => router.push('/courses')}>
                Back to Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const percentage = result.percentage
  const performanceMessage = getPerformanceMessage(percentage)

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Quiz Results</CardTitle>
          <p className="text-muted-foreground">{result.quiz.title}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Overview */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                <Progress value={percentage} className="w-32 h-32 rounded-full transform -rotate-90" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
                    {percentage}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Badge variant={getScoreVariant(percentage)} className="text-lg px-4 py-2">
                Score: {result.score} / {result.total}
              </Badge>
              <p className="text-lg font-medium">{performanceMessage}</p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.score}</div>
                <p className="text-sm text-muted-foreground">Correct Answers</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-orange-600">{result.total - result.score}</div>
                <p className="text-sm text-muted-foreground">Incorrect Answers</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-green-600">{percentage}%</div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Accuracy</span>
                  <Badge variant={percentage >= 70 ? "default" : "secondary"}>
                    {percentage >= 70 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Completion Time</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(result.completedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Course</span>
                  <span className="text-sm text-muted-foreground">
                    {result.quiz.course.title}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => router.push(`/quiz/results/${quizId}`)}
              variant="outline"
            >
              View Detailed Results
            </Button>
            <Button 
              onClick={() => router.push('/courses')}
            >
              Back to Courses
            </Button>
            <Button 
              onClick={() => router.push(`/quiz/${quizId}`)}
              variant="secondary"
            >
              Retake Quiz
            </Button>
          </div>

          {/* Tips for Improvement */}
          {percentage < 80 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">Tips for Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Review the course materials and focus on areas where you had difficulty
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Take notes on key concepts and create flashcards for important terms
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Practice with similar questions and retake the quiz after studying
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Celebration Message for High Scores */}
          {percentage >= 90 && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-green-800">Outstanding Performance!</h3>
                <p className="text-green-700 mt-2">
                  You've demonstrated excellent understanding of the course material. 
                  Consider moving on to more advanced topics!
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}