import { fetchJson } from './http.service';

export const findAll = async (): Promise<any[]> => {
    const categoryDto = await fetchJson<any>("/categories")
    return categoryDto.results.map((el:any) => ({
        ...el,
        name: el.name["en-US"],
        slug:el.slug["en-US"]
    }));
};
