import { ProductDTO } from "../product/ecommerce-dto";



export interface CartDTO {
    version: number,
    lineItems: ProductDTO[],
}