import merge from 'lodash/merge';
import {IResolvers} from '@graphql-tools/utils';

// @todo this can be generated
import {helloResolvers} from "../hello/helloResolvers";
export const getResolvers = (): IResolvers => merge([
    helloResolvers,
]);