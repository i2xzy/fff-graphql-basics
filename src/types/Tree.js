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

  type Attribute {
    name: String
    value: Boolean
  }

  type Clade {
    id: ID
    name: String
    rank: String
    extant: Boolean
    children: [Clade]
    hasChildren: Boolean
    leaves: Int
    synonyms: [String]
    lineage: [Clade]
    parentId: ID
    source: [String]
    attributes: [Attribute]
  }
`;
