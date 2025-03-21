import { ProductVariantDetailsDTO } from "../product/dto"
import { mapDTOtoVariant } from "../product/mapper"
import { ProductDetails } from "../product/types"
import { CartDTO, CartLineItemDTO } from "./dto"
import { Cart, CartLineItem } from "./types"

export const mapMagentoCart = (id: string, cart: CartDTO, items: CartLineItemDTO[], details: ProductDetails[]): Cart => {
    return {
        id,
        version: 0,
        customerId: null,
        lineItems: mapMagentoCartLineItems(items, details, cart),
        totalPrice: {
            currencyCode: cart.currency.store_currency_code || 'USD',
            centAmount: items.reduce((acc, item) => {
                acc += item.price * item.qty
                return acc
            }, 0) * 100
        },
        totalQuantity: cart.items_qty
    }
}

const mapMagentoCartLineItems = (items: CartLineItemDTO[], details: ProductDetails[], cart: CartDTO): CartLineItem[] => {
    return items.map(item => {
        const product = details.find(detail => detail.sku === item.sku)
        return {
            id: item.item_id.toString(),
            details: product,
            quantity: item.qty,
            totalPrice: item.price * item.qty,
            currencyCode: cart.currency.store_currency_code || 'USD',
            variant: product ? mapDTOtoVariant(product as ProductVariantDetailsDTO) : undefined,
        }
    })
}