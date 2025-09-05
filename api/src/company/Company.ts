import {AbstractModel, bindModelToDatabase} from "../model/AbstractModel";
import {STORAGE_COMPANIES} from "../storage/storageFeatures";

export class Company extends AbstractModel {
    id!: number;
    name!: string;
    created_at!: Date;
    updated_at!: Date;

    static get tableName() {
        return 'companies';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name'],
            properties: {
                id: { type: 'integer' },
                name: { type: 'string', minLength: 1, maxLength: 255 },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: 'string', format: 'date-time' },
            },
        };
    }
}

bindModelToDatabase(Company, STORAGE_COMPANIES);