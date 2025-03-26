export interface Promo {
    text: string;
    order: number;
}

export interface PromoResult {
    sku: string;
    promos: Promo[];
}