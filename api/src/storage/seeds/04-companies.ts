import {CompanyModel} from '../../company/CompanyModel';
import {readCsvFile} from '../../csv/readCsvFile';
import {logError, logInfo} from '../../logger/loggerFacade';

type CompanyCandidate = {
    symbol: string;
    name: string;
    sector: string;
};

const getRandomRevenueThousands = (): number => {
    // Random revenue between 10K and 50B EUR, in thousands
    return Math.floor(Math.random() * (50_000_000 - 10)) + 10;
};

export async function seed(): Promise<void> {
    const filename = __dirname + '/companies.csv';
    let amount = 0;

    const transaction = await CompanyModel.startTransaction();
    try {
        await CompanyModel.query(transaction).truncate();

        await readCsvFile<CompanyCandidate>(filename, async (candidate) => {
            const company = {
                name: candidate.name,
                sector: candidate.sector,
                revenueEURThousands: getRandomRevenueThousands(),
            };
            await CompanyModel.query(transaction).insert(company);
            amount++;
        });

        await transaction.commit();
        logInfo(`Inserted ${amount} companies from ${filename}`);
    } catch (error) {
        logError(error as Error);
        await transaction.rollback();
        throw error;
    }
}



