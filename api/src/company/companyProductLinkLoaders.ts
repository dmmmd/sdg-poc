import {createLoader} from "../loader/loaderFactory";
import {CompanyProductLinkModel, COMPANY_ID, PRODUCT_ID, REVENUE_SHARE} from "./CompanyProductLinkModel";
import {CompanyProductLink, createCompanyProductLink} from "./CompanyProductLink";

const companyProductLinksLoader = createLoader(async (companyIds: string[]): Promise<CompanyProductLink[][]> => {
    const rows = await CompanyProductLinkModel.query()
        .select(COMPANY_ID, PRODUCT_ID, REVENUE_SHARE)
        .whereIn(COMPANY_ID, companyIds)
        .execute();

    return companyIds.map(id => rows
        .filter(row => row.companyId === id)
        .map(row => createCompanyProductLink(row.companyId, row.productId, row.revenueShare))
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
