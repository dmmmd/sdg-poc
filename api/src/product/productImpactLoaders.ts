import {createLoader} from "../loader/loaderFactory";
import {createDirectProductImpact, createViaProductImpact, ProductImpact} from "./ProductImpact";
import {InheritedProductImpactModel, PRODUCT_ID, GOAL_ID, IMPACT, VIA_PRODUCT_ID} from "./InheritedProductImpactModel";

const productImpactsLoader = createLoader(async (productGoalTuples: [string, string|undefined][]) => {
    const productIds: string[] = [], tuples: [string, string][] = [];
    for (const [productId, goalId] of productGoalTuples) {
        goalId
            ? tuples.push([productId, goalId])
            : productIds.push(productId);
    }

    const queryBuilder = InheritedProductImpactModel.query()
        .select(PRODUCT_ID, GOAL_ID, IMPACT, VIA_PRODUCT_ID)
        .where(true);

    if (tuples.length) {
        queryBuilder.orWhereIn([PRODUCT_ID, GOAL_ID], tuples);
    }
    if (productIds.length) {
        queryBuilder.orWhereIn(PRODUCT_ID, productIds);
    }

    const rows = await queryBuilder.execute();
    const impacts = rows.map(row => {
        return row.viaProductId
            ? createViaProductImpact(row.goalId, row.productId, row.viaProductId, row.impact)
            : createDirectProductImpact(row.goalId, row.productId, row.impact);
    });

    return productGoalTuples.map(([productId, goalId]) => {
        return impacts.filter(impact => {
            return impact.productId === productId
                && (undefined === goalId || impact.goalId === goalId);
        });
    });
}, {
    cacheSize: 1000,
});

export const loadProductImpacts = (productId: string, goalId: string|undefined = undefined): Promise<ProductImpact[]> => {
    return productImpactsLoader.load([productId, goalId]);
};