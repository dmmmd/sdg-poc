import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: any; output: any; }
  Date: { input: any; output: any; }
};

export enum AlignmentLevel {
  Negative = 'NEGATIVE',
  Positive = 'POSITIVE',
  StrongNegative = 'STRONG_NEGATIVE',
  StrongPositive = 'STRONG_POSITIVE'
}

export type Company = {
  __typename?: 'Company';
  goalImpacts: Array<CompanyGoalImpact>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  sector: Scalars['String']['output'];
};

export type CompanyGoalImpact = {
  __typename?: 'CompanyGoalImpact';
  company: Company;
  factors: Array<ProductImpact>;
  goal: Goal;
  impact: Scalars['BigInt']['output'];
};

export type CompanyGoalImpactContributor = GoalImpactContributor & {
  __typename?: 'CompanyGoalImpactContributor';
  company: Company;
  factors: Array<ProductImpact>;
  goal: Goal;
  impact: Scalars['BigInt']['output'];
};

export type DirectProductAlignment = ProductAlignment & {
  __typename?: 'DirectProductAlignment';
  alignment: AlignmentLevel;
  goal: Goal;
  product: Product;
};

export type Goal = {
  __typename?: 'Goal';
  contributorCompanies: Array<CompanyGoalImpactContributor>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};


export type GoalContributorCompaniesArgs = {
  direction: ImpactDirection;
};

export type GoalImpactContributor = {
  goal: Goal;
  impact: Scalars['BigInt']['output'];
};

export enum ImpactDirection {
  Negative = 'NEGATIVE',
  Positive = 'POSITIVE'
}

export type Product = {
  __typename?: 'Product';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type ProductAlignment = {
  alignment: AlignmentLevel;
  goal: Goal;
  product: Product;
};

export type ProductImpact = {
  __typename?: 'ProductImpact';
  alignment: ProductAlignment;
  impact: Scalars['BigInt']['output'];
};

export type Query = {
  __typename?: 'Query';
  findCompanies: Array<Company>;
  getCompany?: Maybe<Company>;
  getGoal?: Maybe<Goal>;
  getTime: Scalars['Date']['output'];
  listCompanies: Array<Company>;
  listGoals: Array<Goal>;
};


export type QueryFindCompaniesArgs = {
  partialName: Scalars['String']['input'];
};


export type QueryGetCompanyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetGoalArgs = {
  id: Scalars['ID']['input'];
};


export type QueryListCompaniesArgs = {
  page?: Scalars['Int']['input'];
};

export type ViaProductAlignment = ProductAlignment & {
  __typename?: 'ViaProductAlignment';
  alignment: AlignmentLevel;
  goal: Goal;
  product: Product;
  viaProduct: Product;
};

export type CompanyDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CompanyDetailQuery = { __typename?: 'Query', getCompany?: { __typename?: 'Company', id: string, name: string, sector: string, goalImpacts: Array<{ __typename?: 'CompanyGoalImpact', impact: any, goal: { __typename?: 'Goal', name: string, description: string }, factors: Array<{ __typename?: 'ProductImpact', impact: any, alignment: { __typename?: 'DirectProductAlignment', alignment: AlignmentLevel, product: { __typename?: 'Product', name: string } } | { __typename?: 'ViaProductAlignment', alignment: AlignmentLevel, product: { __typename?: 'Product', name: string }, viaProduct: { __typename?: 'Product', name: string } } }> }> } | null };

export type CompanyListQueryVariables = Exact<{
  page: Scalars['Int']['input'];
}>;


export type CompanyListQuery = { __typename?: 'Query', listCompanies: Array<{ __typename?: 'Company', id: string, name: string, sector: string }> };

export type FindCompaniesQueryVariables = Exact<{
  partialName: Scalars['String']['input'];
}>;


export type FindCompaniesQuery = { __typename?: 'Query', findCompanies: Array<{ __typename?: 'Company', id: string, name: string, sector: string }> };


export const CompanyDetailDocument = gql`
    query CompanyDetail($id: ID!) {
  getCompany(id: $id) {
    id
    name
    sector
    goalImpacts {
      goal {
        name
        description
      }
      impact
      factors {
        impact
        alignment {
          ... on DirectProductAlignment {
            product {
              name
            }
            alignment
          }
          ... on ViaProductAlignment {
            product {
              name
            }
            viaProduct {
              name
            }
            alignment
          }
        }
      }
    }
  }
}
    `;

/**
 * __useCompanyDetailQuery__
 *
 * To run a query within a React component, call `useCompanyDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useCompanyDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCompanyDetailQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCompanyDetailQuery(baseOptions: Apollo.QueryHookOptions<CompanyDetailQuery, CompanyDetailQueryVariables> & ({ variables: CompanyDetailQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CompanyDetailQuery, CompanyDetailQueryVariables>(CompanyDetailDocument, options);
      }
export function useCompanyDetailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CompanyDetailQuery, CompanyDetailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CompanyDetailQuery, CompanyDetailQueryVariables>(CompanyDetailDocument, options);
        }
export function useCompanyDetailSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CompanyDetailQuery, CompanyDetailQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CompanyDetailQuery, CompanyDetailQueryVariables>(CompanyDetailDocument, options);
        }
export type CompanyDetailQueryHookResult = ReturnType<typeof useCompanyDetailQuery>;
export type CompanyDetailLazyQueryHookResult = ReturnType<typeof useCompanyDetailLazyQuery>;
export type CompanyDetailSuspenseQueryHookResult = ReturnType<typeof useCompanyDetailSuspenseQuery>;
export type CompanyDetailQueryResult = Apollo.QueryResult<CompanyDetailQuery, CompanyDetailQueryVariables>;
export const CompanyListDocument = gql`
    query CompanyList($page: Int!) {
  listCompanies(page: $page) {
    id
    name
    sector
  }
}
    `;

/**
 * __useCompanyListQuery__
 *
 * To run a query within a React component, call `useCompanyListQuery` and pass it any options that fit your needs.
 * When your component renders, `useCompanyListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCompanyListQuery({
 *   variables: {
 *      page: // value for 'page'
 *   },
 * });
 */
export function useCompanyListQuery(baseOptions: Apollo.QueryHookOptions<CompanyListQuery, CompanyListQueryVariables> & ({ variables: CompanyListQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CompanyListQuery, CompanyListQueryVariables>(CompanyListDocument, options);
      }
export function useCompanyListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CompanyListQuery, CompanyListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CompanyListQuery, CompanyListQueryVariables>(CompanyListDocument, options);
        }
export function useCompanyListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CompanyListQuery, CompanyListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CompanyListQuery, CompanyListQueryVariables>(CompanyListDocument, options);
        }
export type CompanyListQueryHookResult = ReturnType<typeof useCompanyListQuery>;
export type CompanyListLazyQueryHookResult = ReturnType<typeof useCompanyListLazyQuery>;
export type CompanyListSuspenseQueryHookResult = ReturnType<typeof useCompanyListSuspenseQuery>;
export type CompanyListQueryResult = Apollo.QueryResult<CompanyListQuery, CompanyListQueryVariables>;
export const FindCompaniesDocument = gql`
    query FindCompanies($partialName: String!) {
  findCompanies(partialName: $partialName) {
    id
    name
    sector
  }
}
    `;

/**
 * __useFindCompaniesQuery__
 *
 * To run a query within a React component, call `useFindCompaniesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindCompaniesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindCompaniesQuery({
 *   variables: {
 *      partialName: // value for 'partialName'
 *   },
 * });
 */
export function useFindCompaniesQuery(baseOptions: Apollo.QueryHookOptions<FindCompaniesQuery, FindCompaniesQueryVariables> & ({ variables: FindCompaniesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindCompaniesQuery, FindCompaniesQueryVariables>(FindCompaniesDocument, options);
      }
export function useFindCompaniesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindCompaniesQuery, FindCompaniesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindCompaniesQuery, FindCompaniesQueryVariables>(FindCompaniesDocument, options);
        }
export function useFindCompaniesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FindCompaniesQuery, FindCompaniesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindCompaniesQuery, FindCompaniesQueryVariables>(FindCompaniesDocument, options);
        }
export type FindCompaniesQueryHookResult = ReturnType<typeof useFindCompaniesQuery>;
export type FindCompaniesLazyQueryHookResult = ReturnType<typeof useFindCompaniesLazyQuery>;
export type FindCompaniesSuspenseQueryHookResult = ReturnType<typeof useFindCompaniesSuspenseQuery>;
export type FindCompaniesQueryResult = Apollo.QueryResult<FindCompaniesQuery, FindCompaniesQueryVariables>;