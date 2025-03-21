import { CategoryDTO } from '../entities/category/dto';
import { mapCategoryDtoToInternalArray } from '../entities/category/mapper';
import { Category } from '../entities/category/types';
import { fetchJson } from './http.service';

export const findAll = async (): Promise<Category[]> => {
    const categoryDto = await fetchJson<CategoryDTO>("/categories")
    return mapCategoryDtoToInternalArray(categoryDto);
};
