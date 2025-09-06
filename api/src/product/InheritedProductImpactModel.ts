import {AbstractModel, bindModelToDatabase} from "../model/AbstractModel";
import {STORAGE_PRODUCTS} from "../storage/storageFeatures";
import {ImpactLevel, validImpactLevels} from "../goal/impactLevels";

export const PRODUCT_ID = "productId";
export const GOAL_ID = "goalId";
export const IMPACT = "impact";
export const VIA_PRODUCT_ID = "viaProductId";

export class InheritedProductImpactModel extends AbstractModel {
    readonly productId!: string;
    readonly goalId!: string;
    readonly impact!: ImpactLevel;
    readonly viaProductId: string|null;

    static get tableName(): string {
        return "inherited_product_impact_records";
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
            required: [PRODUCT_ID, GOAL_ID, IMPACT, VIA_PRODUCT_ID],
            properties: {
                [PRODUCT_ID]: {type: "string", format: "uuid"},
                [GOAL_ID]: {type: "string", format: "uuid"},
                [IMPACT]: {type: "string", enum: validImpactLevels},
                [VIA_PRODUCT_ID]: {
                    anyOf: [
                        {type: "string", format: "uuid"},
                        {type: "null"},
                    ],
                },
            },
        };
    }
}

bindModelToDatabase(InheritedProductImpactModel, STORAGE_PRODUCTS);
