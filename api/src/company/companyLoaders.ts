import {createLoader} from '../loader/loaderFactory';
import {CompanyModel, ID, NAME, SEARCHABLE_NAME} from './CompanyModel';

const paginatedCompaniesLoader = createLoader(async (pages: readonly number[]): Promise<string[][]> => {
    const pageSize = 100;
    const ranges = pages.map(page => [(page - 1) * pageSize, page * pageSize - 1]);

    const numberedCompaniesAlias = 'numbered_companies';
    const indexAlias = 'index_alias';

    type NumberedCompany = CompanyModel & {[indexAlias]: number};
    const rows = await CompanyModel.query()
        .with(numberedCompaniesAlias, CompanyModel.query()
            .select(ID, NAME, CompanyModel.raw('ROW_NUMBER() OVER (ORDER BY ??) as ??', [SEARCHABLE_NAME, indexAlias])),
        )

        .select(indexAlias, ID)
        .from(numberedCompaniesAlias)
        .orderBy(indexAlias)
        .where(qb => ranges.map(([min, max]) => qb.orWhereBetween(indexAlias, [min, max])))
        .execute() as NumberedCompany[];

    return ranges.map(([min, max]) => {
        return rows.filter((row) => row[indexAlias] >= min && row[indexAlias] <= max).map((row) => row.id);
    });
}, {
    cacheSize: 5,
});

export const loadCompanyIdsByPage = (page: number): Promise<string[]> => {
    return paginatedCompaniesLoader.load(+page);
};

const companyModelLoader = createLoader(async (ids: readonly string[]) => {
    const companies = await CompanyModel.query().findByIds(ids as string[]).execute();
    return ids.map(id => companies.find(company => company.id === id));
}, {
    cacheSize: 200,
});

export const loadCompany = (id: string): Promise<CompanyModel|undefined> => {
    return companyModelLoader.load(id);
};

const companyFinderLoader = createLoader(async (partialNames: readonly string[]): Promise<string[][]> => {
    const termAlias = 'term';
    const selectors = partialNames.map(term =>
        CompanyModel.query()
            .select(
                CompanyModel.raw('? as ??', [term, termAlias]),
                ID,
            )
            .whereRaw('?? LIKE \'%\' || ? || \'%\'', [SEARCHABLE_NAME, term])
            .orderBy(SEARCHABLE_NAME)
            .limit(25)
            .toKnexQuery(),
    );

    type CompanyWithTerm = CompanyModel & {[termAlias]: string};
    const rows: CompanyWithTerm[] = await CompanyModel.knex().unionAll(selectors, true);

    const buckets: Map<string, string[]> = new Map(partialNames.map(term => [term, []]));
    for (const row of rows) {
        buckets.get(row[termAlias])!.push(row.id);
    }

    return [...buckets.values()];
}, {
    cacheSize: 100,
});

export const findCompany = (partialName: string): Promise<string[]> => {
    if (partialName.length < 3) {
        throw new Error(`Search term must be at least 3 characters long`);
    }
    return companyFinderLoader.load(partialName.toLowerCase());
};
