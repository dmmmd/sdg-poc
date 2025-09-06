import {ImpactLevel} from "./impactLevels";
import {logError} from "../logger/loggerFacade";

class ImpactCalculator {
    private levels: Map<ImpactLevel, number> = new Map();

    public addImpactLevel(level: ImpactLevel): void {
        const amount = this.levels.get(level) || 0;
        this.levels.set(level, amount + 1);
    }

    public calculateTotalImpact(): number {
        let total = 0;
        for (const [level, amount] of this.levels.entries()) {
            switch (level) {
                case ImpactLevel.STRONG_POSITIVE:
                    total += amount * 90;
                    break;
                case ImpactLevel.POSITIVE:
                    total += amount * 9;
                    break;
                case ImpactLevel.NEGATIVE:
                    total -= amount * 10;
                    break;
                case ImpactLevel.STRONG_NEGATIVE:
                    total -= amount * 100;
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