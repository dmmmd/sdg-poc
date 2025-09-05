import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import {getTypeDefs} from "./graphql/schema";
import {getResolvers} from "./graphql/resolvers";
import {logInfo} from "./logger/loggerFacade";

const PORT: number = process.env.PORT ? Number(process.env.PORT) : 4000;

async function startServer() {
    const typeDefs = getTypeDefs();
    const resolvers = getResolvers();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });
    const { url } = await startStandaloneServer(server, {
        listen: { port: PORT },
    });
    logInfo(`🚀 API ready at: ${url}`);
}

startServer().catch(err => {
    console.log(err);
    process.exit(1);
});