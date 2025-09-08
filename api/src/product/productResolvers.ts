import {loadModelProperty} from '../graphql/modelPropertyResolver';
import {loadProduct} from './productLoaders';
import {NAME, ProductModel} from './ProductModel';

export const productResolvers = {
    Product: {
        id: (id: string): string => id,

        name: (id: string): Promise<string> => loadModelProperty(id, NAME, loadProduct),
    },
};