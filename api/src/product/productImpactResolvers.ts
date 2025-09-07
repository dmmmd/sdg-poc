import {ProductAlignment} from './ProductAlignment';
import {ProductImpact} from './ProductImpact';

export const productImpactResolvers = {
    ProductImpact: {
        alignment: (impact: ProductImpact): ProductAlignment => impact.alignment,

        impact: (impact: ProductImpact): number => Math.round(impact.impact),
    },
};