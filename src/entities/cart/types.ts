import { ProductDetails } from "../product/types"

export interface Cart {
    id: string
    version?: number
    customerId?: string
    lineItems?: CartLineItem[]
    totalPrice?: CartTotalPrice
    totalQuantity: number
}

export interface CartLineItem {
    id?: string
    details?: ProductDetails
    quantity?: number
    totalPrice?: number
    currencyCode?: string
}

export interface CartTotalPrice {
    currencyCode?: string
    centAmount?: number
}

export type UpdateCartPayload = {
    version?: number
    action: UpdateCartAvailableActionTypes,
    AddLineItem?: AddToCartAction
    RemoveLineItem?: UpdateCartAction
    ChangeLineItemQuantity?: UpdateCartAction
}

export interface UpdateCartAction {
    lineItemId: number
    quantity: number
}

export interface AddToCartAction {
    variantId: string
    quantity: number
}

export type UpdateCartAvailableActionTypes = 'AddLineItem' | 'RemoveLineItem' | 'ChangeLineItemQuantity'