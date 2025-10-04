import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  resetPassword: (data: { token: string; userId: string; password: string }) =>
    api.post('/auth/reset-password', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/auth/change-password', data),
}

// Courses API
export const coursesApi = {
  getAll: () => api.get('/courses'),
  getById: (id: string) => api.get(`/courses/${id}`),
  enroll: (courseId: string) => api.post('/courses/enroll', { courseId }),
  getEnrollments: () => api.get('/courses/user/enrollments'),
}

// Quiz API
export const quizApi = {
  getByCourse: (courseId: string) => api.get(`/quiz/course/${courseId}`),
  getById: (id: string) => api.get(`/quiz/${id}`),
  startAttempt: (quizId: string) => api.post('/quiz/start', { quizId }),
  submit: (data: { quizId: string; answers: number[] }) =>
    api.post('/quiz/submit', data),
  getResults: (quizId: string) => api.get(`/quiz/results/${quizId}`),
}