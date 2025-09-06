import {DirectProductImpact, ProductImpact, ViaProductImpact} from "./ProductImpact";
import {ImpactLevel} from "../goal/impactLevels";

const productImpactPropertyResolvers = {
    goal: (impact: ProductImpact): string => impact.goalId,
    product: (impact: ProductImpact): string => impact.productId,
    impactLevel: (impact: ProductImpact): string => {
        const level = impact.impactLevel;
        switch (impact.impactLevel) {
            case ImpactLevel.STRONG_POSITIVE:
                return 'STRONG_POSITIVE';
            case ImpactLevel.POSITIVE:
                return 'POSITIVE';
            case ImpactLevel.NEGATIVE:
                return 'NEGATIVE';
            case ImpactLevel.STRONG_NEGATIVE:
                return 'STRONG_NEGATIVE';
            default:
                throw new Error(`Unsupported impact level: ${level}`);
        }
    },
}

export const productImpactResolvers = {
    ProductImpact: {
        __resolveType(impact: ProductImpact): string {
            if (impact instanceof DirectProductImpact) {
                return "DirectProductImpact";
            } else if (impact instanceof ViaProductImpact) {
                return "ViaProductImpact";
            }

            throw new Error(`Unsupported ProductImpact type: ${impact}`);
        },
    },

    DirectProductImpact: {
        ...productImpactPropertyResolvers,
    },

    ViaProductImpact: {
        ...productImpactPropertyResolvers,
        viaProduct: (impact: ViaProductImpact): string => impact.viaProductId,
    },
};