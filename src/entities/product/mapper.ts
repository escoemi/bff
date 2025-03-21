import dotenv from 'dotenv';
import { Product, ProductDetails } from "./types";
import { Variant } from "../types";
import { ProductDetailsDTO, ProductDTOItem, ProductVariantDetailsDTO } from "./dto";
dotenv.config();

export const mapProductDtoItemToProduct = (item: ProductDTOItem): Product => {
    const customAttributes = item.custom_attributes.reduce((acc: Record<string, any>, attr) => {
        acc[attr.attribute_code] = attr.value;
        return acc;
    }, {} as Record<string, any>);

    const description: string = customAttributes['description'] || '';
    const urlKey: string = customAttributes['url_key'] || '';

    const variant: Variant = {
        id: item.id.toString(),
        sku: item.sku,
        name: item.name,
        prices: [{
            value: {
                currencyCode: "USD",
                centAmount: item.price * 100,
            }
        }],
        images: item.media_gallery_entries.map(entry => ({ url: `${process.env.MAGENTO_URL_MEDIA}/${entry.file}` })),
        attributes: [...item.custom_attributes.map(attr => ({
            name: attr.attribute_code,
            value: { key: String(attr.value), label: String(attr.value) },
        })), {
            name: "Color",
            value: {
                label: "blue",
                key: "blue"
            }
        },
        {
            name: "Size",
            value: {
                label: "XL",
                key: "XL"
            }
        }],
        slug: urlKey,
    };

    return {
        id: item.id.toString(),
        name: item.name,
        description: description,
        slug: urlKey,
        variants: [variant],
        masterVariant: variant,
    };
};

export const mapMagentoProductDetails = (productVariantDetails: ProductVariantDetailsDTO, productDetails: ProductDetailsDTO): ProductDetails => {
    const sizesOption = productDetails.extension_attributes?.configurable_product_options.find(attr => attr.attribute_id === '144')
    const colorsOption = productDetails.extension_attributes?.configurable_product_options.find(attr => attr.attribute_id === '93')

    return {
        id: productVariantDetails.id,
        name: productVariantDetails.name,
        description: (productVariantDetails.custom_attributes?.find(attr => attr.attribute_code === 'description')?.value || "") as string,
        price: productVariantDetails.price,
        sku: productVariantDetails.sku,
        code: productDetails.sku,
        size: (productVariantDetails.custom_attributes?.find(attr => attr.attribute_code === 'size')?.value || '') as string,
        color: (productVariantDetails.custom_attributes?.find(attr => attr.attribute_code === 'color')?.value || '') as string,
        images: productVariantDetails.media_gallery_entries?.reduce((acc, entry) => {
            if (entry.media_type === 'image' && entry.file) {
                acc.push(process.env.MAGENTO_URL_MEDIA + "/" + entry.file)

                return acc
            }

            return acc
        }, [] as string[]) || [],
        //@ts-ignore
        masterVariant: {
            id: productVariantDetails.id,
            name: productVariantDetails.name,
            description: (productVariantDetails.custom_attributes?.find(attr => attr.attribute_code === 'description')?.value || "") as string,
            price: productVariantDetails.price,
            sku: productVariantDetails.sku,
            code: productDetails.sku,
            size: (productVariantDetails.custom_attributes?.find(attr => attr.attribute_code === 'size')?.value || '') as string,
            color: (productVariantDetails.custom_attributes?.find(attr => attr.attribute_code === 'color')?.value || '') as string,
            attributes: [...productVariantDetails?.custom_attributes?.map(attr => ({
                name: attr.attribute_code,
                value: { key: String(attr.value), label: String(attr.value) },
            })) || [], {
                name: "Color",
                value: {
                    label: "blue",
                    key: "blue"
                }
            },
            {
                name: "Size",
                value: {
                    label: "XL",
                    key: "XL"
                }
            }],
            images: productVariantDetails.media_gallery_entries?.reduce((acc, entry) => {
                if (entry.media_type === 'image' && entry.file) {
                    acc.push({ url: `${process.env.MAGENTO_URL_MEDIA}/${entry.file}` })

                    return acc
                }

                return acc
            }, [] as { url: string }[]) || [],
        },
        sizes: sizesOption ? sizesOption.values.map(val => val.value_index) : [],
        colors: colorsOption ? colorsOption.values.map(val => val.value_index) : [],
    }
}

export const mapDTOtoVariant = (item: ProductVariantDetailsDTO, urlKey?: string): Variant => {
    return {
        id: item?.id?.toString() || "",
        sku: item.sku,
        name: item.name,
        prices: [{
            value: {
                currencyCode: "USD",
                centAmount: item.price * 100,
            }
        }],
        images: item?.media_gallery_entries?.map(entry => ({ url: `${process.env.MAGENTO_URL_MEDIA}/${entry.file}` })) || [],
        attributes: [...item?.custom_attributes?.map(attr => ({
            name: attr.attribute_code,
            value: { key: String(attr.value), label: String(attr.value) },
        })) || [], {
            name: "Color",
            value: {
                label: "blue",
                key: "blue"
            }
        },
        {
            name: "Size",
            value: {
                label: "XL",
                key: "XL"
            }
        }],
        slug: urlKey || "",
    };
}