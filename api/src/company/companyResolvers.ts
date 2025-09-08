import {ApolloServerValidationErrorCode} from '@apollo/server/errors';
import {GraphQLError} from 'graphql/error';
import {loadModelProperty} from '../graphql/modelPropertyResolver';
import {CompanyGoalImpact} from './CompanyGoalImpact';
import {findCompany, loadCompany, loadCompanyIdsByPage} from './companyLoaders';
import {CompanyModel, NAME, SECTOR} from './CompanyModel';
import {loadCompanyProductIds} from './companyProductLinkLoaders';
import {getCompanyGoalImpacts} from './getCompanyGoalImpacts';

export const companyResolvers = {
    Company: {
        id: (id: string): string => id,

        name: (id: string): Promise<string> => loadModelProperty(id, NAME, loadCompany),

        sector: (id: string): Promise<string> => loadModelProperty(id, SECTOR, loadCompany),

        products: (companyId: string): Promise<string[]> => loadCompanyProductIds(companyId),

        goalImpacts: (companyId: string): Promise<CompanyGoalImpact[]> => getCompanyGoalImpacts(companyId),
    },

    Query: {
        listCompanies: (_: any, {page}: {page: number}): Promise<string[]> => {
            return loadCompanyIdsByPage(page);
        },

        getCompany: async (_: any, {id}: {id: string}): Promise<string|undefined> => {
            const company = await loadCompany(id);
            return company?.id;
        },

        findCompanies: (_: any, {partialName}: {partialName: string}): Promise<string[]> => {
            // @todo move the validation
            if (partialName.trim().length < 3 || partialName.includes('%') || partialName.includes('_')) {
                // @todo the search API is made for fun, so I won't be properly escaping the magic characters
                // It's good enough for PoC to just throw here
                throw new GraphQLError(`Search term must be at least 3 characters long, and must not have special characters`, {extensions: {code: ApolloServerValidationErrorCode}});
            }

            return findCompany(partialName);
        },
    },
};