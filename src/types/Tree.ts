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

  type Characteristic {
    name: String
    value: Boolean
  }

  type NodeBasic {
    id: ID
    name: String
    extant: Boolean
    leaves: Int
  }

  type Attributes {
    id: ID
    rank: String
    extant: Boolean
    hasChildren: Boolean
    leaves: Int
    synonyms: [String]
    lineage: [NodeBasic]
    parentId: ID
    sources: [String]
    characteristics: [Characteristic]
  }

  type Node {
    id: ID
    name: String
    children: [Node]
    attributes: Attributes
  }

  type Clade {
    name: String
    id: ID
    rank: String
    extant: Boolean
    hasChildren: Boolean
    leaves: Int
    synonyms: [String]
    lineage: [NodeBasic]
    parentId: ID
    sources: [String]
    characteristics: [Characteristic]
    imageUrl: String
    children: [NodeBasic]
  }
`;
