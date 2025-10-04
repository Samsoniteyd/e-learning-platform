import { Header } from '@/components/layout/header'
import { UpdateProfileForm } from '@/components/profile/update-profile'
import { authApi } from '@/lib/api'

async function getProfile() {
  try {
    const response = await authApi.getProfile()
    return response.data.user
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    return null
  }
}

export default async function ProfilePage() {
  const user = await getProfile()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Please log in</h1>
            <p className="text-gray-600 mt-2">You need to be logged in to view your profile.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
          </div>
          <UpdateProfileForm user={user} />
        </div>
      </div>
    </div>
  )
}