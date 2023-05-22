import { gql } from 'apollo-server';

export default gql`
  type Query {
    tree(id: ID, depth: Int): Node
    clade(id: ID!): Clade
    search(value: String!): [SearchResult]
    mrca(clade1: String!, clade2: String!): MrcaResult
    images(name: String!): [Image]

    # sparql
    search2(value: String!): [SearchResult]
    mrca2(clade1: String!, clade2: String!): MrcaResult
  }

  type SearchResult {
    id: ID
    name: String
  }

  type MrcaResult {
    id: ID
    name: String
  }

  type Image {
    title: String
    url: String
    width: Int
    height: Int
  }
`;
