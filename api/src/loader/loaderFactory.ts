import {LRUMap} from "lru_map";
import DataLoader from "dataloader";

type loaderOptions = {
    // Simplified options support, just for the PoC
    cacheSize?: number; // Undefined means no cache
};

export const createLoader = function <K, T>(fn: (keys: readonly K[]) => Promise<(T[])>, options?: loaderOptions): DataLoader<K, T> {
    let opts = {};
    const cacheSize = options?.cacheSize;
    if (cacheSize !== undefined) {
        opts = {
            ...opts,
            cacheMap: new LRUMap(cacheSize),
        };
    }

    const loader = new DataLoader<K, T>(ids => {
        if (!cacheSize) {
            /**
             * While in production loader cache is a great feature, in API tests it creates issues,
             * because it effectively ignores the changes we make to the data, as tests are running fast.
             * However, it's better not to straight away disable the cache, since it brings other consequences.
             * @see https://www.npmjs.com/package/dataloader#disabling-cache
             *
             * This will effectively clear it before every call.
             */
            loader.clearAll();
        }

        return fn(ids);
    }, opts);

    return loader;
};
