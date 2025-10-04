import { Header } from '@/components/layout/header'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { authApi, coursesApi } from '@/lib/api'

async function getDashboardData() {
  try {
    const [profileResponse, enrollmentsResponse] = await Promise.all([
      authApi.getProfile(),
      coursesApi.getEnrollments()
    ])
    
    return {
      user: profileResponse.data.user,
      enrollments: enrollmentsResponse.data.enrollments
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
    return { user: null, enrollments: [] }
  }
}

export default async function DashboardPage() {
  const { user, enrollments } = await getDashboardData()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Please log in</h1>
            <p className="text-gray-600 mt-2">You need to be logged in to view your dashboard.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
        </div>
        <DashboardStats user={user} enrollments={enrollments} />
      </div>
    </div>
  )
}