import express from 'express';
import { 
  getAllCourses, 
  getCourseById, 
  enrollInCourse, 
  getUserEnrollments 
} from '../controllers/course.controller';
import { authenticateToken, optionalAuth } from '../middleware/auth.middleware';
import { validateRequest, courseSchemas } from '../middleware/validation.mddleware';

const router = express.Router();

router.get('/', optionalAuth, getAllCourses);
router.get('/:id', optionalAuth, getCourseById);
router.post('/enroll', authenticateToken, enrollInCourse);
router.get('/user/enrollments', authenticateToken, getUserEnrollments);

export default router;