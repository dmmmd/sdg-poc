import {AbstractModel, bindModelToDatabase} from "../model/AbstractModel";
import {STORAGE_PRODUCTS} from "../storage/storageFeatures";

export const COMPANY_ID = "companyId";
export const PRODUCT_ID = "productId";
export const REVENUE_SHARE = "revenueShare";

export class CompanyProductLinkModel extends AbstractModel {
    readonly companyId!: string;
    readonly productId!: string;
    readonly revenueShare!: number;
    readonly createdAt!: string;

    static get tableName(): string {
        return "company_products";
    }

    static get idColumn(): string[] {
        return [COMPANY_ID, PRODUCT_ID];
    }

    get id(): [string, string] {
        return this.$id();
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: [COMPANY_ID, PRODUCT_ID],
            properties: {
                [COMPANY_ID]: {type: "string", format: "uuid"},
                [PRODUCT_ID]: {type: "string", format: "uuid"},
                [REVENUE_SHARE]: {type: "number", minimum: 0, maximum: 1},
            },
        };
    }
}

bindModelToDatabase(CompanyProductLinkModel, STORAGE_PRODUCTS);
