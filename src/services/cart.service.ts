import { UpdateCartPayload } from '../entities/cart/types';
import { fetchJson } from './http.service';
import { AddCartItemPayloadDTO, CartDTO, CartLineItemDTO, ChangeCartItemQuantityPayloadDTO, EstimateShippingMethodPayloadDTO, ShippingMethodDTO, SetShippingAddressPayloadDTO, PaymentMethodDTO, PlaceOrderPayloadDTO } from '../entities/cart/dto';
import { mapMagentoCart } from '../entities/cart/mapper';
import { getProductBySKU } from './product.service';
import { ProductDetails } from '../entities/product/types';

export const createCartService = async () => {
    const orderId = await createGuestCart();
    return {
        "id": orderId,
        "version": 0,
        "customerId": "cd32da0a-f190-4c12-adbd-9dbc978460cd",
        "lineItems": [],
        "totalPrice": {
            "currencyCode": "USD",
            "centAmount": 0
        },
        "totalQuantity": 0
    }
}

export const updateCartService = async (cartId: string, payload: UpdateCartPayload) => {
    const { action } = payload;

    switch (action) {
        case 'AddLineItem': {
            return addCartItem(cartId, payload)
        }
        case 'RemoveLineItem': {
            return removeItem(cartId, payload)
        }
        case 'ChangeLineItemQuantity': {
            return changeQuantity(cartId, payload)
        }
        case 'SetShippingAddress': {
            return setShippingAddress(cartId, payload)
        }
        default:
            throw new Error('Unsupported action');
    }

};


export const getCartService = async (id: string) => {
    const [cart, items] = await Promise.all([getCart(id), getCartItems(id)])

    let details: ProductDetails[] = []
    if (items.length) {
        //@ts-ignore
        details = await Promise.all(items.map(async (item) => {
            return await getProductBySKU(item.sku)
        }))
    }
    return mapMagentoCart(id, cart, items, details)
}

export const addCartItem = (cartId: string, item: UpdateCartPayload) => {
    return addMagentoCartItem(cartId, {
        cartItem: {
            qty: item.AddLineItem!.quantity,
            sku: item.AddLineItem!.variantId,
            quote_id: item.AddLineItem!.variantId
        }
    })
}

export const changeQuantity = (cartId: string, item: UpdateCartPayload) =>
    changeMagentoCartQuantity(cartId, item.ChangeLineItemQuantity?.lineItemId?.toString()!, {
        cartItem: {
            qty: item.ChangeLineItemQuantity!.quantity,
            quote_id: cartId
        }
    })

export const removeItem = (cartId: string, item: UpdateCartPayload) =>
    removeMagentoCartItem(cartId, item.RemoveLineItem?.lineItemId?.toString()!)


export const setShippingAddress = async (cartId: string, item: UpdateCartPayload) => {
    const action = item.SetShippingAddress!
    const address = {
        city: action.city,
        country_id: action.country,
        email: action.email,
        firstname: action.firstName,
        lastname: action.lastName,
        postcode: action.postalCode,
        region: action.region,
        region_code: action.region,
        street: [action.streetName, action.streetNumber],
        telephone: '111111111'
    }

    const methods = await estimateShippingAddress(cartId, { address })

    const shippingAddressPayload: SetShippingAddressPayloadDTO = {
        addressInformation: {
            shipping_address: address,
            shipping_carrier_code: methods[0].carrier_code,
            shipping_method_code: methods[0].method_code,
        }
    }

    const data = await setMagentoShippingAddress(cartId, shippingAddressPayload)
    await setBillingAddress(cartId, { address })
    return data;
}

export const placeOrder = async (cartId: string) => {
    const paymentMethods = await getPaymentMethods(cartId)

    const placeOrderPayload: PlaceOrderPayloadDTO = {
        paymentMethod: {
            method: paymentMethods[0].code,
        }
    }

    return await placeMagentoOrder(cartId, placeOrderPayload)
}

const createGuestCart = () => fetchJson<string>('/guest-carts', { method: 'POST' })

const getCart = (id: string) => fetchJson<CartDTO>(`/guest-carts/${id}`, { method: 'GET' })

const getCartItems = (id: string) => fetchJson<CartLineItemDTO[]>(`/guest-carts/${id}/items`, { method: 'GET' })

const addMagentoCartItem = (id: string, payload: AddCartItemPayloadDTO) => fetchJson<void>(`/guest-carts/${id}/items`, { method: 'POST', body: JSON.stringify(payload) })

const changeMagentoCartQuantity = (id: string, itemId: string, payload: ChangeCartItemQuantityPayloadDTO) => fetchJson<void>(`/guest-carts/${id}/items/${itemId}`, { method: 'PUT', body: JSON.stringify(payload) })

const removeMagentoCartItem = (id: string, itemId: string) => fetchJson<void>(`/guest-carts/${id}/items/${itemId}`, { method: 'DELETE' })

const estimateShippingAddress = (id: string, payload: EstimateShippingMethodPayloadDTO) => fetchJson<ShippingMethodDTO[]>(`/guest-carts/${id}/estimate-shipping-methods`, { method: 'POST', body: JSON.stringify(payload) })

const setMagentoShippingAddress = (id: string, payload: SetShippingAddressPayloadDTO) => fetchJson<void>(`/guest-carts/${id}/shipping-information`, { method: 'POST', body: JSON.stringify(payload) })

const setBillingAddress = (id: string, payload: EstimateShippingMethodPayloadDTO) => fetchJson<ShippingMethodDTO[]>(`/guest-carts/${id}/billing-address`, { method: 'POST', body: JSON.stringify(payload) })

const getPaymentMethods = (id: string) => fetchJson<PaymentMethodDTO[]>(`/guest-carts/${id}/payment-methods`, { method: 'GET' })

const placeMagentoOrder = (id: string, payload: PlaceOrderPayloadDTO) => fetchJson<void>(`/guest-carts/${id}/order`, { method: 'PUT', body: payload })