import { Request, Response } from 'express';
import * as promoService from '../services/promo.service'

export const getPromo = async (req: Request, res: Response) => {
    try {
        const sku = req.params.sku;
        const data = await promoService.getPromos(sku)
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};



