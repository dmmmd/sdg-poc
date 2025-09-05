import type {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        CREATE EXTENSION IF NOT EXISTS pg_trgm;
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE TABLE companies (
            id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
            name         TEXT        NOT NULL,-- Not going to deal with uniqueness for now
            "createdAt"  TIMESTAMP NOT NULL DEFAULT now()
        );

        CREATE INDEX companies_name_search_idx ON companies USING GIN(name gin_trgm_ops);
    `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
        DROP TABLE IF EXISTS companies;
    `);
}

