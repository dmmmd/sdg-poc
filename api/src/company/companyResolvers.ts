import {CompanyModel, NAME, SECTOR} from "./CompanyModel";
import {findCompany, loadCompany, loadCompanyIdsByPage} from "./companyLoaders";
import {loadModelProperty} from "../graphql/modelPropertyResolver";
import {CompanyGoalImpact} from "./CompanyGoalImpact";
import {getCompanyGoalImpacts} from "./getCompanyGoalImpacts";

export const companyResolvers = {
    Company: {
        id: (id: string): string => id,
        name: (id: string): Promise<string> => loadModelProperty<CompanyModel, string>(id, NAME, loadCompany),
        sector: (id: string): Promise<string> => loadModelProperty<CompanyModel, string>(id, SECTOR, loadCompany),
        goalImpacts: (companyId: string): Promise<CompanyGoalImpact[]> => getCompanyGoalImpacts(companyId),
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