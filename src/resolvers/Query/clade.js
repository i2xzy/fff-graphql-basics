import { reduce, uniq, uniqBy } from 'lodash';
import { PREFIXES } from '../../lib/sparql-queries';

const cladeResolver = async (_, { id }, { dataSources }) => {
  const QUERY_CLADE = `
      ${PREFIXES}
      SELECT ?id ?name ?rank ?source ?imageUrl ?isFlying ?parentId
      WHERE {
        ?s peps:id ?id ;
           skos:prefLabel ?name ;
           rdfs:subClassOf/peps:id ?parentId .
        OPTIONAL { ?s peps:rank/skos:prefLabel ?rank . }
        OPTIONAL { ?s peps:source ?source . }
        OPTIONAL { ?s peps:imageURL ?imageUrl . }
        OPTIONAL { ?s peps:isFlying ?isFlyingOptional . }
        BIND ('${id}' AS ?id)
        BIND ( IF (bound(?isFlyingOptional), ?isFlyingOptional, 'false') as ?isFlying)
      }`;

  const bindings = await dataSources.sparqlClient.query.select(QUERY_CLADE);

  console.log(bindings);

  if (!bindings || !bindings.length) return null;

  const result = bindings.reduce((acc, item) => {
    // console.log({ item });
    return {
      ...acc,
      id: item.id.value,
      name: item.name.value,
      rank: item.rank.value,
      parentId: item.parentId.value,
      imageUrl: item.imageUrl && item.imageUrl.value,
      characteristics: [
        { name: 'isFlying', value: item.isFlying.value === 'true' },
      ],
      source: uniq([...(acc.source || []), item.source.value]),
    };
  }, {});

  // console.log({ result });

  return result;
};

export default cladeResolver;
