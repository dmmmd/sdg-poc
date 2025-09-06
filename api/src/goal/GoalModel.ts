import {AbstractModel, bindModelToDatabase} from "../model/AbstractModel";
import {STORAGE_GOALS} from "../storage/storageFeatures";

export const ID = "id";
export const NAME = "name";
export const DESCRIPTION = "description";
export const CREATED_AT = "createdAt";

export class GoalModel extends AbstractModel {
    id!: string;
    name!: string;
    description: string|null = null;
    createdAt!: string;

    static get tableName(): string {
        return "goals";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: [NAME],
            properties: {
                [ID]: {type: "string", format: "uuid"},
                [NAME]: {type: "string", minLength: 3, maxLength: 255},
                // description can be null or string
                [DESCRIPTION]: {type: ["string", "null"]},
            },
        };
    }
}

bindModelToDatabase(GoalModel, STORAGE_GOALS);
