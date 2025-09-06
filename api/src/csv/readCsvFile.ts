import fs from "fs";
import csv from "csv-parser";

export type csvVisitor<T> = (item: T) => Promise<void>;

export const readCsvFile = async <T>(filename: string, visitor: csvVisitor<T>): Promise<void> => {
    const stream = fs.createReadStream(filename)
        .pipe(csv());

    let amount = 0;
    for await (const row of stream) {
        amount++;
        await visitor(row as T);
    }
}