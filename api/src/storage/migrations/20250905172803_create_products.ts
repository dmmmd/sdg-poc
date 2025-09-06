import type {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
         CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
         CREATE EXTENSION IF NOT EXISTS ltree;
         
         CREATE TABLE products (
             id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
             name TEXT NOT NULL,
             slug TEXT NOT NULL UNIQUE,
             path ltree NOT NULL,
             "parentId" UUID REFERENCES products(id) ON DELETE SET NULL,
             "createdAt" TIMESTAMP NOT NULL DEFAULT now()
         );
         
         CREATE INDEX products_path_gist_idx ON products USING GIST(path);
         CREATE UNIQUE INDEX products_path_idx ON products(path);
    `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.raw(`DROP TABLE IF EXISTS products;`);
}
