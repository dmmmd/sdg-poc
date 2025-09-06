import { Knex } from "knex";
import {InheritedProductImpactModel} from "../../product/InheritedProductImpactModel";

export async function seed(knex: Knex): Promise<void> {
    await InheritedProductImpactModel.knex().raw(`REFRESH MATERIALIZED VIEW CONCURRENTLY ??;`, [InheritedProductImpactModel.tableName]);
};
