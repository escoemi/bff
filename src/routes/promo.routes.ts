import { Router } from 'express';
import { getPromo } from '../controllers/promo.controller';

const router = Router();

router.get('/:sku', getPromo);

export default router;
