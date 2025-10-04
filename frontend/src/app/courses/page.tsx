import { Header } from '@/components/layout/header'
import { CourseGrid } from '@/components/courses/course-grid'
import { SearchFilterForm } from '@/components/courses/search-filter-form'
import { coursesApi } from '@/lib/api'

async function getCourses() {
  try {
    const response = await coursesApi.getAll()
    return response.data.courses || []
  } catch (error) {
    console.error('Failed to fetch courses:', error)
    return []
  }
}

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nursing Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover comprehensive nursing courses designed to advance your career and knowledge
          </p>
        </div>

        <div className="mb-8">
          <SearchFilterForm 
            onFilter={(filters) => {
              console.log('Filters:', filters)
            }}
          />
        </div>

        <CourseGrid courses={courses} />
      </div>
    </div>
  )
}