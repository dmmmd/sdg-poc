import {AbstractModel, bindModelToDatabase} from "../model/AbstractModel";
import {STORAGE_PRODUCTS} from "../storage/storageFeatures";

export const ID = "id";
export const PARENT_ID = "parentId";
export const NAME = "name";
export const SLUG = "slug";
export const PATH = "path";

export class ProductModel extends AbstractModel {
    readonly id!: string;
    readonly parentId!: string;
    readonly name!: string;
    readonly slug!: string;
    readonly path!: string;
    readonly createdAt!: string;

    static get tableName(): string {
        return "products";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: [NAME, SLUG, PATH],
            properties: {
                [ID]: {type: "string", format: "uuid"},
                [PARENT_ID]: {
                    anyOf: [
                        {type: "string", format: "uuid"},
                        {type: "null"},
                    ],
                },
                [NAME]: {type: "string", minLength: 3, maxLength: 255},
                [SLUG]: {type: "string", minLength: 3, maxLength: 255},
                [PATH]: {type: "string", minLength: 3},
            },
        };
    }
}

bindModelToDatabase(ProductModel, STORAGE_PRODUCTS);
