import {loadModelProperty} from "../graphql/modelPropertyResolver";
import {GoalModel, NAME, DESCRIPTION} from "./GoalModel";
import {loadGoal, loadGoalIds} from "./goalLoaders";
import {CompanyGoalImpactContributor} from "../company/CompanyGoalImpactContributor";
import {ImpactDirection} from "./ImpactDirection";
import {loadCompanyGoalContributors} from "./goalImpactRecordLoaders";

export const goalResolvers = {
    Goal: {
        id: (id: string): string => id,

        name: (id: string): Promise<string> => loadModelProperty<GoalModel, string>(id, NAME, loadGoal),

        description: (id: string): Promise<string> => loadModelProperty<GoalModel, string>(id, DESCRIPTION, loadGoal),

        contributorCompanies: (goalId: string, {direction}: {direction: ImpactDirection}): Promise<CompanyGoalImpactContributor[]> => {
            return loadCompanyGoalContributors(goalId, direction);
        },
    },

    Query: {
        listGoals: (): Promise<string[]> => loadGoalIds(),

        getGoal: async (_, {id}: {id: string}): Promise<string | undefined> => {
            const goal = await loadGoal(id);
            return goal?.id;
        },
    },
};