import {loadModelProperty} from "../graphql/modelPropertyResolver";
import {GoalModel, NAME, DESCRIPTION} from "./GoalModel";
import {loadGoal} from "./goalLoaders";

export const goalResolvers = {
    Goal: {
        id: (id: string): string => id,
        name: (id: string): Promise<string> => loadModelProperty<GoalModel, string>(id, NAME, loadGoal),
        description: (id: string): Promise<string> => loadModelProperty<GoalModel, string>(id, DESCRIPTION, loadGoal),
    },
};