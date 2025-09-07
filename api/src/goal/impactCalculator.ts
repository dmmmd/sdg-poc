import {logError} from '../logger/loggerFacade';
import {ProductImpact} from '../product/ProductImpact';
import {AlignmentLevel} from './alignmentLevels';

export const IMPACT_POSITIVE_IMBALANCE = 0.9; // It is harder to make a positive impact than a negative one
export const ORDER_OF_MAGNITUDE = 10;
export const STRONG_ORDER_OF_MAGNITUDE = ORDER_OF_MAGNITUDE * 10;

class ImpactCalculator {
    private leveledImpacts: Map<AlignmentLevel, number> = new Map();

    public addImpactFactor(factor: ProductImpact): void {
        const level = factor.alignment.alignment;
        const amount = factor.impact;

        const total = this.leveledImpacts.get(level) || 0;
        this.leveledImpacts.set(level, total + amount);
    }

    public calculateTotalImpact(): number {
        let total = 0;

        for (const [level, amount] of this.leveledImpacts.entries()) {
            switch (level) {
                case AlignmentLevel.STRONG_POSITIVE:
                    total += amount * STRONG_ORDER_OF_MAGNITUDE * IMPACT_POSITIVE_IMBALANCE;
                    break;
                case AlignmentLevel.POSITIVE:
                    total += amount * ORDER_OF_MAGNITUDE * IMPACT_POSITIVE_IMBALANCE;
                    break;
                case AlignmentLevel.NEGATIVE:
                    total -= amount * ORDER_OF_MAGNITUDE;
                    break;
                case AlignmentLevel.STRONG_NEGATIVE:
                    total -= amount * STRONG_ORDER_OF_MAGNITUDE;
                    break;
                default:
                    logError(`ImpactCalculator - ${level} is not supported`);
                    break;
            }
        }
        return total;
    }
}

export const createImpactCalculator = (): ImpactCalculator => {
    return new ImpactCalculator();
};