import { reduce, uniq, uniqBy } from 'lodash';
import { PREFIXES } from '../../lib/sparql-queries';

const QUERY_PROPERTIES = `
  ${PREFIXES}
  SELECT DISTINCT ?property ?value WHERE {
    ?s ?property ?value .
  } LIMIT 100
`;

const tree2Resolver = async (_, { id: rootId }, { dataSources }) => {
  const getClade = async id => {
    const QUERY_CLADE = `
      ${PREFIXES}
      SELECT ?id ?name ?source ?hasChildren ?children ?isFlying ?parentId
      WHERE {
        ?s peps:id ?id ;
           skos:prefLabel ?name ;
           rdfs:subClassOf/peps:id ?parentId .
        OPTIONAL { ?s peps:rank/skos:prefLabel ?rank . }
        OPTIONAL { ?s peps:source ?source . }
        OPTIONAL { ?s peps:isFlying ?isFlyingOptional . }
        OPTIONAL { ?s ^rdfs:subClassOf/peps:id ?children . }
        BIND ('${id}' AS ?id)
        BIND (bound(?children) AS ?hasChildren)
        BIND ( IF (bound(?isFlyingOptional), ?isFlyingOptional, 'false') as ?isFlying)
      }
  `;

    return dataSources.sparqlClient.query.select(QUERY_CLADE);
  };

  const bindings = await getClade(rootId);

  console.log(bindings);

  if (!bindings || !bindings.length) return null;

  // const isTooFar = true;

  const cladeReducer = async clade => {
    return clade.reduce((acc, item) => {
      // console.log({ item });
      return {
        ...acc,
        id: item.id.value,
        name: item.name.value,
        hasChildren: item.hasChildren.value === 'true',
        parentId: item.parentId.value,
        attributes: [
          { name: 'isFlying', value: item.isFlying.value === 'true' },
        ],
        source: uniq([...(acc.source || []), item.source.value]),
        children: uniqBy(
          [...(acc.children || []), { id: item.children.value }],
          'id'
        ),
      };
    }, {});
  };

  const result = await cladeReducer(bindings);

  // console.log({ result });

  return result;
};

export default tree2Resolver;
