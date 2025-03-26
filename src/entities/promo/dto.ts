export interface ContentStackResponse {
    entries: ContentStackEntry[];
}

export interface ContentStackEntry {
    title: string;
    url: string;
    commercetools_id: string;
    description: string;
    featured_image: any[];
    price: number;
    promo_section?: PromoSection[];
    seo: {
        meta_title: string;
        meta_description: string;
        keywords: string;
        enable_search_indexing: boolean;
    };
    tags: any[];
    locale: string;
    uid: string;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
    ACL: Record<string, any>;
    _version: number;
    _in_progress: boolean;
}

interface PromoText {
    title?: string;
    promo_description?: string;
    _metadata?: {
        uid: string;
    };
}

interface PromoSection {
    promo_text?: PromoText;
}

