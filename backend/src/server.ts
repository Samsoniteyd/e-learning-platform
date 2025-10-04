
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import courseRoutes from './routes/courses';
import quizRoutes from './routes/quiz';
import app from './app';

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quiz', quizRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 E-learning API ready at http://localhost:${PORT}`);
});