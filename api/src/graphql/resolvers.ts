import merge from 'lodash/merge';
import {IResolvers} from '@graphql-tools/utils';

import {companyResolvers} from "../company/companyResolvers";
import {companyGoalImpactResolvers} from "../company/companyGoalImpactResolvers";
import {companyGoalImpactContributorResolvers} from "../company/companyGoalImpactContributorResolvers";
import {goalResolvers} from "../goal/goalResolvers";
import {goalImpactContributorResolvers} from "../goal/goalImpactContributorResolvers";
import {productResolvers} from "../product/productResolvers";
import {productAlignmentResolvers} from "../product/productAlignmentResolvers";
import {productImpactResolvers} from "../product/productImpactResolvers";

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