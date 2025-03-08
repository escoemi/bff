import { CategoryDTO } from "./dto";
import { Category } from "./types";


export const mapCategoryDtoToInternalArray = (
    categoryDto: CategoryDTO,
    ancestors: { type: string; id: number | string }[] = []
): Category[] => {
    const internalCategory: Category = {
        id: categoryDto.id,
        name: categoryDto.name,
        description: categoryDto.name,
        slug: categoryDto.name.toLowerCase().replace(/\s+/g, '-'),
        parent: ancestors.length > 0 ? { id: ancestors[ancestors.length - 1].id } : null,
        ancestors: ancestors,
    };

    const newAncestors = [...ancestors, { type: 'category', id: categoryDto.id }];

    const children = categoryDto.children_data || [];
    const childrenCategories = children.reduce((acc: Category[], child: CategoryDTO) => {
        return acc.concat(mapCategoryDtoToInternalArray(child, newAncestors));
    }, [] as Category[]);

    return [internalCategory, ...childrenCategories];
};

export const mapCategoryDtosToInternalArray = (
    categoryDtos: CategoryDTO[]
): Category[] => {
    return categoryDtos.reduce((acc: Category[], dto: CategoryDTO) => {
        return acc.concat(mapCategoryDtoToInternalArray(dto));
    }, [] as Category[]);
};