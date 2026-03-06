import { Router } from 'express';
import { getQuizBySection, submitQuiz } from './assessments.controller';
import { authenticate } from '../../middleware/authMiddleware';

const router = Router();

router.get('/section/:sectionId', authenticate, getQuizBySection);
router.post('/submit', authenticate, submitQuiz);

export default router;
