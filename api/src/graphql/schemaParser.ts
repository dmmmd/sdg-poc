import gql from 'graphql-tag';
import {DocumentNode} from 'graphql';
import {readdirSync, readFileSync} from 'fs';
import {logInfo} from "../logger/loggerFacade";

export const parseSchemaDirectory = (schemaDirectoryPath: string): DocumentNode[] => {
    return readdirSync(schemaDirectoryPath)
        .filter(filename => filename.endsWith('.gql'))
        .map(filename => {
            logInfo(`Loading schema ${filename}`);
            return gql(readFileSync(schemaDirectoryPath.concat(filename), 'utf8'));
        });
}
