import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes';
import errorHandler from './middlewares/errorHandler';
import categoryRoutes from './routes/category.routes';
import cartRoutes from './routes/cart.routes';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/carts', cartRoutes);

app.use(errorHandler);

export default app;
