export interface ProductDTO {
    items: ProductDTOItem[];
    search_criteria: SearchCriteria;
    total_count: number;
}

export interface ProductDTOItem {
    id: number;
    sku: string;
    name: string;
    attribute_set_id: number;
    price: number;
    status: number;
    visibility: number;
    type_id: string;
    created_at: string;
    updated_at: string;
    weight: number;
    extension_attributes: ExtensionAttributes;
    product_links: any[];
    options: any[];
    media_gallery_entries: MediaGalleryEntry[];
    tier_prices: any[];
    custom_attributes: CustomAttribute[];
}

export type ProductVariantDetailsDTO = {
    id: number
    name: string
    price: number
    description: string
    sku: string
    custom_attributes?: CustomAttribute[]
    media_gallery_entries?: MediaGalleryEntry[]
}

export type ProductDetailsDTO = {
    sku: string
    extension_attributes?: ExtensionAttributesDetails
}


type ExtensionAttributesDetails = {
    configurable_product_options: ConfigurableProductOption[]
}

type ConfigurableProductOption = {
    attribute_id: string
    label: string
    values: { value_index: number }[]
}


interface ExtensionAttributes {
    website_ids: number[];
    category_links: CategoryLink[];
}

interface CategoryLink {
    position: number;
    category_id: string;
}

interface MediaGalleryEntry {
    id: number;
    media_type: string;
    label: string;
    position: number;
    disabled: boolean;
    types: string[];
    file: string;
}

interface CustomAttribute {
    attribute_code: string;
    value: string | string[];
}

interface SearchCriteria {
    filter_groups: FilterGroup[];
    sort_orders: SortOrder[];
    page_size: number;
    current_page: number;
}

interface FilterGroup {
    filters: Filter[];
}

interface Filter {
    field: string;
    value: string;
    condition_type: string;
}

interface SortOrder {
    field: string;
    direction: string;
}

