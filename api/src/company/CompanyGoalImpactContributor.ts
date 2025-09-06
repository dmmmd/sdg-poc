import {GoalImpactContributor} from "../goal/GoalImpactContributor";

export class CompanyGoalImpactContributor implements GoalImpactContributor {
    constructor(
        public readonly goalId: string,
        public readonly impact: number,
        public readonly companyId: string,
    ) {}
}

export const createCompanyGoalImpactContributor = (
    goalId: string,
    impact: number,
    companyId: string,
): CompanyGoalImpactContributor => {
    return new CompanyGoalImpactContributor(goalId, impact, companyId);
};