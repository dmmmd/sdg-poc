import type {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        CREATE MATERIALIZED VIEW inherited_product_alignment_records AS
        SELECT DISTINCT ON (p.id, alignment."goalId")
            p.id AS "productId",
            alignment."goalId" AS "goalId",
            alignment.alignment AS alignment,
            CASE WHEN alignment."productId" = p.id
                THEN NULL
                ELSE alignment."productId"
            END AS "viaProductId"
        FROM products AS p
        JOIN products AS a
            ON a.path @> p.path
        JOIN product_alignment_records AS alignment
        ON alignment."productId" = a.id
        -- Pick the nearest ancestor by shortest path distance (0 = self)
        ORDER BY p.id, alignment."goalId", (nlevel(p.path) - nlevel(a.path)) ASC;
        
        -- Unique constraint per (product, goal) — required for CONCURRENTLY refresh
        CREATE UNIQUE INDEX inherited_product_alignment_records_unique_idx ON inherited_product_alignment_records ("productId", "goalId");
    `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.raw(`DROP MATERIALIZED VIEW IF EXISTS inherited_product_alignment_records;`);
}
