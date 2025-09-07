import {AbstractModel, bindModelToDatabase} from '../model/AbstractModel';
import {STORAGE_GOALS} from '../storage/storageFeatures';

export const GOAL_ID = 'goalId';
export const SECTOR = 'sector';
export const COMPANY_ID = 'companyId';
export const IMPACT = 'impact';

export class GoalImpactRecordModel extends AbstractModel {
    readonly goalId!: string;
    readonly sector!: string;
    readonly companyId!: string;
    readonly impact!: number;

    static get tableName(): string {
        return 'goal_impact_records';
    }

    static get idColumn(): string[] {
        return [GOAL_ID, SECTOR, COMPANY_ID];
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: [GOAL_ID, SECTOR, COMPANY_ID, IMPACT],
            properties: {
                [GOAL_ID]: {type: 'string', format: 'uuid'},
                [SECTOR]: {type: 'string'},
                [COMPANY_ID]: {type: 'string', format: 'uuid'},
                [IMPACT]: {type: 'number'},
            },
        };
    }

    get id(): [string, string] {
        return this.$id();
    }
}

bindModelToDatabase(GoalImpactRecordModel, STORAGE_GOALS);
