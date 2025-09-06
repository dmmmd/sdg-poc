import {CompanyGoalImpact} from "./CompanyGoalImpact";
import {ProductImpact} from "../product/ProductImpact";

export const companyGoalImpactResolvers = {
    CompanyGoalImpact: {
        company: (impact: CompanyGoalImpact): string => impact.companyId,

        goal: (impact: CompanyGoalImpact): string => impact.goalId,

        impact: async (impact: CompanyGoalImpact): Promise<number> => {
            const value = await impact.getImpact();
            return Math.round(value);
        },

        factors: (impact: CompanyGoalImpact): Promise<ProductImpact[]> => impact.getFactors(),
    },
};