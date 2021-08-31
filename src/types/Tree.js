import { gql } from 'apollo-server';

export default gql`
  input AttributeInput {
    name: String
    value: Boolean
  }

  input CladeInput {
    name: String
    rank: String
    extant: Boolean
    synonyms: [String]
    parentId: ID
    source: [String]
    attributes: [AttributeInput]
  }

  type Attributes {
    id: ID
    rank: String
    extant: Boolean
    hasChildren: Boolean
    leaves: Int
    synonyms: [String]
    lineage: [Clade]
    parentId: ID
    source: [String]
  }

  type Clade {
    name: String
    children: [Clade]
    attributes: Attributes
  }
`;
