'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Enrollment {
  id: string
  enrolledAt: string
  progress: number
  course: {
    id: string
    title: string
    description: string
    _count: {
      modules: number
      quizzes: number
    }
  }
}

interface DashboardStatsProps {
  user: User
  enrollments: Enrollment[]
}

export function DashboardStats({ user, enrollments }: DashboardStatsProps) {
  const router = useRouter()

  const completedCourses = enrollments.filter(e => e.progress === 100).length
  const inProgressCourses = enrollments.filter(e => e.progress > 0 && e.progress < 100).length
  const totalQuizzes = enrollments.reduce((acc, enrollment) => acc + enrollment.course._count.quizzes, 0)

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments.length}</div>
            <p className="text-xs text-muted-foreground">Enrolled courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCourses}</div>
            <p className="text-xs text-muted-foreground">Finished courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCourses}</div>
            <p className="text-xs text-muted-foreground">Active learning</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuizzes}</div>
            <p className="text-xs text-muted-foreground">Available quizzes</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Enrollments */}
      <Card>
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
          <CardDescription>
            Continue your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
              <Button onClick={() => router.push('/courses')}>
                Browse Courses
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{enrollment.course.title}</h3>
                    <p className="text-sm text-gray-600">
                      {enrollment.course._count.modules} modules • {enrollment.course._count.quizzes} quizzes
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{enrollment.progress}% complete</p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => router.push(`/courses/${enrollment.course.id}`)}
                  >
                    Continue
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}