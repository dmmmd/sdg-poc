import {createLoader} from "../loader/loaderFactory";
import {CompanyProductLinkModel, COMPANY_ID, PRODUCT_ID} from "./CompanyProductLinkModel";

const companyProductIdsLoader = createLoader(async (companyIds: string[]) => {
    const rows = await CompanyProductLinkModel.query()
        .select(COMPANY_ID, PRODUCT_ID)
        .whereIn(COMPANY_ID, companyIds)
        .execute();

    return companyIds.map(id => rows.filter(row => row.companyId === id).map(row => row.productId));
}, {
    cacheSize: 1000,
});

export const loadCompanyProductIds = (companyId: string): Promise<string[]> => {
    return companyProductIdsLoader.load(companyId);
};