import axios from "axios"
import { ContentStackResponse, mapContentStackPromos } from "../entities/promo/mapper";

const api_key = process.env.CONTENT_STACK_API_KEY
const authorization = process.env.CONTENT_STACK_MANAGMENT_KEY
const url = process.env.CONTENT_STACK_URL

export const getPromos = async (sku: string) => {
    try {
        const data = await axios.get<ContentStackResponse>(`${url}/content_types/product/entries`, {
            headers: {
                api_key,
                authorization,
                "Content-Type": "application/json"
            }
        })

        return mapContentStackPromos(data.data, sku);
    } catch (e) {
        console.log(e)
    }

}
