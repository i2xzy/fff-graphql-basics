import { PREFIXES } from '../../lib/sparql-queries';

const mrca2Resolver = async (_, { clade1, clade2 }, { dataSources }) => {
  console.log('mrca2Resolver');
  const QUERY_MRCA = `
    ${PREFIXES}
    SELECT DISTINCT ?id ?name
    WHERE {
      ?lastCommonAncestor skos:prefLabel ?name ;
                          peps:id ?id ;
                          ^rdfs:subClassOf ?interNode1 ;
                          ^rdfs:subClassOf ?interNode2 .
      ?interNode1 ^rdfs:subClassOf+/peps:id '${clade1}' .
      ?interNode2 ^rdfs:subClassOf+/peps:id '${clade2}' .
      FILTER (?interNode1 != ?interNode2)
    }
  `;

  const [row] = await dataSources.sparqlClient.query.select(QUERY_MRCA);

  console.log(row);

  if (!row) return null;

  return {
    id: row.id.value,
    name: row.name.value,
  };
};

export default mrca2Resolver;
