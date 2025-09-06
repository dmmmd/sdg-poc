import {logError, logInfo} from "../../logger/loggerFacade";
import {GoalModel, ID as G_ID} from "../../goal/GoalModel";
import {ProductImpactModel} from "../../product/ProductImpactModel";
import {ProductModel, ID as P_ID} from "../../product/ProductModel";
import {ImpactLevel, validImpactLevels} from "../../goal/impactLevels";

const getRandomImpact = (): ImpactLevel => {
    const randomIndex = Math.floor(Math.random() * validImpactLevels.length);
    return validImpactLevels[randomIndex];
}

export async function seed(): Promise<void> {
    const allGoalIds = await GoalModel.query()
        .select(G_ID)
        .execute()
        .then(rows => rows.map(r => r.id));

    const getRandomGoalIds = (): string[] => {
        const amount = Math.floor(Math.random() * 3) + 1;
        const selected = new Set<string>();
        while (selected.size < amount) {
            const randomIndex = Math.floor(Math.random() * allGoalIds.length);
            selected.add(allGoalIds[randomIndex]);
        }
        return [...selected.values()];
    };

    let productAmount = 0, impactAmount = 0;
    const transaction = await ProductImpactModel.startTransaction();
    try {
        await ProductImpactModel.query(transaction).truncate();

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
                    await ProductImpactModel.query(transaction)
                        .insert(goalIds.map(goalId => {
                            return {
                                productId,
                                goalId,
                                impact: getRandomImpact(),
                            }
                        }))
                        // Conflicts are not possible due to prior truncation
                        .execute();

                    productAmount++;
                    impactAmount += goalIds.length;
                }
            }

            page++;
        } while (productIds.length >= pageSize);

        await transaction.commit();
        logInfo(`Created ${impactAmount} impact records for ${productAmount} products`);
    } catch (error) {
        logError(error);
        await transaction.rollback();
        throw error;
    }
}
