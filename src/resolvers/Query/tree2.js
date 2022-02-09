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
      SELECT ?id ?name ?hasChildren ?children ?parentId
      WHERE {
        ?s peps:id ?id ;
           skos:prefLabel ?name ;
           rdfs:subClassOf/peps:id ?parentId .
        OPTIONAL { ?s ^rdfs:subClassOf/peps:id ?children . }
        BIND ('${id}' AS ?id)
        BIND (bound(?children) AS ?hasChildren)
      }
  `;

    return dataSources.sparqlClient.query.select(QUERY_CLADE);
  };

  // console.log(bindings);

  // const isTooFar = true;

  const cladeReducer = depth => async rootId => {
    const clade = await getClade(rootId);
    if (!clade || !clade.length) return null;

    return clade.reduce((acc, item) => {
      console.log({ depth });
      // console.log({ item });
      return {
        ...acc,
        name: item.name.value,
        attributes: {
          id: item.id.value,
          hasChildren: item.hasChildren.value === 'true',
          parentId: item.parentId.value,
        },
        children:
          depth > 2 || item.hasChildren.value === 'false'
            ? null
            : [
                ...(acc.children || []),
                cladeReducer(depth + 1)(item.children.value),
              ],
      };
    }, {});
  };

  const result = await cladeReducer(0)(rootId);

  // console.log({ result });

  return result;
};

export default tree2Resolver;
