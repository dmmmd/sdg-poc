import {AbstractModel, bindModelToDatabase} from '../model/AbstractModel';
import {STORAGE_GOALS} from '../storage/storageFeatures';

export const ID = 'id';
export const NAME = 'name';
export const DESCRIPTION = 'description';

export class GoalModel extends AbstractModel {
    readonly id!: string;
    readonly name!: string;
    readonly description: string|null = null;
    readonly createdAt!: string;

    static get tableName(): string {
        return 'goals';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: [NAME],
            properties: {
                [ID]: {type: 'string', format: 'uuid'},
                [NAME]: {type: 'string', minLength: 3, maxLength: 255},
                [DESCRIPTION]: {type: ['string', 'null']},
            },
        };
    }
}

bindModelToDatabase(GoalModel, STORAGE_GOALS);
