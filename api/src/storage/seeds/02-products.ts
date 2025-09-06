import {Knex} from "knex";
import {logError, logInfo} from "../../logger/loggerFacade";
import {readCsvFile} from "../../csv/readCsvFile";
import {ProductModel} from "../../product/ProductModel";

type ProductCandidate = {
    name: string;
    slug: string;
    parentPath: string | null;
};

type InsertCandidate = {
    name: string;
    slug: string;
    parentId: string | null;
    path: string;
};

export async function seed(knex: Knex): Promise<void> {
    const products: Map<string, ProductModel> = new Map();
    const orphans: Map<string, ProductCandidate[]> = new Map();
    const createInsertCandidate = (candidate: ProductCandidate): InsertCandidate | null => {
        const template = {
            name: candidate.name,
            slug: candidate.slug,
            parentId: null,
            path: candidate.slug,
        };

        const parentPath = candidate.parentPath?.trim() ?? '';
        if ('' === parentPath) {
            // Root product
            return template;
        }

        if (products.has(parentPath)) {
            const parent = products.get(parentPath)!;
            return {
                ...template,
                parentId: parent.id,
                path: parent.path + '.' + candidate.slug,
            };
        }

        orphans.has(parentPath)
            ? orphans.get(parentPath).push(candidate)
            : orphans.set(parentPath, [candidate]);

        return null;
    };

    const filename = __dirname + '/products.csv';
    let amount = 0;

    const transaction = await ProductModel.startTransaction();
    try {
        await ProductModel.query(transaction).truncate();

        await readCsvFile<ProductCandidate>(filename, async (candidate) => {
            const insertCandidate = createInsertCandidate(candidate);
            if (insertCandidate) {
                const product = await ProductModel.query(transaction).insert(insertCandidate);
                amount++;
                products.set(product.path, product);
            }
        });
        // In this PoC I will ignore the orphans, assume the file is ordered correctly
        if (orphans.size > 0) {
            logInfo(`There are ${orphans.size} orphaned products that could not be inserted due to missing parents.`);
        }

        await transaction.commit();
        logInfo(`Inserted ${amount} products from ${filename}`);
    } catch (error) {
        logError(error);
        await transaction.rollback();
        throw error;
    }
};



