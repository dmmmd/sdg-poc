import {loadModelProperty} from "../graphql/modelPropertyResolver";
import {ProductModel, NAME} from "./ProductModel";
import {loadProduct} from "./productLoaders";

export const productResolvers = {
    Product: {
        id: (id: string): string => id,

        name: (id: string): Promise<string> => loadModelProperty<ProductModel, string>(id, NAME, loadProduct),
    },
};