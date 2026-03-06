import { Router } from 'express';
import { getCart, addToCart, removeFromCart } from './cart.controller';
import { authenticate } from '../../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getCart);
router.post('/', authenticate, addToCart);
router.delete('/:subjectId', authenticate, removeFromCart);

export default router;
