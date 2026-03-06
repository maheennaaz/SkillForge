import { Router } from 'express';
import { getVideoById } from './video.controller';
import { authenticate } from '../../middleware/authMiddleware';

const router = Router();

router.get('/:videoId', authenticate, getVideoById);

export default router;
