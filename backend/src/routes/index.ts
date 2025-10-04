import { Router } from 'express';
import authRoutes from './auth';
import courseRoutes from './courses';
import quizRoutes from './quiz';

const router = Router();

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/quiz', quizRoutes);

export default router;