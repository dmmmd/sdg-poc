import {Knex} from "knex";
import {CompanyModel} from "../../company/CompanyModel";
import {logError, logInfo} from "../../logger/loggerFacade";
import {readCsvFile} from "../../csv/readCsvFile";

type CompanyCandidate = {
    symbol: string;
    name: string;
    sector: string;
};

export async function seed(knex: Knex): Promise<void> {
    const filename = __dirname + '/companies.csv';
    let amount = 0;

    const transaction = await CompanyModel.startTransaction();
    try {
        await CompanyModel.query(transaction).truncate();

        await readCsvFile<CompanyCandidate>(filename, async (candidate) => {
            const company = {
                name: candidate.name,
                sector: candidate.sector,
            };
            await CompanyModel.query(transaction).insert(company);
            amount++;
        });

        await transaction.commit();
        logInfo(`Inserted ${amount} companies from ${filename}`);
    } catch (error) {
        logError(error);
        await transaction.rollback();
        throw error;
    }
};



