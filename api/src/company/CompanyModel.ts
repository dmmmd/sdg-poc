import {AbstractModel, bindModelToDatabase} from "../model/AbstractModel";
import {STORAGE_COMPANIES} from "../storage/storageFeatures";

export const ID = 'id';
export const NAME = 'name';
export const SEARCHABLE_NAME = 'searchableName';
export const SECTOR = 'sector';
export const REVENUE_EUR_THOUSANDS = 'revenueEURThousands';

export class CompanyModel extends AbstractModel {
    readonly id!: string;
    readonly name!: string;
    readonly searchableName!: string;
    readonly sector!: string;
    readonly revenueEURThousands!: number;
    readonly createdAt!: Date;

    static get tableName() {
        return 'companies';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: [NAME, SECTOR],
            properties: {
                [ID]: { type: 'string', format: 'uuid' },
                [NAME]: { type: 'string', minLength: 1, maxLength: 255 },
                [SECTOR]: { type: 'string', maxLength: 255 },
                [REVENUE_EUR_THOUSANDS]: { type: 'integer', minimum: 0 },
            },
        };
    }
}

bindModelToDatabase(CompanyModel, STORAGE_COMPANIES);