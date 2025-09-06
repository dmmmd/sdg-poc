import {GoalModel} from "../../goal/GoalModel";
import {logError, logInfo} from "../../logger/loggerFacade";
import {readCsvFile} from "../../csv/readCsvFile";

type GoalCandidate = {
    name: string;
    description: string;
};

export async function seed(): Promise<void> {
    const filename = __dirname + '/goals.csv';
    let amount = 0;

    const transaction = await GoalModel.startTransaction();
    try {
        await GoalModel.query(transaction).truncate();

        await readCsvFile<GoalCandidate>(filename, async (goal) => {
            await GoalModel.query(transaction).insert(goal);
            amount++;
        });

        await transaction.commit();
        logInfo(`Inserted ${amount} goals from ${filename}`);
    } catch (error) {
        logError(error);
        await transaction.rollback();
        throw error;
    }
}



