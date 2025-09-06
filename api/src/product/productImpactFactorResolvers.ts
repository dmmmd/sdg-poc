import {ProductImpact} from "./ProductImpact";
import {ProductImpactFactor} from "./ProductImpactFactor";

export const productImpactFactorResolvers = {
    ProductImpactFactor: {
        impact: (factor: ProductImpactFactor): ProductImpact => factor.impact,
        factor: (factor: ProductImpactFactor): number => Math.round(factor.factor),
    },
};