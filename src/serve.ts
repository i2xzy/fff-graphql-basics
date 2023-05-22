import { ApolloServer } from 'apollo-server';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import typeDefs from './types';
import resolvers from './resolvers';

import TreeAPI from './data/tree';
import GithubAPI from './data/github';
import WikiSpeciesApi from './data/wikispecies';
import GbifApi from './data/gbif';

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization?.split(' ')[1] || '';
    const decoded = jwt.decode(token, { json: true });
    const isEditor = decoded?.['cognito:groups']?.includes('editor');
    const isDevTeam = decoded?.['cognito:groups']?.includes('devTeam');
    return {
      token,
      email: decoded?.email || '',
      isEditor,
      isDevTeam,
    };
  },
  dataSources: () => ({
    treeAPI: new TreeAPI(),
    githubAPI: new GithubAPI(),
    wikiSpeciesAPI: new WikiSpeciesApi(),
    gbifAPI: new GbifApi(),
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
