import {AlignmentLevel} from '../goal/alignmentLevels';

export interface ProductAlignment {
    goalId: string;
    productId: string;
    alignment: AlignmentLevel;
}

abstract class AbstractCalculatedProductAlignment implements ProductAlignment {
    constructor(
        public readonly goalId: string,
        public readonly productId: string,
        public readonly alignment: AlignmentLevel,
    ) {
    }
}

export class DirectProductAlignment extends AbstractCalculatedProductAlignment implements ProductAlignment {
}

export class ViaProductAlignment extends AbstractCalculatedProductAlignment implements ProductAlignment {
    constructor(
        goalId: string,
        productId: string,
        alignment: AlignmentLevel,
        public readonly viaProductId: string,
    ) {
        super(goalId, productId, alignment);
    }
}

export const createDirectProductAlignment = (
    goalId: string,
    productId: string,
    alignment: AlignmentLevel,
): ProductAlignment => {
    return new DirectProductAlignment(goalId, productId, alignment);
};

export const createViaProductAlignment = (
    goalId: string,
    productId: string,
    viaProductId: string,
    alignment: AlignmentLevel,
): ProductAlignment => {
    return new ViaProductAlignment(goalId, productId, alignment, viaProductId);
};