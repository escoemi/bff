import { Product } from "./types";

export type ProductDTO = Omit<Product, 'name'> & {
    name: { "en-US": string }
    variant: ProductDTO[]
};