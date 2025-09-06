import merge from 'lodash/merge';
import {IResolvers} from '@graphql-tools/utils';

// @todo this can be generated
import {companyResolvers} from "../company/companyResolvers";
import {companyGoalImpactResolvers} from "../company/companyGoalImpactResolvers";
import {goalResolvers} from "../goal/goalResolvers";
import {helloResolvers} from "../hello/helloResolvers";
import {productResolvers} from "../product/productResolvers";
import {productImpactResolvers} from "../product/productImpactResolvers";
import {productImpactFactorResolvers} from "../product/productImpactFactorResolvers";

export const getResolvers = (): IResolvers => merge([
    companyResolvers,
    companyGoalImpactResolvers,
    goalResolvers,
    helloResolvers,
    productResolvers,
    productImpactResolvers,
    productImpactFactorResolvers,
]);