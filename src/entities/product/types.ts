import { Variant } from "../types";


export interface Product {
    id: string;
    name: string;
    description: string;
    slug: string;
    variants: Variant[];
    masterVariant: Variant;
}


export type ProductDetails = {
    id: number
    name: string
    description?: string
    price: number
    images: string[]
    slug?: string
    sku: string
    code: string
    size: string
    color: string
    sizes: number[]
    colors: number[]
}
