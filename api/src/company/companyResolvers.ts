import {CompanyModel, NAME, SECTOR} from "./CompanyModel";
import {findCompany, loadCompany, loadCompanyIdsByPage} from "./companyLoaders";
import {loadModelProperty} from "../graphql/modelPropertyResolver";
import {CompanyGoalImpact} from "./CompanyGoalImpact";
import {getCompanyGoalImpacts} from "./getCompanyGoalImpacts";
import {ApolloServerValidationErrorCode} from "@apollo/server/errors";
import {GraphQLError} from "graphql/error";

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

        getCompany: async (_, {id}: {id: string}): Promise<string | null> => {
            const company = await loadCompany(id);
            return company?.id;
        },

        findCompanies: (_, {partialName}: {partialName: string}): Promise<string[]> => {
            // @todo move the validation
            if (partialName.trim().length < 3 || partialName.includes('%') || partialName.includes('_')) {
                // @todo the search API is made for fun, so I won't be properly escaping the magic characters
                // It's good enough for PoC to just throw here
                throw new GraphQLError(`Search term must be at least 3 characters long, and must not have special characters`, {extensions: {code: ApolloServerValidationErrorCode}});
            }

            return findCompany(partialName);
        }
    }
};