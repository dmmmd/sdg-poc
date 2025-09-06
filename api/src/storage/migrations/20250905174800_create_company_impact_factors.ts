import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE TABLE company_impact_factors (
            "companyId" UUID NOT NULL,
            "productId" UUID NOT NULL,
            impact "impactLevel" NOT NULL,
            "viaProductId" UUID DEFAULT NULL,
            "createdAt"  TIMESTAMP   NOT NULL DEFAULT now(),
            PRIMARY KEY ("companyId", "productId")
        );
    `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.raw(`DROP TABLE IF EXISTS company_impact_factors;`);
}
