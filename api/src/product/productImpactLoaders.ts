import {createLoader} from '../loader/loaderFactory';
import {
    ALIGNMENT,
    GOAL_ID,
    InheritedProductAlignmentModel,
    PRODUCT_ID,
    VIA_PRODUCT_ID,
} from './InheritedProductAlignmentModel';
import {createDirectProductAlignment, createViaProductAlignment, ProductAlignment} from './ProductAlignment';

const productImpactsLoader = createLoader(async (productGoalTuples: [string, string|undefined][]) => {
    const productIds: string[] = [], tuples: [string, string][] = [];
    for (const [productId, goalId] of productGoalTuples) {
        goalId
            ? tuples.push([productId, goalId])
            : productIds.push(productId);
    }

    const queryBuilder = InheritedProductAlignmentModel.query()
        .select(PRODUCT_ID, GOAL_ID, ALIGNMENT, VIA_PRODUCT_ID)
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
            ? createViaProductAlignment(row.goalId, row.productId, row.viaProductId, row.alignment)
            : createDirectProductAlignment(row.goalId, row.productId, row.alignment);
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

export const loadProductImpacts = (productId: string,
                                   goalId: string|undefined = undefined): Promise<ProductAlignment[]> => {
    return productImpactsLoader.load([productId, goalId]);
};