export interface CartLineItemDTO {
    item_id: number
    sku: string
    qty: number
    name: string
    price: number
    product_type: string
    quote_id: string
}
export interface CartDTO {
    currency: {
        store_currency_code: string
    }
    items_qty: number
}

export interface AddCartItemPayloadDTO {
    cartItem: {
        qty: number
        quote_id: string
        sku: string
    }
}

export interface ChangeCartItemQuantityPayloadDTO {
    cartItem: {
        qty: number
        quote_id: string
    }
}