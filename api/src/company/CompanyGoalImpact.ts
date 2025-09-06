import {createImpactCalculator} from "../goal/impactCalculator";
import {ProductImpactFactor} from "../product/ProductImpactFactor";

export interface CompanyGoalImpact {
    companyId: string;
    goalId: string;
    getImpact(): Promise<number>;
    getFactors(): Promise<ProductImpactFactor[]>;
}

export class CalculatedCompanyGoalImpact implements CompanyGoalImpact {
    private impact: number;
    private factors: ProductImpactFactor[] = [];

    constructor(
        public readonly companyId: string,
        public readonly goalId: string,
    ) {}

    public async getFactors(): Promise<ProductImpactFactor[]> {
        return this.factors;
    }

    public addImpactFactor(factor: ProductImpactFactor): void {
        this.factors.push(factor);
        this.impact = undefined;
    }

    public getImpact(): Promise<number> {
        if (this.impact === undefined) {
            const calculator = createImpactCalculator();
            this.factors.forEach(factor => calculator.addImpactFactor(factor));
            this.impact = calculator.calculateTotalImpact();
        }
        return Promise.resolve(this.impact);
    }
}

export const createCalculatedCompanyGoalImpact = (companyId: string, goalId: string): CalculatedCompanyGoalImpact => {
    return new CalculatedCompanyGoalImpact(companyId, goalId);
}