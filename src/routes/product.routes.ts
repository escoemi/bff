import { Router } from 'express';
import { getProducts, getProductBySku } from '../controllers/product.controller';

const router = Router();

router.get('/', getProducts);

router.get('/:sku', getProductBySku);

export default router;