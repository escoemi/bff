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

export interface SetShippingAddressPayloadDTO {
    addressInformation: {
        shipping_address: {
            city: string
            country_id: string
            email: string
            firstname: string
            lastname: string
            postcode: string
            region: string
            region_code: string
            region_id?: number
            street: string[]
            telephone: string
        }
        shipping_carrier_code?: string
        shipping_method_code?: string
    }
}

export interface EstimateShippingMethodPayloadDTO {
    address: {
        city: string
        country_id: string
        email: string
        firstname: string
        lastname: string
        postcode: string
        region: string
        region_code: string
        region_id?: number
        street: string[]
        telephone: string
    }
}


export interface ShippingMethodDTO {
    carrier_code: string
    method_code: string
    carrier_title: string
    method_title: string
}

export interface PaymentMethodDTO {
    code: string
    title: string
}

export interface PlaceOrderPayloadDTO {
    paymentMethod: {
      method: string
    }
  }