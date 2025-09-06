import {AbstractModel, bindModelToDatabase} from "../model/AbstractModel";
import {STORAGE_GOALS} from "../storage/storageFeatures";
import {ImpactLevel, validImpactLevels} from "./impactLevels";

export const GOAL_ID = "goalId";
export const SECTOR = "sector";
export const COMPANY_ID = "companyId";
export const IMPACT = "impact";
export const FACTOR = "factor";

export class GoalImpactRecordModel extends AbstractModel {
    readonly goalId!: string;
    readonly sector!: string;
    readonly companyId!: string;
    readonly impact!: ImpactLevel;
    readonly factor!: number;

    static get tableName(): string {
        return "goal_impact_records";
    }

    static get idColumn(): string[] {
        return [GOAL_ID, SECTOR, COMPANY_ID];
    }

    get id(): [string, string] {
        return this.$id();
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: [GOAL_ID, SECTOR, COMPANY_ID, IMPACT, FACTOR],
            properties: {
                [GOAL_ID]: {type: "string", format: "uuid"},
                [SECTOR]: {type: "string"},
                [COMPANY_ID]: {type: "string", format: "uuid"},
                [IMPACT]: {type: "string", enum: validImpactLevels},
                [FACTOR]: {type: "number"},
            },
        };
    }
}

bindModelToDatabase(GoalImpactRecordModel, STORAGE_GOALS);
