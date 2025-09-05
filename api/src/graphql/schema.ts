import {parseSchemaDirectory} from './schemaParser';
import {DocumentNode} from 'graphql';

export const getTypeDefs = (): DocumentNode[] => parseSchemaDirectory(__dirname + '/schema/');
