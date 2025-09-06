import {CompanyModel, NAME, SECTOR} from "./CompanyModel";
import {findCompany, loadCompany, loadCompanyIdsByPage} from "./companyLoaders";
import {loadModelProperty} from "../graphql/modelPropertyResolver";
import {CalculatedCompanyGoalImpact, CompanyGoalImpact, createCalculatedCompanyGoalImpact} from "./CompanyGoalImpact";
import {loadCompanyProductIds} from "./companyProductLinkLoaders";
import {loadProductImpacts} from "../product/productImpactLoaders";

export const companyResolvers = {
    Company: {
        id: (id: string): string => id,
        name: (id: string): Promise<string> => loadModelProperty<CompanyModel, string>(id, NAME, loadCompany),
        sector: (id: string): Promise<string> => loadModelProperty<CompanyModel, string>(id, SECTOR, loadCompany),
        goalImpacts: async (companyId: string): Promise<CompanyGoalImpact[]> => {
            const goalImpacts: Map<string, CalculatedCompanyGoalImpact> = new Map();

            const productIds = await loadCompanyProductIds(companyId);
            await Promise.all(productIds.map(async productId => {
                const impacts = await loadProductImpacts(productId);
                impacts.forEach(impact => {
                    const goalId = impact.goalId;
                    if (!goalImpacts.has(goalId)) {
                        goalImpacts.set(impact.goalId, createCalculatedCompanyGoalImpact(companyId, impact.goalId));
                    }

                    goalImpacts.get(goalId).addFactor(impact);
                });
            }));

            return [...goalImpacts.values()];
        },
    },

    Query: {
        listCompanies: (_, {page}: {page: number}): Promise<string[]> => {
            return loadCompanyIdsByPage(page);
        },

        findCompanies: (_, {partialName}: {partialName: string}): Promise<string[]> => {
            // @todo move the validation
            if (partialName.length < 3 || partialName.includes('%') || partialName.includes('_')) {
                // @todo proper client error or validation by spec
                return Promise.resolve([]);
            }

            return findCompany(partialName);
        }
    }
};