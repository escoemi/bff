export interface Category {
    id: number | string;
    name: string;
    description: string;
    slug: string;
    parent?: { id: number | string } | null;
    ancestors?: { type: string; id: number | string }[];
}