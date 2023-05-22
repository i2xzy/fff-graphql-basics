import { gql } from 'apollo-server';

export default gql`
  type NodeBasic {
    id: ID
    name: String
    extant: Boolean
    leaves: Int
  }

  type Attributes {
    id: ID
    extant: Boolean
    hasChildren: Boolean
    leaves: Int
    lineage: [NodeBasic]
    parentId: ID
  }

  type Node {
    id: ID
    name: String
    children: [Node]
    attributes: Attributes
  }
`;
