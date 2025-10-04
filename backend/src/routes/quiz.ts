import express from 'express';
import { 
  getQuizByCourse, 
  getQuizById, 
  startQuizAttempt, 
  submitQuiz, 
  getQuizResults 
} from '../controllers/quiz.controller';
import { authenticateToken, optionalAuth } from '../middleware/auth.middleware';
import { validateRequest, quizSchemas } from '../middleware/validation.mddleware';

const router = express.Router();

router.get('/course/:courseId', optionalAuth, getQuizByCourse);
router.get('/:id', optionalAuth, getQuizById);
router.post('/start', authenticateToken, validateRequest(quizSchemas.start), startQuizAttempt);
router.post('/submit', authenticateToken, validateRequest(quizSchemas.submit), submitQuiz);
router.get('/results/:quizId', authenticateToken, getQuizResults);

export default router;