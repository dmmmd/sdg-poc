import {CompanyProductLinkModel} from "../../company/CompanyProductLinkModel";
import {logError, logInfo} from "../../logger/loggerFacade";
import {ProductModel, ID as P_ID} from "../../product/ProductModel";
import {CompanyModel, ID as C_ID} from "../../company/CompanyModel";

const getRandomShares = (bucketAmount: number): number[] => {
    let total = 0;
    const shares = new Array<number>(bucketAmount);
    for (let i = 0; i < bucketAmount - 1; i++) {
        const share = Math.random() * (1 - total);
        shares[i] = share;
        total += share;
    }
    shares[bucketAmount - 1] = 1 - total;
    return shares;
}

export async function seed(): Promise<void> {
    const allProductIds = await ProductModel.query()
        .select([P_ID])
        .execute()
        .then(rows => rows.map(r => r.id));

    const getRandomProductIds = (): string[] => {
        const amount = Math.floor(Math.random() * 10) + 1;
        const selected = new Set<string>();
        while (selected.size < amount) {
            const randomIndex = Math.floor(Math.random() * allProductIds.length);
            selected.add(allProductIds[randomIndex]);
        }
        return [...selected.values()];
    };

    let companyAmount = 0, linkAmount = 0;
    const transaction = await CompanyProductLinkModel.startTransaction();
    try {
        await CompanyProductLinkModel.query(transaction).truncate();

        const pageSize = 100;
        let page = 0, companyIds = [];
        do {
            companyIds = await CompanyModel.query(transaction)
                .select([C_ID])
                .limit(pageSize)
                .offset(page * pageSize)
                .execute()
                .then(rows => rows.map(r => r.id));

            for (const companyId of companyIds) {
                const productIds = getRandomProductIds();
                if (productIds.length > 0) {
                    const revenueShares = getRandomShares(productIds.length);

                    await CompanyProductLinkModel.query(transaction)
                        .insert(productIds.map((productId, i) => ({
                            companyId,
                            productId,
                            revenueShare: revenueShares[i],
                        })))
                        // Conflicts are not possible due to prior truncation
                        .execute();

                    companyAmount++;
                    linkAmount += productIds.length;
                }
            }

            page++;
        } while (companyIds.length >= pageSize);

        await transaction.commit();
        logInfo(`Created ${linkAmount} product links for ${companyAmount} companies`);
    } catch (error) {
        logError(error);
        await transaction.rollback();
        throw error;
    }
}
