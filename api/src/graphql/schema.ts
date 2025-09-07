import {DocumentNode} from 'graphql';
import {parseSchemaDirectory} from './schemaParser';

export const getTypeDefs = (): DocumentNode[] => parseSchemaDirectory(__dirname + '/schema/');
