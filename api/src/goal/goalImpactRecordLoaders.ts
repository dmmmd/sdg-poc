import {createLoader} from "../loader/loaderFactory";
import {COMPANY_ID, FACTOR, GOAL_ID, GoalImpactRecordModel, IMPACT} from "./GoalImpactRecordModel";
import {ImpactDirection} from "./ImpactDirection";
import {
    CompanyGoalImpactContributor,
    createCompanyGoalImpactContributor
} from "../company/CompanyGoalImpactContributor";

const goalImpactCompanyContributorLoader = createLoader(async (goalDirectionTuples: [string, ImpactDirection][]): Promise<CompanyGoalImpactContributor[][]> => {
    const batchAlias = 'batch';
    const selects = goalDirectionTuples.map(([goalId, direction], batch) =>
        GoalImpactRecordModel.query()
            .select(
                GoalImpactRecordModel.raw('?::integer as ??', [batch, batchAlias]),
                GOAL_ID, COMPANY_ID, FACTOR
            )
            .where(GOAL_ID, goalId)
            .andWhere(FACTOR, direction === ImpactDirection.POSITIVE ? '>' : '<', 0)
            .groupBy(GOAL_ID, COMPANY_ID, FACTOR)
            .orderBy(FACTOR, direction === ImpactDirection.POSITIVE ? 'desc' : 'asc')
            .limit(25)
            .toKnexQuery()
    );

    const rows: GoalImpactRecordModel[] = await GoalImpactRecordModel.knex().unionAll(selects, true);

    return goalDirectionTuples.map((_, batch) => {
        return rows.filter(row => row[batchAlias] === batch)
            .map(row => createCompanyGoalImpactContributor(row.goalId, row.factor, row.companyId));
    });

}, {
    cacheSize: 100,
});

export const loadCompanyGoalContributors = (goalId: string, direction: ImpactDirection = ImpactDirection.POSITIVE): Promise<CompanyGoalImpactContributor[]> => {
    return goalImpactCompanyContributorLoader.load([goalId, direction]);
};