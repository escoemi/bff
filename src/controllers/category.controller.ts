import { Request, Response, NextFunction } from 'express';

let categoryService;
let flag = process.env.ECOMMERCE_FLAG == "true"

if (flag) {
  categoryService = require('../services/ecommerce.category.service');
} else {
  categoryService = require('../services/category.service');
}

const { findAll } = categoryService

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await findAll();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};
