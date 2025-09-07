import {AlignmentLevel, validAlignmentLevels} from '../../goal/alignmentLevels';
import {loadGoalIds} from '../../goal/goalLoaders';
import {logError, logInfo} from '../../logger/loggerFacade';
import {ProductAlignmentModel} from '../../product/ProductAlignmentModel';
import {ID as P_ID, ProductModel} from '../../product/ProductModel';

const getRandomAlignment = (): AlignmentLevel => {
    const randomIndex = Math.floor(Math.random() * validAlignmentLevels.length);
    return validAlignmentLevels[randomIndex];
};

export async function seed(): Promise<void> {
    const allGoalIds = await loadGoalIds();

    const getRandomGoalIds = (): string[] => {
        const amount = Math.floor(Math.random() * 3) + 1;
        const selected = new Set<string>();
        while (selected.size < amount) {
            const randomIndex = Math.floor(Math.random() * allGoalIds.length);
            selected.add(allGoalIds[randomIndex]);
        }
        return [...selected.values()];
    };

    let productAmount = 0, alignmentAmount = 0;
    const transaction = await ProductAlignmentModel.startTransaction();
    try {
        await ProductAlignmentModel.query(transaction).truncate();

        const pageSize = 100;
        let page = 0, productIds = [];
        do {
            productIds = await ProductModel.query(transaction)
                .select([P_ID])
                .limit(pageSize)
                .offset(page * pageSize)
                .execute()
                .then(rows => rows.map(r => r.id));

            for (const productId of productIds) {
                const goalIds = getRandomGoalIds();
                if (goalIds.length > 0) {
                    await ProductAlignmentModel.query(transaction)
                        .insert(goalIds.map(goalId => {
                            return {
                                productId,
                                goalId,
                                alignment: getRandomAlignment(),
                            };
                        }))
                        // Conflicts are not possible due to prior truncation
                        .execute();

                    productAmount++;
                    alignmentAmount += goalIds.length;
                }
            }

            page++;
        } while (productIds.length >= pageSize);

        await transaction.commit();
        logInfo(`Created ${alignmentAmount} alignment records for ${productAmount} products`);
    } catch (error) {
        logError(error);
        await transaction.rollback();
        throw error;
    }
}
