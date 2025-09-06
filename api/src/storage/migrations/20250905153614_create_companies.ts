import type {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        CREATE EXTENSION IF NOT EXISTS pg_trgm;
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE TABLE companies (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(512) NOT NULL, -- For the PoC, we won't bother with uniqueness
            "searchableName" VARCHAR(512) GENERATED ALWAYS AS (lower(name)) STORED,
            sector TEXT,
            "createdAt"  TIMESTAMP NOT NULL DEFAULT now()
        );

        CREATE INDEX companies_name_search_idx ON companies USING GIN("searchableName" gin_trgm_ops);
    `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
        DROP TABLE IF EXISTS companies;
    `);
}

