import { Request, Response, NextFunction } from 'express';

let productService;
let flag = process.env.ECOMMERCE_FLAG == "true"

if (!flag) {
    productService = require('../services/ecommerce.product.service');
} else {
    productService = require('../services/product.service');
}

const { findAll, findBySku } = productService;


export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { offset, limit, categoryId } = req.query;
    const products = await findAll({ offset, limit, categoryId });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductBySku = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sku = req.params.sku;
    const product = await findBySku(sku);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};
