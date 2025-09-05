import Knex from "knex";
import config from './knexfile';

let singleDbInstance: Knex.Knex | undefined;

const getSingleDbInstance = (): Knex.Knex => {
    if (!singleDbInstance) {
        singleDbInstance = Knex(config);
    }
    return singleDbInstance!;
}

const databases: Map<string, Knex.Knex> = new Map();

export const getDatabase = (feature: string): Knex.Knex => {
    // In a more complex application, we will return different database connections per feature
    // For simplicity, we return the same instance here.
    if (!databases.has(feature)) {
        databases.set(feature, getSingleDbInstance());
    }
    return databases.get(feature)!;
}