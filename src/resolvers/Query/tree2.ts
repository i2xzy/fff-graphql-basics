import { PREFIXES } from '../../lib/sparql-queries';
import { cladeReducer } from './cladeReducer';

const QUERY_PROPERTIES = `
  ${PREFIXES}
  SELECT DISTINCT ?property ?value WHERE {
    ?s ?property ?value .
  } LIMIT 100
`;

const tree2Resolver = async (_, { id: rootId }, { sparqlClient }) => {
  console.log(rootId);
  const getClade = async (id: string, hasLineage?: boolean) => {
    const QUERY_CLADE = `
      ${PREFIXES}
      SELECT ?id ?name ?rank ?hasChildren ?children ?isFlying ?parentId
      WHERE {
        ?s peps:id ?id ;
           skos:prefLabel ?name .
        OPTIONAL { ?s rdfs:subClassOf/peps:id ?parentId . }
        ${
          hasLineage
            ? 'OPTIONAL { ?s rdfs:subClassOf+/peps:id ?ancestor . }'
            : ''
        }
        OPTIONAL { ?s peps:rank/skos:prefLabel ?rank . }
        OPTIONAL { ?s peps:isFlying ?isFlyingOptional . }
        OPTIONAL { ?s ^rdfs:subClassOf/peps:id ?children . }
        BIND ('${id}' AS ?id)
        BIND (bound(?children) AS ?hasChildren)
        BIND ( IF (bound(?isFlyingOptional), ?isFlyingOptional, 'false') as ?isFlying)
      }
      LIMIT 10
  `;

    return sparqlClient.query.select(QUERY_CLADE);
  };

  const bindings = await getClade(rootId);

  // console.log(bindings);

  if (!bindings || !bindings.length) return null;

  const result = await cladeReducer(bindings, getClade, 3);

  // console.log({ result });

  return result;
};

export default tree2Resolver;
