import { gql } from 'apollo-server';

export default gql`
  type Query {
    tree(id: ID, depth: Int): Node
    clade(id: ID!): Clade
    search(value: String!): [SearchResult]
    mrca(clade1: String!, clade2: String!): MrcaResult

    # sparql
    tree2(id: ID, depth: Int): Node
    clade2(id: ID!): Clade
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
`;
