import {ProductAlignment} from "./ProductAlignment";

export interface ProductImpact {
    alignment: ProductAlignment;
    impact: number;
}

class CalculatedProductImpact implements ProductImpact {
    constructor(
        public readonly alignment: ProductAlignment,
        public readonly impact: number,
    ) {}
}

export const createCalculatedProductImpact = (alignment: ProductAlignment, impact: number): ProductImpact => {
    return new CalculatedProductImpact(alignment, impact);
};