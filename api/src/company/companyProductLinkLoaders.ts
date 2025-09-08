import {createLoader} from '../loader/loaderFactory';
import {CompanyProductLink, createCompanyProductLink} from './CompanyProductLink';
import {COMPANY_ID, CompanyProductLinkModel, PRODUCT_ID, REVENUE_SHARE} from './CompanyProductLinkModel';

const companyProductLinksLoader = createLoader(async (companyIds: readonly string[]): Promise<CompanyProductLink[][]> => {
    const rows = await CompanyProductLinkModel.query()
        .select(COMPANY_ID, PRODUCT_ID, REVENUE_SHARE)
        .whereIn(COMPANY_ID, companyIds)
        .execute();

    return companyIds.map(id => rows
        .filter(row => row.companyId === id)
        .map(row => createCompanyProductLink(row.companyId, row.productId, row.revenueShare)),
    );
}, {
    cacheSize: 1000,
});

export const loadCompanyProductLinks = (companyId: string): Promise<CompanyProductLink[]> => {
    return companyProductLinksLoader.load(companyId);
};

export const loadCompanyProductIds = async (companyId: string): Promise<string[]> => {
    const links = await loadCompanyProductLinks(companyId);
    return links.map(link => link.productId);
};
