import {ProductImpact} from "./ProductImpact";

export interface ProductImpactFactor {
    impact: ProductImpact;
    factor: number;
}

class CalculatedProductImpactFactor implements ProductImpactFactor {
    constructor(
        public readonly impact: ProductImpact,
        public readonly factor: number,
    ) {}
}

export const createCalculatedProductImpactFactor = (impact: ProductImpact, factor: number): ProductImpactFactor => {
    return new CalculatedProductImpactFactor(impact, factor);
};