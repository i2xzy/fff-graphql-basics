import { ApolloServer } from 'apollo-server';
import SparqlClient from 'sparql-http-client/ParsingClient';
import typeDefs from './types';
import resolvers from './resolvers';

import TreeAPI from './data/tree';
import { verifyToken } from './authentication';

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => {
		const token = req.headers.authorization;
		return verifyToken(token).then(() => ({
			token: req.headers.authorization || '',
			sparqlClient: new SparqlClient({
				endpointUrl:
					'http://85.214.211.33:9999/blazegraph/namespace/pep_test_repo/sparql',
				updateUrl:
					'http://85.214.211.33:9999/blazegraph/namespace/pep_test_repo/sparql',
			})
		}));
	},
	dataSources: () => ({
		treeAPI: new TreeAPI(),
	}),
	engine: {
		apiKey: process.env.ENGINE_API_KEY,
	},
	introspection: true,
	playground: true,
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});
