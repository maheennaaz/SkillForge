import { Router } from 'express';
import { getSubjects, getSubjectTree, getEnrolledSubjects, getSubjectById } from './subject.controller';
import { authenticate } from '../../middleware/authMiddleware';

const router = Router();

router.get('/', getSubjects);
router.get('/enrolled', authenticate, getEnrolledSubjects);
router.get('/:subjectId', getSubjectById);
router.get('/:subjectId/tree', authenticate, getSubjectTree);

export default router;
