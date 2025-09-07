import {GoalImpactRecordModel} from '../../goal/GoalImpactRecordModel';

export async function seed(): Promise<void> {
    await GoalImpactRecordModel.knex().raw(`REFRESH MATERIALIZED VIEW CONCURRENTLY ??;`, [GoalImpactRecordModel.tableName]);
}
