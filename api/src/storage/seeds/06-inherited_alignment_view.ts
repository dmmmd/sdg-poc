import {InheritedProductAlignmentModel} from "../../product/InheritedProductAlignmentModel";

export async function seed(): Promise<void> {
    await InheritedProductAlignmentModel.knex().raw(`REFRESH MATERIALIZED VIEW CONCURRENTLY ??;`, [InheritedProductAlignmentModel.tableName]);
}
