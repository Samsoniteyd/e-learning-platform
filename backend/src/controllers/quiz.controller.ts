import { Request, Response } from 'express';
import prisma from '../utils/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const getQuizByCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    const quizzes = await prisma.quiz.findMany({
      where: { courseId },
      include: {
        _count: {
          select: {
            questions: true,
            attempts: true,
          }
        },
        attempts: {
          where: {
            userId: (req as AuthRequest).user?.id
          },
          orderBy: {
            completedAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.json({ quizzes });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getQuizById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user?.id;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: {
            order: 'asc'
          },
          select: {
            id: true,
            text: true,
            options: true,
            order: true,
          }
        },
        course: {
          select: {
            title: true,
            id: true,
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    if (userId) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: quiz.courseId
          }
        }
      });

      if (!enrollment) {
        return res.status(403).json({ error: 'You must enroll in the course to take this quiz' });
      }
    }

    res.json({ quiz });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const startQuizAttempt = async (req: AuthRequest, res: Response) => {
  try {
    const { quizId } = req.body;
    const userId = req.user.id;

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: quiz.courseId
        }
      }
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'You must enroll in the course to take this quiz' });
    }

    const existingAttempt = await prisma.quizAttempt.findFirst({
      where: {
        userId,
        quizId,
        completedAt: null
      }
    });

    if (existingAttempt) {
      return res.json({ 
        attempt: existingAttempt,
        message: 'Resuming existing attempt'
      });
    }

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        score: 0,
        total: quiz.questions.length,
        answers: [],
      }
    });

    res.status(201).json({
      attempt,
      message: 'Quiz attempt started'
    });
  } catch (error) {
    console.error('Start quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const submitQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { quizId, answers } = req.body;
    const userId = req.user.id;

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++;
      }
    });

    const attempt = await prisma.quizAttempt.updateMany({
      where: {
        userId,
        quizId,
        completedAt: null
      },
      data: {
        score,
        answers,
        completedAt: new Date(),
      }
    });

    if (attempt.count === 0) {
      return res.status(404).json({ error: 'No active quiz attempt found' });
    }

    const completedAttempt = await prisma.quizAttempt.findFirst({
      where: {
        userId,
        quizId,
        completedAt: { not: null }
      },
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
      }
    });

    res.json({
      message: 'Quiz submitted successfully',
      attempt: completedAttempt,
      score,
      total: quiz.questions.length,
      percentage: Math.round((score / quiz.questions.length) * 100)
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getQuizResults = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { quizId } = req.params;

    const attempts = await prisma.quizAttempt.findMany({
      where: {
        userId,
        quizId,
        completedAt: { not: null }
      },
      include: {
        quiz: {
          select: {
            title: true,
            questions: {
              select: {
                id: true,
                text: true,
                options: true,
                correctAnswer: true,
              }
            }
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    });

    res.json({ attempts });
  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};