import {AbstractModel} from "../model/AbstractModel";

type loaderFunctionType<T> = (id: string|number) => Promise<T | undefined>;

export const loadModelProperty = async <M extends AbstractModel, T>(id: string|number, property: string, loader: loaderFunctionType<M>): Promise<T|undefined> => {
    const model = await loader(id);
    if (!model) {
        throw new Error(`Loader ${loader.name}() found nothing with ID "${id}"`); // @todo proper error
    }
    return model[property];
}
