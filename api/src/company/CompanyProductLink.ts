export interface CompanyProductLink {
    companyId: string;
    productId: string;
    revenueShare: number;
}

class CompanyProductLinkDto implements CompanyProductLink {
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly revenueShare: number,
        ) {}
}

export const createCompanyProductLink = (
    companyId: string,
    productId: string,
    revenueShare: number,
): CompanyProductLink => {
    return new CompanyProductLinkDto(companyId, productId, revenueShare);
};