import {AbstractModel, bindModelToDatabase} from "../model/AbstractModel";
import {STORAGE_PRODUCTS} from "../storage/storageFeatures";
import {ImpactLevel, validImpactLevels} from "../goal/impactLevels";

export const PRODUCT_ID = "productId";
export const GOAL_ID = "goalId";
export const IMPACT = "impact";
export const CREATED_AT = "createdAt";

export class ProductImpactModel extends AbstractModel {
    readonly productId!: string;
    readonly goalId!: string;
    readonly impact!: ImpactLevel;
    readonly createdAt!: string;

    static get tableName(): string {
        return "product_impact_records";
    }

    static get idColumn(): string[] {
        return [PRODUCT_ID, GOAL_ID];
    }

    get id(): [string, string] {
        return this.$id();
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: [PRODUCT_ID, GOAL_ID, IMPACT],
            properties: {
                [PRODUCT_ID]: {type: "string", format: "uuid"},
                [GOAL_ID]: {type: "string", format: "uuid"},
                [IMPACT]: {type: "string", enum: validImpactLevels},
            },
        };
    }
}

bindModelToDatabase(ProductImpactModel, STORAGE_PRODUCTS);
