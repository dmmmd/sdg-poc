import {IResolvers} from '@graphql-tools/utils';
import merge from 'lodash/merge';
import {companyGoalImpactContributorResolvers} from '../company/companyGoalImpactContributorResolvers';
import {companyGoalImpactResolvers} from '../company/companyGoalImpactResolvers';

import {companyResolvers} from '../company/companyResolvers';
import {goalImpactContributorResolvers} from '../goal/goalImpactContributorResolvers';
import {goalResolvers} from '../goal/goalResolvers';
import {productAlignmentResolvers} from '../product/productAlignmentResolvers';
import {productImpactResolvers} from '../product/productImpactResolvers';
import {productResolvers} from '../product/productResolvers';

export const getResolvers = (): IResolvers => merge([
    companyResolvers,
    companyGoalImpactResolvers,
    companyGoalImpactContributorResolvers,
    goalResolvers,
    goalImpactContributorResolvers,
    productResolvers,
    productAlignmentResolvers,
    productImpactResolvers,
]);