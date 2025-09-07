import type {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        CREATE TABLE IF NOT EXISTS impact_params
        (
            id                  boolean PRIMARY KEY DEFAULT true CHECK (id),
            magnitude           numeric NOT NULL,
            "strongMagnitude"   numeric NOT NULL,
            "positiveImbalance" numeric NOT NULL
        );
    `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.raw(`DROP TABLE IF EXISTS impact_params;`);
}
