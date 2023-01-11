import { gql } from 'apollo-server';

export default gql`
  type Mutation {
    addClade(data: CladeInput!): MutationResponse
    updateClade(id: ID!, data: CladeInput!): MutationResponse
    moveClade(id: ID!, newParentId: ID!): MutationResponse
    deleteClade(id: ID!): MutationResponse

    createNodeFiles(id: ID!): MutationResponse
  }

  type MutationResponse {
    success: Boolean
  }
`;
