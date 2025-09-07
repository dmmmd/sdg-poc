import type {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        CREATE TYPE "alignmentLevel" AS ENUM ('strong+', '+', '-', 'strong-');
        
        CREATE TABLE product_alignment_records (
            "productId" UUID NOT NULL, 
            "goalId" UUID NOT NULL,
            alignment "alignmentLevel" DEFAULT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            PRIMARY KEY ("productId", "goalId")
        );
    `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
        DROP TABLE IF EXISTS product_alignment_records;
        DROP TYPE IF EXISTS "alignmentLevel";
    `);
}
