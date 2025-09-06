const config = {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
        directory: './migrations',
        seed: './seeds',
        extension: 'ts',
        tableName: 'knex_migrations',
    },
};

export default config;

