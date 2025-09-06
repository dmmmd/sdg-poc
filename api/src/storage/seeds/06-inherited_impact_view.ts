import {InheritedProductImpactModel} from "../../product/InheritedProductImpactModel";

export async function seed(): Promise<void> {
    await InheritedProductImpactModel.knex().raw(`REFRESH MATERIALIZED VIEW CONCURRENTLY ??;`, [InheritedProductImpactModel.tableName]);
}
