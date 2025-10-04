import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../utils/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendEmail, emailTemplates } from '../utils/email';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                description: true,
              }
            }
          }
        },
        quizAttempts: {
          include: {
            quiz: {
              select: {
                title: true,
                course: {
                  select: {
                    title: true,
                  }
                }
              }
            }
          },
          orderBy: {
            completedAt: 'desc'
          },
          take: 5
        }
      }
    });

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json({ 
        message: 'If the email exists, a password reset link has been sent' 
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); 

    const hashedResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedResetToken,
        resetTokenExpiry,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&id=${user.id}`;

    const emailTemplate = emailTemplates.passwordReset(user.name, resetUrl);

    await sendEmail(user.email, emailTemplate.subject, emailTemplate.html);

    res.json({ 
      message: 'If the email exists, a password reset link has been sent' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    
    if (error instanceof Error && error.message === 'Failed to send email') {
      return res.status(500).json({ error: 'Failed to send reset email. Please try again later.' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, userId, password } = req.body;

    if (!token || !userId || !password) {
      return res.status(400).json({ error: 'Token, user ID, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        resetTokenExpiry: {
          gt: new Date(), 
        },
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    if (hashedToken !== user.resetToken) {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        updatedAt: new Date(),
      },
    });

    const emailTemplate = emailTemplates.passwordResetSuccess(user.name);
    await sendEmail(user.email, emailTemplate.subject, emailTemplate.html);

    res.json({ 
      message: 'Password has been reset successfully. You can now login with your new password.' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date(),
      },
    });

    const emailTemplate = emailTemplates.passwordChanged(user.name);
    await sendEmail(user.email, emailTemplate.subject, emailTemplate.html);

    res.json({ 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

