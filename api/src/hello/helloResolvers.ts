import {Company} from "../company/Company";

export const helloResolvers = {
    Query: {
        getHello: () => 'Hello from API! v5',
        getHello2: () => 'Hello from API! v500',
        getCompanies: async () => {
            const companies = await Company.query().execute();
            return companies
                .map((company) => `${company.id}: ${company.name}`);
        },
    }
};