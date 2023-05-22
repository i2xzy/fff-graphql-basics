import { gql } from 'apollo-server';

export default gql`
  input CharacteristicInput {
    name: String
    value: Boolean
  }

  input AuthorshipInput {
    name: String
    year: Int
    isOriginalAuthor: Boolean
    source: [ID]
  }

  input CladeInput {
    name: String
    rank: String
    extant: Boolean
    synonyms: [String]
    commonNames: [String]
    parentId: ID
    source: [String]
    characteristics: [CharacteristicInput]
    imageUrl: String
    authorship: AuthorshipInput
  }

  type Source {
    id: ID
    name: String
  }

  type Characteristic {
    name: String
    value: Boolean
  }

  type Authorship {
    name: String
    year: Int
    isOriginalAuthor: Boolean
    sources: [ID]
  }

  type CladeBasic {
    id: ID
    name: String
    extant: Boolean
    leaves: Int
    rank: String
  }

  type Clade {
    version: String
    name: String
    id: ID
    rank: String
    extant: Boolean
    hasChildren: Boolean
    leaves: Int
    synonyms: [String]
    commonNames: [String]
    lineage: [CladeBasic]
    parentId: ID
    dataSources: [String]
    sources: [Source]
    characteristics: [Characteristic]
    imageUrl: String
    children: [CladeBasic]
    authorship: Authorship
  }
`;
