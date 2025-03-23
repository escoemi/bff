import { ProductVariantDetailsDTO } from '../entities/product/dto';
import { fetchJson } from './http.service';

interface QueryParams {
    offset?: any;
    limit?: any;
    categoryId?: any;
}

export const findAll = async ({ offset, limit, categoryId }: QueryParams): Promise<any> => {
    const endpoint = `/product-projections/search?filter=categories.id:"${categoryId}"&offset=${offset}&limit=${limit}`
    const dto = await fetchJson<any>(endpoint)
    return {
        results: dto.results.map((el: any) => {
            return {
                ...el,
                name: el.name["en-US"]
            }
        })
    }
};

export const findBySku = async (sku: string): Promise<any> => {
    const data = await getProductBySKU(sku);

    return data.results[0];
};


export const getProductBySKU = (sku: string):any => {
    return fetchJson<ProductVariantDetailsDTO>(`/product-projections/search?filter=variants.sku:"${sku}"`, { method: 'GET' })
}
