'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'

interface Course {
  id: string
  title: string
  description: string
  price: number
  duration: number
  level: string
  imageUrl?: string
  _count?: {
    enrollments: number
  }
}

interface CourseGridProps {
  courses: Course[]
}

export function CourseGrid({ courses }: CourseGridProps) {
  const router = useRouter()

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No courses found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card key={course.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between mb-2">
              <Badge variant="secondary" className={getLevelColor(course.level)}>
                {course.level.toLowerCase()}
              </Badge>
              <div className="text-lg font-bold text-blue-600">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </div>
            </div>
            <CardTitle className="text-xl">{course.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {course.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{course.duration} minutes</span>
                <span>{course._count?.enrollments || 0} students</span>
              </div>
              <Button 
                className="w-full"
                onClick={() => router.push(`/courses/${course.id}`)}
              >
                View Course
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}