import { ProductDetailsDTO, ProductDTO, ProductVariantDetailsDTO } from '../entities/product/dto';
import { mapMagentoProductDetails, mapProductDtoItemToProduct } from '../entities/product/mapper';
import { Product, ProductDetails } from '../entities/product/types';
import { fetchJson } from './http.service';

interface QueryParams {
  offset?: any;
  limit?: any;
  categoryId?: any;
}

export const findAll = async ({ offset, limit, categoryId }: QueryParams): Promise<Product[]> => {
  const off = Number(offset) || 0;
  const lim = Number(limit) || 10;
  const endpoint = `/products?searchCriteria[filterGroups][0][filters][0][field]=category_id&\
  searchCriteria[filterGroups][0][filters][0][value]=${categoryId}&\
  searchCriteria[filterGroups][0][filters][0][conditionType]=eq&\
  searchCriteria[sortOrders][0][field]=created_at&\
  searchCriteria[sortOrders][0][direction]=DESC&\
  searchCriteria[pageSize]=${lim}&\
  searchCriteria[currentPage]=${off}`
  const dto = await fetchJson<ProductDTO>(endpoint)
  return dto.items.map(mapProductDtoItemToProduct)
};

export const findBySku = async (sku: string): Promise<ProductDetails | undefined> => {
  const code = sku.split('-')[0]
  const [productVariantDetails, productDetails] = await Promise.all([getProductBySKU(sku), getProductByCode(code)])
  return mapMagentoProductDetails(productVariantDetails, productDetails);
};


export const getProductBySKU = (sku: string) => {
  return fetchJson<ProductVariantDetailsDTO>(`/products/${sku}`, { method: 'GET' })
}

const getProductByCode = (code: string) => {
  return fetchJson<ProductDetailsDTO>(`/products/${code}`, { method: 'GET' })
}