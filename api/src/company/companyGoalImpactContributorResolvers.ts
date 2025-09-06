import {goalImpactContributorPropertyResolvers} from "../goal/goalImpactContributorResolvers";
import {CompanyGoalImpactContributor} from "./CompanyGoalImpactContributor";
import {ProductImpact} from "../product/ProductImpact";
import {getCompanyGoalImpacts} from "./getCompanyGoalImpacts";

export const companyGoalImpactContributorResolvers = {
    CompanyGoalImpactContributor: {
        ...goalImpactContributorPropertyResolvers,

        company: (contributor: CompanyGoalImpactContributor): string => contributor.companyId,

        factors: async (contributor: CompanyGoalImpactContributor): Promise<ProductImpact[]> => {
            const impacts = await getCompanyGoalImpacts(contributor.companyId, contributor.goalId);
            const factors = await Promise.all(impacts.map(impact => impact.getFactors()));
            return factors.flat();
        }
    }
};