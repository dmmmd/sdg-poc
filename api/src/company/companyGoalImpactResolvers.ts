import {CompanyGoalImpact} from "./CompanyGoalImpact";
import {ProductImpact} from "../product/ProductImpact";

export const companyGoalImpactResolvers = {
    CompanyGoalImpact: {
        company: (impact: CompanyGoalImpact): string => impact.companyId,
        goal: (impact: CompanyGoalImpact): string => impact.goalId,
        impact: (impact: CompanyGoalImpact): Promise<number> => impact.getImpact(),
        factors: (impact: CompanyGoalImpact): Promise<ProductImpact[]> => impact.getFactors(),
    },
};