import type {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        CREATE MATERIALIZED VIEW inherited_product_impact_records AS
        SELECT DISTINCT ON (p.id, impact."goalId")
            p.id AS "productId",
            impact."goalId" AS "goalId",
            impact.impact AS impact,
            CASE WHEN impact."productId" = p.id
                THEN NULL
                ELSE impact."productId"
            END AS "viaProductId"
        FROM products AS p
        JOIN products AS a
            ON a.path @> p.path
        JOIN product_impact_records AS impact
        ON impact."productId" = a.id
        -- Pick the nearest ancestor by shortest path distance (0 = self)
        ORDER BY p.id, impact."goalId", (nlevel(p.path) - nlevel(a.path)) ASC;
        
        -- Unique constraint per (product, goal) — required for CONCURRENTLY refresh
        CREATE UNIQUE INDEX inherited_product_impact_records_unique_idx ON inherited_product_impact_records ("productId", "goalId");
    `);
}

export async function down(knex: Knex): Promise<void> {
}

