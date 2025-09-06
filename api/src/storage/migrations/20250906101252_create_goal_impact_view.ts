import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        CREATE MATERIALIZED VIEW goal_impact_records AS
        SELECT
            ipi."goalId" AS "goalId",
            ANY_VALUE(c.sector) AS sector, -- A company is only in one sector
            cp."companyId" AS "companyId",
            SUM(cp."revenueShare") * c."revenueEURThousands" * SUM(
                CASE WHEN ipi.impact = 'strong+' THEN ip."strongMagnitude" * ip."positiveImbalance"
                     WHEN ipi.impact = '+' THEN ip.magnitude * ip."positiveImbalance"
                     WHEN ipi.impact = '-' THEN -1 * ip.magnitude
                     WHEN ipi.impact = 'strong-' THEN -1 * ip."strongMagnitude"
                     ELSE 0.0 -- Just in case, we don't know what it is
                END
            )::numeric AS factor
        FROM inherited_product_impact_records AS ipi
        JOIN company_products AS cp
            ON cp."productId" = ipi."productId"
        JOIN companies AS c
            ON c.id = cp."companyId"
        CROSS JOIN impact_params AS ip
        GROUP BY ipi."goalId", cp."companyId",
                    -- Needed for Postgres to be able to calculate the aggregate
                    c."revenueEURThousands", ip.magnitude, ip."strongMagnitude", ip."positiveImbalance"
        ;

        CREATE UNIQUE INDEX goal_impact_records_unique_idx ON goal_impact_records ("goalId", "companyId");
        CREATE INDEX goal_impact_records_factor_asc_by_goal_idx ON goal_impact_records ("goalId", factor ASC, "companyId");
        CREATE INDEX goal_impact_records_factor_desc_by_goal_idx ON goal_impact_records ("goalId", factor DESC, "companyId");
        CREATE INDEX goal_impact_records_factor_asc_by_sector_idx ON goal_impact_records ("goalId", sector, factor ASC, "companyId");
        CREATE INDEX goal_impact_records_factor_desc_by_sector_idx ON goal_impact_records ("goalId", sector, factor DESC, "companyId");
    `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.raw(`DROP MATERIALIZED VIEW IF EXISTS goal_impact_records;`);
}
