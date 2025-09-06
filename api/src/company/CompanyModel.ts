import {AbstractModel, bindModelToDatabase} from "../model/AbstractModel";
import {STORAGE_COMPANIES} from "../storage/storageFeatures";

export const ID = 'id';
export const NAME = 'name';
export const SEARCHABLE_NAME = 'searchableName';
export const SECTOR = 'sector';
export const CREATED_AT = 'createdAt';

export class CompanyModel extends AbstractModel {
    readonly id!: string;
    public name!: string;
    public searchableName!: string;
    public sector!: string;
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
                [SECTOR]: { type: 'string', minLength: 1, maxLength: 255 },
            },
        };
    }
}

bindModelToDatabase(CompanyModel, STORAGE_COMPANIES);