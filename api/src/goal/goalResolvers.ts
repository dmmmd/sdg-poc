import {CompanyGoalImpactContributor} from '../company/CompanyGoalImpactContributor';
import {loadModelProperty} from '../graphql/modelPropertyResolver';
import {loadCompanyGoalContributors} from './goalImpactRecordLoaders';
import {loadGoal, loadGoalIds} from './goalLoaders';
import {DESCRIPTION, GoalModel, NAME} from './GoalModel';
import {ImpactDirection} from './ImpactDirection';

export const goalResolvers = {
    Goal: {
        id: (id: string): string => id,

        name: (id: string): Promise<string> => loadModelProperty(id, NAME, loadGoal),

        description: (id: string): Promise<string> => loadModelProperty(id, DESCRIPTION, loadGoal),

        contributorCompanies: (goalId: string, {direction}: {
            direction: ImpactDirection
        }): Promise<CompanyGoalImpactContributor[]> => {
            return loadCompanyGoalContributors(goalId, direction);
        },
    },

    Query: {
        listGoals: (): Promise<string[]> => loadGoalIds(),

        getGoal: async (_: any, {id}: {id: string}): Promise<string|undefined> => {
            const goal = await loadGoal(id);
            return goal?.id;
        },
    },
};