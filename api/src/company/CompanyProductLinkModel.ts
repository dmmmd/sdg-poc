import {AbstractModel, bindModelToDatabase} from "../model/AbstractModel";
import {STORAGE_PRODUCTS} from "../storage/storageFeatures";

export const COMPANY_ID = "companyId";
export const PRODUCT_ID = "productId";
export const CREATED_AT = "createdAt";

export class CompanyProductLinkModel extends AbstractModel {
    readonly companyId!: string;
    readonly productId!: string;
    createdAt!: string;

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
            },
        };
    }
}

bindModelToDatabase(CompanyProductLinkModel, STORAGE_PRODUCTS);
