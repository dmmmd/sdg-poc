import type {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE TABLE company_products (
            "companyId" UUID NOT NULL,
            "productId" UUID NOT NULL,
            "revenueShare" FLOAT NOT NULL CHECK ("revenueShare" >= 0 AND "revenueShare" <= 1),
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            PRIMARY KEY ("companyId", "productId")
        );
        
        CREATE INDEX company_by_product_idx ON company_products("productId");
    `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.raw(`DROP TABLE IF EXISTS company_products;`);
}
