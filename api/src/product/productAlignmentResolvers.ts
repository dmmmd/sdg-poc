import {AlignmentLevel} from '../goal/alignmentLevels';
import {DirectProductAlignment, ProductAlignment, ViaProductAlignment} from './ProductAlignment';

const productAlignmentPropertyResolvers = {
    goal: (alignment: ProductAlignment): string => alignment.goalId,

    product: (alignment: ProductAlignment): string => alignment.productId,

    alignment: (alignment: ProductAlignment): string => {
        const level = alignment.alignment;
        switch (level) {
            case AlignmentLevel.STRONG_POSITIVE:
                return 'STRONG_POSITIVE';
            case AlignmentLevel.POSITIVE:
                return 'POSITIVE';
            case AlignmentLevel.NEGATIVE:
                return 'NEGATIVE';
            case AlignmentLevel.STRONG_NEGATIVE:
                return 'STRONG_NEGATIVE';
            default:
                throw new Error(`Unsupported alignment level: ${level}`);
        }
    },
};

export const productAlignmentResolvers = {
    ProductAlignment: {
        __resolveType(alignment: ProductAlignment): string {
            if (alignment instanceof DirectProductAlignment) {
                return 'DirectProductAlignment';
            } else if (alignment instanceof ViaProductAlignment) {
                return 'ViaProductAlignment';
            }

            throw new Error(`Unsupported ProductAlignment type: ${alignment}`);
        },
    },

    DirectProductAlignment: {
        ...productAlignmentPropertyResolvers,
    },

    ViaProductAlignment: {
        ...productAlignmentPropertyResolvers,
        viaProduct: (alignment: ViaProductAlignment): string => alignment.viaProductId,
    },
};