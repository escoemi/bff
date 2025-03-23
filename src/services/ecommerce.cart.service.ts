import { UpdateCartPayload } from '../entities/cart/types';
import { fetchJson } from './http.service';
import { findBySku } from './ecommerce.product.service';
import { CartDTO } from '../entities/cart/ecommerce-dto';
import { PlaceOrderPayloadDTO, SetShippingAddressPayloadDTO } from '../entities/cart/dto';

export const createCartService = async () => {
    const order = await createGuestCart({
        currency: "USD"
    });
    return order
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
    const cart = await getCart(id);
    return {
        ...cart,
        lineItems: cart.lineItems.map((item) => {
            return {
                ...item,
                name: item.name["en-US"],
                variant: {
                    ...item.variant,
                    name: item.name["en-US"],
                }
            }
        })
    }
}

export const addCartItem = async (cartId: string, item: UpdateCartPayload) => {
    if (!item.AddLineItem?.variantId) {
        return;
    }
    const data = await findBySku(item.AddLineItem?.variantId);
    const cartData = await getCartService(cartId);
    return addEcommerceCartItem(cartId, {
        version: cartData.version,
        actions: [{
            action: "addLineItem",
            productId: data.id,
            variantId: data.masterVariant.id,
            quantity: item.AddLineItem!.quantity,
        }]
    })
}

export const changeQuantity = async (cartId: string, item: UpdateCartPayload) => {
    const cartData = await getCartService(cartId);
    return changeMagentoCartQuantity(cartId, {
        version: cartData.version,
        actions: [{
            action: "changeLineItemQuantity",
            quantity: item.ChangeLineItemQuantity!.quantity,
            lineItemId: item.ChangeLineItemQuantity?.lineItemId?.toString()
        }]
    })
}

export const removeItem = async (cartId: string, item: UpdateCartPayload) => {
    const cartData = await getCartService(cartId);
    return removeMagentoCartItem(cartId, {
        version: cartData.version,
        actions: [
            {
                action: "removeLineItem",
                lineItemId: item.RemoveLineItem?.lineItemId?.toString()!,
            }
        ]
    })
}


export const setShippingAddress = async (cartId: string, item: UpdateCartPayload) => {
    const action = item.SetShippingAddress!
    const address = {
        key: action.streetNumber,
        title: action.firstName,
        city: action.city,
        country_id: action.country,
        country: action.country,
        email: action.email,
        firstname: action.firstName,
        lastname: action.lastName,
        postalCode: action.postalCode,
        region: action.region,
        region_code: action.region,
        streetName: action.streetName,
        streetNumber: action.streetNumber,
        telephone: '111111111'
    }

    const cartData = await getCartService(cartId);

    const shippingAddressPayload: any = {
        version: cartData.version,
        actions: [
            {
                action: "setShippingAddress",
                address,
            }
        ]
    }

    const data = await setEcommerceShippingAddress(cartId, shippingAddressPayload)
    return data;
}

export const placeOrder = async (cartId: string) => {

    const placeOrderPayload: any = {
        version: "1",
        actions: [{
            action: "removeLineItem",
            "lineItemId": cartId
        }]
    }

    return await placeMagentoOrder(cartId, placeOrderPayload)
}

const createGuestCart = (payload: any) => fetchJson<string>('/carts', { method: 'POST', body: JSON.stringify(payload) })

const getCart = (id: string) => fetchJson<CartDTO>(`/carts/${id}`, { method: 'GET' })

const addEcommerceCartItem = (id: string, payload: any) => fetchJson<void>(`/carts/${id}`, { method: 'POST', body: JSON.stringify(payload) })

const changeMagentoCartQuantity = (id: string, payload: any) => fetchJson<void>(`/carts/${id}`, { method: 'POST', body: JSON.stringify(payload) })

const removeMagentoCartItem = (id: string, payload: any) => fetchJson<void>(`/carts/${id}`, { method: 'POST', body: JSON.stringify(payload) })

const setEcommerceShippingAddress = (id: string, payload: SetShippingAddressPayloadDTO) => fetchJson<void>(`/carts/${id}`, { method: 'POST', body: JSON.stringify(payload) })

const placeMagentoOrder = (id: string, payload: PlaceOrderPayloadDTO) => fetchJson<void>(`/guest-carts/${id}/order`, { method: 'PUT', body: payload })