import {ImpactLevel} from "../goal/impactLevels";

export interface ProductImpact {
    goalId: string;
    productId: string;
    impactLevel: ImpactLevel;
}

abstract class AbstractCalculatedProductImpact implements ProductImpact {
    constructor(
        public readonly goalId: string,
        public readonly productId: string,
        public readonly impactLevel: ImpactLevel,
    ) {}
}

export class DirectProductImpact extends AbstractCalculatedProductImpact implements ProductImpact {
}

export class ViaProductImpact extends AbstractCalculatedProductImpact implements ProductImpact {
    constructor(
        goalId: string,
        productId: string,
        impactLevel: ImpactLevel,
        public readonly viaProductId: string,
    ) {
        super(goalId, productId, impactLevel);
    }
}

export const createDirectProductImpact = (
    goalId: string,
    productId: string,
    impactLevel: ImpactLevel,
): ProductImpact => {
    return new DirectProductImpact(goalId, productId, impactLevel);
};

export const  createViaProductImpact = (
    goalId: string,
    productId: string,
    viaProductId: string,
    impactLevel: ImpactLevel,
): ProductImpact => {
    return new ViaProductImpact(goalId, productId, impactLevel, viaProductId);
};