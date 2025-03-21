import { Router } from 'express';
import { createCart, createOrder, getCart, updateCart } from '../controllers/cart.controller';

const router = Router();

router.post('/', createCart);
router.get('/:cartId', getCart);
router.put('/:cartId', updateCart);
router.post('/:cartId/order', createOrder);

export default router;
