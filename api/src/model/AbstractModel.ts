import {Model} from "objection";
import {getDatabase} from "../storage/StorageFacade";

export abstract class AbstractModel extends Model {
}

export const bindModelToDatabase = (modelClass: typeof AbstractModel, feature: string): void => {
    modelClass.knex(getDatabase(feature));
}