import { Request, Response } from 'express';
import prisma from '../utils/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        modules: {
          select: {
            id: true,
            title: true,
            order: true,
          },
          orderBy: {
            order: 'asc'
          }
        },
        _count: {
          select: {
            enrollments: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ courses });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: {
            order: 'asc'
          }
        },
        quizzes: {
          include: {
            _count: {
              select: {
                questions: true,
              }
            }
          }
        },
        _count: {
          select: {
            enrollments: true,
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const enrollInCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
      include: {
        course: {
          select: {
            title: true,
            description: true,
          }
        }
      }
    });

    res.status(201).json({
      message: 'Successfully enrolled in course',
      enrollment,
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserEnrollments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            modules: {
              select: {
                id: true,
                title: true,
              }
            },
            _count: {
              select: {
                modules: true,
                quizzes: true,
              }
            }
          }
        }
      },
      orderBy: {
        enrolledAt: 'desc'
      }
    });

    res.json({ enrollments });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};