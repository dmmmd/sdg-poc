import {GoalModel, ID, NAME} from "./GoalModel";
import {createLoader} from "../loader/loaderFactory";

const goalIdsLoader = createLoader(async (keys) => {
    const ids = await GoalModel.query()
        .select(ID)
        .orderBy(NAME)
        .execute()
        .then(rows => rows.map(r => r.id));
    return keys.map(() => ids);
}, {
    cacheSize: 100,
});

export const loadGoalIds = (): Promise<string[]> => {
    return goalIdsLoader.load(''); // Key is irrelevant here
};

const goalModelLoader = createLoader(async (ids: string[]) => {
    const goals = await GoalModel.query().findByIds(ids).execute();
    return ids.map(id => goals.find(goal => goal.id === id));
}, {
    cacheSize: 200,
});

export const loadGoal = (id: string): Promise<GoalModel | undefined> => {
    return goalModelLoader.load(id);
};
