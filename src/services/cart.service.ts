import { v4 as uuidv4 } from 'uuid';
import { Cart, CartLineItem, UpdateCartPayload } from '../entities/cart/types';
import { fetchJson } from './http.service';
import { AddCartItemPayloadDTO, CartDTO, CartLineItemDTO, ChangeCartItemQuantityPayloadDTO } from '../entities/cart/dto';
import { mapMagentoCart } from '../entities/cart/mapper';
import { getProductBySKU } from './product.service';
import { ProductDetails } from '../entities/product/types';

export const updateCartService = async(cartId: string, payload: UpdateCartPayload) => {
    const { action } = payload;

    switch (action) {
        case 'AddLineItem': {
            console.log("adding item", payload, cartId)
            return addCartItem(cartId, payload)
        }
        case 'RemoveLineItem': {
            return removeItem(cartId, payload)
        }
        case 'ChangeLineItemQuantity': {
            return changeQuantity(cartId, payload)
        }
        default:
            throw new Error('Unsupported action');
    }

};



export const createCartService = () => createMagentoGuestCart()

export const getCartService = async (id: string) => {
    const [cart, items] = await Promise.all([getMagentoCart(id), getMagentoCartItems(id)])

    let details: ProductDetails[] = []

    if (items.length) {
        //@ts-ignore
        details = await Promise.all(items.map(async (item) => {
            return await getProductBySKU(item.sku)
        }))
    }
    console.log(details)

    return mapMagentoCart(id, cart, items, details)
}

export const addCartItem = (cartId: string, item: UpdateCartPayload) =>
    addMagentoCartItem(cartId, {
        cartItem: {
            qty: item.AddLineItem!.quantity,
            sku: item.AddLineItem!.variantId,
            quote_id: item.AddLineItem!.variantId
        }
    })

export const changeQuantity = (cartId: string, item: UpdateCartPayload) =>
    // eslint-disable-next-line
    changeMagentoCartQuantity(cartId, item.ChangeLineItemQuantity?.lineItemId?.toString()!, {
        cartItem: {
            qty: item.ChangeLineItemQuantity!.quantity,
            quote_id: cartId
        }
    })

export const removeItem = (cartId: string, item: UpdateCartPayload) =>
    // eslint-disable-next-line
    removeMagentoCartItem(cartId, item.RemoveLineItem?.lineItemId?.toString()!)


const createMagentoGuestCart = () => fetchJson<string>('/guest-carts', { method: 'POST' })

const getMagentoCart = (id: string) => fetchJson<CartDTO>(`/guest-carts/${id}`, { method: 'GET' })

const getMagentoCartItems = (id: string) => fetchJson<CartLineItemDTO[]>(`/guest-carts/${id}/items`, { method: 'GET' })

//@ts-ignore
const addMagentoCartItem = (id: string, payload: AddCartItemPayloadDTO) => fetchJson<void>(`/guest-carts/${id}/items`, { method: 'POST', body: JSON.stringify(payload)})
//@ts-ignore
const changeMagentoCartQuantity = (id: string, itemId: string, payload: ChangeCartItemQuantityPayloadDTO) => fetchJson<void>(`/guest-carts/${id}/items/${itemId}`, { method: 'PUT', body: payload })

const removeMagentoCartItem = (id: string, itemId: string) => fetchJson<void>(`/guest-carts/${id}/items/${itemId}`, { method: 'DELETE' })