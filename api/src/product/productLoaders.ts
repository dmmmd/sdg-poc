import {createLoader} from '../loader/loaderFactory';
import {ProductModel} from './ProductModel';

const productModelLoader = createLoader(async (ids: readonly string[]) => {
    const products = await ProductModel.query().findByIds(ids as string[]).execute();
    return ids.map(id => products.find(product => product.id === id));
}, {
    cacheSize: 200,
});

export const loadProduct = (id: string): Promise<ProductModel|undefined> => {
    return productModelLoader.load(id);
};
