# E-Learning Platform Setup Guide

This guide will help you set up and run the e-learning platform for nursing education.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Git

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Create a `.env` file in the `backend` directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/e_learning_platform"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here-change-this-in-production"

# Email Configuration (Optional - for password reset)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="your-email@gmail.com"

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# Server
PORT="5000"
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database with sample data
npx prisma db seed
```

### 4. Start Backend Server
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Start Frontend Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Database Schema

The application uses the following main entities:
- **Users**: Students, Instructors, Admins
- **Courses**: Learning content with modules
- **Modules**: Course content sections
- **Quizzes**: Assessments for courses
- **Questions**: Quiz questions with multiple choice answers
- **Enrollments**: User course enrollments
- **QuizAttempts**: User quiz submissions and scores

## Features Available

### Authentication
- ✅ User Registration
- ✅ User Login
- ✅ JWT Token Authentication
- ✅ Protected Routes
- ⚠️ Password Reset (requires email configuration)

### Course Management
- ✅ View All Courses
- ✅ Course Details
- ✅ Course Enrollment
- ✅ User Enrollments

### Quiz System
- ✅ View Quizzes by Course
- ✅ Take Quizzes
- ✅ Quiz Scoring
- ✅ Quiz Results

## Quick Start Commands

```bash
# Start both frontend and backend
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

## Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Check your DATABASE_URL in the `.env` file
3. Run `npx prisma db push` to sync schema

### API Connection Issues
1. Verify backend is running on port 5000
2. Check NEXT_PUBLIC_API_URL in frontend `.env.local`
3. Ensure CORS is properly configured

### Authentication Issues
1. Verify JWT_SECRET is set in backend `.env`
2. Check that tokens are being stored in localStorage

## Next Steps

1. Set up your PostgreSQL database
2. Configure environment variables
3. Run the setup commands above
4. Test registration and login functionality
5. Add sample courses and quizzes through the database or admin interface

## Development Notes

- The application uses shadcn/ui components for consistent styling
- Authentication is handled via JWT tokens
- All API routes are prefixed with `/api`
- Frontend uses Next.js 15 with App Router
- Backend uses Express.js with TypeScript
