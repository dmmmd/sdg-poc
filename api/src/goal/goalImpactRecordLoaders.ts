import {
    CompanyGoalImpactContributor,
    createCompanyGoalImpactContributor,
} from '../company/CompanyGoalImpactContributor';
import {createLoader} from '../loader/loaderFactory';
import {COMPANY_ID, GOAL_ID, GoalImpactRecordModel, IMPACT} from './GoalImpactRecordModel';
import {ImpactDirection} from './ImpactDirection';

const goalImpactCompanyContributorLoader = createLoader(async (goalDirectionTuples: readonly [string, ImpactDirection][]): Promise<CompanyGoalImpactContributor[][]> => {
    const batchAlias = 'batch';
    const selectors = goalDirectionTuples.map(([goalId, direction], batch) =>
        GoalImpactRecordModel.query()
            .select(
                GoalImpactRecordModel.raw('?::integer as ??', [batch, batchAlias]),
                GOAL_ID, COMPANY_ID, IMPACT,
            )
            .where(GOAL_ID, goalId)
            .andWhere(IMPACT, direction === ImpactDirection.POSITIVE ? '>' : '<', 0)
            .groupBy(GOAL_ID, COMPANY_ID, IMPACT)
            .orderBy(IMPACT, direction === ImpactDirection.POSITIVE ? 'desc' : 'asc')
            .limit(25)
            .toKnexQuery(),
    );

    type ImpactRecordsWithBatch = GoalImpactRecordModel & {[batchAlias]: number};
    const rows: ImpactRecordsWithBatch[] = await GoalImpactRecordModel.knex().unionAll(selectors, true);

    return goalDirectionTuples.map((_, batch) => {
        return rows.filter(row => row[batchAlias] === batch)
            .map(row => createCompanyGoalImpactContributor(row.goalId, row.impact, row.companyId));
    });

}, {
    cacheSize: 100,
});

export const loadCompanyGoalContributors = (goalId: string,
                                            direction: ImpactDirection = ImpactDirection.POSITIVE): Promise<CompanyGoalImpactContributor[]> => {
    return goalImpactCompanyContributorLoader.load([goalId, direction]);
};