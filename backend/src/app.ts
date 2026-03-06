import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes';
import subjectRoutes from './modules/subjects/subject.routes';
import videoRoutes from './modules/videos/video.routes';
import progressRoutes from './modules/progress/progress.routes';
import cartRoutes from './modules/cart/cart.routes';
import assessmentRoutes from './modules/assessments/assessments.routes';
import healthRoutes from './modules/health/health.routes';
import userRoutes from './modules/users/user.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/health', healthRoutes);

// Error handling
app.use(errorHandler);

export default app;
