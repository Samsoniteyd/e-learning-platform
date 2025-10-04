import { Header } from '@/components/layout/header'
import { CourseDetail } from '@/components/courses/course-detail'
import { coursesApi } from '@/lib/api'

async function getCourse(id: string) {
  try {
    const response = await coursesApi.getById(id)
    return response.data.course
  } catch (error) {
    console.error('Failed to fetch course:', error)
    return null
  }
}

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id)

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
            <p className="text-gray-600 mt-2">The course you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CourseDetail course={course} />
    </div>
  )
}