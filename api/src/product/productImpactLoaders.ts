import {createLoader} from "../loader/loaderFactory";
import {createDirectProductImpact, createViaProductImpact, ProductImpact} from "./ProductImpact";
import {InheritedProductImpactModel, PRODUCT_ID, GOAL_ID, IMPACT, VIA_PRODUCT_ID} from "./InheritedProductImpactModel";

const productImpactsLoader = createLoader(async (productIds: string[]) => {
    const rows = await InheritedProductImpactModel.query()
        .select(PRODUCT_ID, GOAL_ID, IMPACT, VIA_PRODUCT_ID)
        .whereIn(PRODUCT_ID, productIds)
        .execute();

    return productIds.map(productId => {
        const productRows = rows.filter(row => row.productId === productId);
        return productRows.map(row => {
            return row.viaProductId
                ? createViaProductImpact(row.goalId, row.productId, row.viaProductId, row.impact)
                : createDirectProductImpact(row.goalId, row.productId, row.impact);
        });
    });
}, {
    cacheSize: 1000,
});

export const loadProductImpacts = (productId: string): Promise<ProductImpact[]> => {
    return productImpactsLoader.load(productId);
};