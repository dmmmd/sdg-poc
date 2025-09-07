import {AlignmentLevel, validAlignmentLevels} from '../goal/alignmentLevels';
import {AbstractModel, bindModelToDatabase} from '../model/AbstractModel';
import {STORAGE_PRODUCTS} from '../storage/storageFeatures';

export const PRODUCT_ID = 'productId';
export const GOAL_ID = 'goalId';
export const ALIGNMENT = 'alignment';
export const VIA_PRODUCT_ID = 'viaProductId';

export class InheritedProductAlignmentModel extends AbstractModel {
    readonly productId!: string;
    readonly goalId!: string;
    readonly alignment!: AlignmentLevel;
    readonly viaProductId: string|null;

    static get tableName(): string {
        return 'inherited_product_alignment_records';
    }

    static get idColumn(): string[] {
        return [PRODUCT_ID, GOAL_ID];
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: [PRODUCT_ID, GOAL_ID, ALIGNMENT, VIA_PRODUCT_ID],
            properties: {
                [PRODUCT_ID]: {type: 'string', format: 'uuid'},
                [GOAL_ID]: {type: 'string', format: 'uuid'},
                [ALIGNMENT]: {type: 'string', enum: validAlignmentLevels},
                [VIA_PRODUCT_ID]: {
                    anyOf: [
                        {type: 'string', format: 'uuid'},
                        {type: 'null'},
                    ],
                },
            },
        };
    }

    get id(): [string, string] {
        return this.$id();
    }
}

bindModelToDatabase(InheritedProductAlignmentModel, STORAGE_PRODUCTS);
