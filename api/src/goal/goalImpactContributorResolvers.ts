import {GoalImpactContributor} from "./GoalImpactContributor";
import {CompanyGoalImpactContributor} from "../company/CompanyGoalImpactContributor";

export const goalImpactContributorPropertyResolvers = {
    goal: (contributor: GoalImpactContributor): string => contributor.goalId,

    impact: (contributor: GoalImpactContributor): number => Math.round(contributor.impact),
}

export const goalImpactContributorResolvers = {
    GoalImpactContributor: {
        __resolveType(contributor: GoalImpactContributor): string {
            if (contributor instanceof CompanyGoalImpactContributor) {
                return "CompanyGoalImpactContributor";
            }

            throw new Error(`Unsupported GoalImpactContributor type: ${contributor}`);
        },
    },
};