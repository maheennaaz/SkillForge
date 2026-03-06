import { Router } from 'express';
import { updateVideoProgress, getVideoProgress, getSubjectProgress } from './progress.controller';
import { authenticate } from '../../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.post('/videos/:videoId', updateVideoProgress);
router.get('/videos/:videoId', getVideoProgress);
router.get('/subjects/:subjectId', getSubjectProgress);

export default router;
