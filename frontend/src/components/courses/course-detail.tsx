'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EnrollForm } from '@/components/courses/enroll-form'
import { coursesApi } from '@/lib/api'

interface Course {
  id: string
  title: string
  description: string
  price: number
  duration: number
  level: string
  imageUrl?: string
  modules: Array<{
    id: string
    title: string
    order: number
  }>
  quizzes: Array<{
    id: string
    title: string
    _count: {
      questions: number
    }
  }>
}

interface CourseDetailProps {
  course: Course
}

export function CourseDetail({ course }: CourseDetailProps) {
  const [showEnrollForm, setShowEnrollForm] = useState(false)
  const router = useRouter()

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleEnroll = async () => {
    try {
      await coursesApi.enroll(course.id)
      router.push(`/courses/${course.id}`)
    } catch (error) {
      console.error('Failed to enroll:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary" className={getLevelColor(course.level)}>
                {course.level.toLowerCase()}
              </Badge>
              <div className="text-2xl font-bold text-blue-600">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
            <p className="text-gray-600 text-lg mb-6">{course.description}</p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{course.duration} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{course.modules.length} modules</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{course.quizzes.length} quizzes</span>
              </div>
            </div>

            {!showEnrollForm ? (
              <Button 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={() => setShowEnrollForm(true)}
              >
                Enroll in Course
              </Button>
            ) : (
              <EnrollForm 
                courseId={course.id}
                courseTitle={course.title}
              />
            )}
          </div>

          {/* Modules Section */}
          <Card>
            <CardHeader>
              <CardTitle>Course Modules</CardTitle>
              <CardDescription>
                Step-by-step learning path
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {course.modules.map((module, index) => (
                  <div key={module.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{module.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quizzes Section */}
          {course.quizzes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Course Quizzes</CardTitle>
                <CardDescription>
                  Test your knowledge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {course.quizzes.map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{quiz.title}</h3>
                        <p className="text-sm text-gray-600">
                          {quiz._count.questions} questions
                        </p>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => router.push(`/quiz/${quiz.id}`)}
                      >
                        Take Quiz
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Lifetime access</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Certificate of completion</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Mobile and desktop access</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}