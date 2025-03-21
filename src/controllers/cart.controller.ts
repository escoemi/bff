import { Request, Response } from 'express';
import {
    createCartService,
    getCartService,
    placeOrder,
    updateCartService,
} from '../services/cart.service';

export const createCart = async (req: Request, res: Response) => {
    try {
        const newCart = await createCartService();
        res.status(201).json(newCart);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getCart = async(req: Request, res: Response) => {
    try {
        const cart = await getCartService(req.params.cartId);
        if (!cart) {
            res.status(404).json({ error: 'Cart not found' });
            return;
        }
        res.status(200).json(cart);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateCart = async(req: Request, res: Response) => {
    try {
        const updatedCart = await updateCartService(req.params.cartId, req.body);
        res.status(200).json(updatedCart);
    } catch (error: any) {
        const status = error.message === 'Cart not found' ? 404 : 400;
        res.status(status).json({ error: error.message });
    }
};

export const createOrder = (req: Request, res: Response): void => {
    try {
        const order = placeOrder(req.params.cartId);
        res.status(201).json(order);
    } catch (error: any) {
        const status = error.message === 'Cart not found' ? 404 : 500;
        res.status(status).json({ error: error.message });
    }
};
