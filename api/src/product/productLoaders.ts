import {createLoader} from "../loader/loaderFactory";
import {ProductModel} from "./ProductModel";

const productModelLoader = createLoader(async (ids: string[]) => {
    const products = await ProductModel.query().findByIds(ids).execute();
    return ids.map(id => products.find(product => product.id === id));
}, {
    cacheSize: 200,
});

export const loadProduct = (id: string): Promise<ProductModel | undefined> => {
    return productModelLoader.load(id);
};
