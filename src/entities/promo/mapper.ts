import { ContentStackResponse } from "./dto";
import { Promo, PromoResult } from './types';

export function mapContentStackPromos(
    contentStackData: ContentStackResponse,
    skuId: string
): PromoResult {
    const matchingEntries = contentStackData.entries.filter(
        (entry) => entry.commercetools_id === skuId
    );

    if (matchingEntries.length === 0) {
        return { sku: skuId, promos: [] };
    }

    const promos: Promo[] = matchingEntries.flatMap((entry, entryIndex) => {
        if (!entry.promo_section || !Array.isArray(entry.promo_section)) {
            return [];
        }
        return entry.promo_section.map((section, sectionIndex) => {
            const order = entryIndex + sectionIndex;
            const url = entry.featured_image.length > 0 ? entry.featured_image[0].url : "";
            const promoText = section.promo_text || {};
            const title = promoText.title || "Promo";
            const description = promoText.promo_description || "";

            const text = `<div class="p-4 my-2 flex h-[300px] shadow rounded-xl">
                        <div class="flex-grow">
                          <h2 class="text-2xl font-serif">${title}</h2>
                          <p>${description}</p>
                        </div>
                        <div>
                          <img src="${url}" 
                            class="h-[100%] rounded-xl"
                          />
                        </div>
                      </div>`;

            return {
                text,
                order
            };
        });
    });

    promos.sort((a, b) => a.order - b.order);

    return {
        sku: skuId,
        promos
    };
}
export { ContentStackResponse };

