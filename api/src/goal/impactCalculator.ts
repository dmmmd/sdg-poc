import {ImpactLevel} from "./impactLevels";
import {logError} from "../logger/loggerFacade";
import {ProductImpactFactor} from "../product/ProductImpactFactor";

export const IMPACT_POSITIVE_IMBALANCE = 0.9; // It is harder to make a positive impact than a negative one
export const ORDER_OF_MAGNITUDE = 10;
export const STRONG_ORDER_OF_MAGNITUDE = ORDER_OF_MAGNITUDE * 10;

class ImpactCalculator {
    private leveledImpacts: Map<ImpactLevel, number> = new Map();

    public addImpactFactor(factor: ProductImpactFactor): void {
        const level = factor.impact.impactLevel;
        const amount = factor.factor;

        const total = this.leveledImpacts.get(level) || 0;
        this.leveledImpacts.set(level, total + amount);
    }

    public calculateTotalImpact(): number {
        let total = 0;

        for (const [level, amount] of this.leveledImpacts.entries()) {
            switch (level) {
                case ImpactLevel.STRONG_POSITIVE:
                    total += amount * STRONG_ORDER_OF_MAGNITUDE * IMPACT_POSITIVE_IMBALANCE;
                    break;
                case ImpactLevel.POSITIVE:
                    total += amount * ORDER_OF_MAGNITUDE * IMPACT_POSITIVE_IMBALANCE;
                    break;
                case ImpactLevel.NEGATIVE:
                    total -= amount * ORDER_OF_MAGNITUDE;
                    break;
                case ImpactLevel.STRONG_NEGATIVE:
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