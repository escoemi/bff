import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/product.service';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { offset, limit, categoryId } = req.query;
    const products = await productService.findAll({ offset, limit, categoryId });
    res.status(200).json({ results: products, offset, total:products.length, limit });
  } catch (error) {
    next(error);
  }
};

export const getProductBySku = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sku = req.params.sku;
    const product = await productService.findBySku(sku);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};
