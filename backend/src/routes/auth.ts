import express from 'express';
import { 
  register, 
  login, 
  getProfile, 
  forgotPassword, 
  resetPassword, 
  changePassword,

} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateRequest, authSchemas } from '../middleware/validation.mddleware';

const router = express.Router();

router.post('/register', validateRequest(authSchemas.register), register);
router.post('/login', validateRequest(authSchemas.login), login);
router.get('/profile', authenticateToken, getProfile);
router.post('/forgot-password', validateRequest(authSchemas.forgotPassword), forgotPassword);
router.post('/reset-password', validateRequest(authSchemas.resetPassword), resetPassword);
router.post('/change-password', authenticateToken, validateRequest(authSchemas.changePassword), changePassword);


export default router;