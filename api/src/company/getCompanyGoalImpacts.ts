import {CalculatedCompanyGoalImpact, CompanyGoalImpact, createCalculatedCompanyGoalImpact} from "./CompanyGoalImpact";
import {loadCompanyProductLinks} from "./companyProductLinkLoaders";
import {loadProductImpacts} from "../product/productImpactLoaders";
import {loadCompany} from "./companyLoaders";
import {createCalculatedProductImpact} from "../product/ProductImpact";

export const getCompanyGoalImpacts = async (companyId: string, goalId: string|undefined = undefined): Promise<CompanyGoalImpact[]> => {
    const goalImpacts: Map<string, CalculatedCompanyGoalImpact> = new Map();

    const [company, productLinks] = await Promise.all([
        loadCompany(companyId),
        loadCompanyProductLinks(companyId)
    ]);

    await Promise.all(productLinks.map(async link => {
        const impacts = await loadProductImpacts(link.productId, goalId);
        const productRevenueAmount = company.revenueEURThousands * link.revenueShare;
        impacts.forEach(impact => {
            const goalId = impact.goalId;
            if (!goalImpacts.has(goalId)) {
                goalImpacts.set(impact.goalId, createCalculatedCompanyGoalImpact(companyId, impact.goalId));
            }

            const factor = createCalculatedProductImpact(impact, productRevenueAmount);
            goalImpacts.get(goalId).addImpactFactor(factor);
        });
    }));

    return [...goalImpacts.values()];
};
