import csv from 'csv-parser';
import fs from 'fs';

export type csvVisitor<T> = (item: T) => Promise<void>;

export const readCsvFile = async <T>(filename: string, visitor: csvVisitor<T>): Promise<void> => {
    const stream = fs.createReadStream(filename)
        .pipe(csv());

    for await (const row of stream) {
        await visitor(row as T);
    }
};