import { PrismaClient, UserRole, CourseLevel } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  const hashedPassword = await bcrypt.hash('password123', 12);

  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@example.com' },
    update: {},
    create: {
      email: 'instructor@example.com',
      password: hashedPassword,
      name: 'Dr. Sarah Johnson',
      role: UserRole.INSTRUCTOR,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      password: hashedPassword,
      name: 'John Doe',
      role: UserRole.STUDENT,
    },
  });

  console.log('✅ Users created:', { instructor: instructor.email, student: student.email });

  const course1 = await prisma.course.upsert({
    where: { id: 'course-1' },
    update: {},
    create: {
      id: 'course-1',
      title: 'Fundamentals of Nursing Practice',
      description: 'Learn the essential principles and practices of professional nursing care, including patient assessment, medication administration, and therapeutic communication.',
      price: 0,
      duration: 120,
      level: CourseLevel.BEGINNER,
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    },
  });

  const course2 = await prisma.course.upsert({
    where: { id: 'course-2' },
    update: {},
    create: {
      id: 'course-2',
      title: 'Advanced Patient Care Management',
      description: 'Master complex patient care scenarios, critical thinking in nursing practice, and advanced assessment techniques for various patient populations.',
      price: 99.99,
      duration: 180,
      level: CourseLevel.INTERMEDIATE,
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
    },
  });

  const course3 = await prisma.course.upsert({
    where: { id: 'course-3' },
    update: {},
    create: {
      id: 'course-3',
      title: 'Critical Care Nursing',
      description: 'Specialized training for intensive care units, including advanced life support, monitoring critical patients, and emergency response protocols.',
      price: 199.99,
      duration: 240,
      level: CourseLevel.ADVANCED,
      imageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400',
    },
  });

  console.log('✅ Courses created:', course1.title, course2.title, course3.title);

  const modules1 = await Promise.all([
    prisma.module.create({
      data: {
        title: 'Introduction to Nursing',
        content: 'Overview of nursing profession, ethics, and professional standards.',
        order: 1,
        courseId: course1.id,
      },
    }),
    prisma.module.create({
      data: {
        title: 'Patient Assessment',
        content: 'Comprehensive guide to patient assessment techniques and documentation.',
        order: 2,
        courseId: course1.id,
      },
    }),
    prisma.module.create({
      data: {
        title: 'Medication Administration',
        content: 'Safe medication administration practices and dosage calculations.',
        order: 3,
        courseId: course1.id,
      },
    }),
  ]);

  const modules2 = await Promise.all([
    prisma.module.create({
      data: {
        title: 'Complex Care Planning',
        content: 'Developing comprehensive care plans for patients with multiple conditions.',
        order: 1,
        courseId: course2.id,
      },
    }),
    prisma.module.create({
      data: {
        title: 'Leadership in Nursing',
        content: 'Leadership skills and team management in healthcare settings.',
        order: 2,
        courseId: course2.id,
      },
    }),
  ]);

  console.log('✅ Modules created for courses');

  const quiz1 = await prisma.quiz.create({
    data: {
      title: 'Nursing Fundamentals Quiz',
      courseId: course1.id,
      duration: 30,
    },
  });

  const quiz2 = await prisma.quiz.create({
    data: {
      title: 'Patient Care Assessment Quiz',
      courseId: course2.id,
      duration: 45,
    },
  });

  console.log('✅ Quizzes created');

  await Promise.all([
    prisma.question.create({
      data: {
        text: 'What is the primary purpose of patient assessment?',
        options: ['To diagnose the patient', 'To gather comprehensive patient information', 'To prescribe medication', 'To discharge the patient'],
        correctAnswer: 1,
        quizId: quiz1.id,
        order: 1,
      },
    }),
    prisma.question.create({
      data: {
        text: 'Which of the following is a vital sign?',
        options: ['Temperature', 'Hair color', 'Shoe size', 'Favorite food'],
        correctAnswer: 0,
        quizId: quiz1.id,
        order: 2,
      },
    }),
    prisma.question.create({
      data: {
        text: 'What does HIPAA stand for?',
        options: ['Health Insurance Portability and Accountability Act', 'Hospital Information Privacy and Access Act', 'Healthcare Information Protection and Administration Act', 'Health Information Privacy and Access Agreement'],
        correctAnswer: 0,
        quizId: quiz1.id,
        order: 3,
      },
    }),

    prisma.question.create({
      data: {
        text: 'What is the most important aspect of care planning?',
        options: ['Cost effectiveness', 'Patient-centered care', 'Time efficiency', 'Staff convenience'],
        correctAnswer: 1,
        quizId: quiz2.id,
        order: 1,
      },
    }),
    prisma.question.create({
      data: {
        text: 'Which leadership style is most effective in nursing?',
        options: ['Autocratic', 'Democratic', 'Laissez-faire', 'Transformational'],
        correctAnswer: 3,
        quizId: quiz2.id,
        order: 2,
      },
    }),
  ]);

  console.log('✅ Questions created');

  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course1.id,
      progress: 0.5,
    },
  });

  console.log('✅ Enrollment created');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📝 Sample accounts created:');
  console.log('Instructor: instructor@example.com / password123');
  console.log('Student: student@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
