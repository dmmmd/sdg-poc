import {AbstractModel} from '../model/AbstractModel';

type loaderFunctionType<T> = (id: any) => Promise<T|undefined>;

export const loadModelProperty = async <M extends AbstractModel, K extends keyof M, T>(
    id: any,
    property: K,
    loader: loaderFunctionType<M>,
): Promise<T|never> => {
    const model = await loader(id);
    if (!model) {
        throw new Error(`Loader ${loader.name}() found nothing with ID "${id}"`); // @todo proper NotFound error
    }
    return model[property] as T;
};
