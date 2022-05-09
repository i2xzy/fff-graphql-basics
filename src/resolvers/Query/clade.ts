import { uniq } from 'lodash';
import { PREFIXES } from '../../lib/sparql-queries';

const cladeResolver = async (_, { id }, { sparqlClient }) => {
  console.log('clade');
  console.log({ id });

  const getClade = async (id: string) => {
    const QUERY_CLADE = `
      ${PREFIXES}
      SELECT ?id ?name ?rank ?isFlying ?parentId ?source ?imageUrl
      WHERE {
        ?s peps:id ?id ;
           skos:prefLabel ?name ;
           rdfs:subClassOf/peps:id ?parentId .
        OPTIONAL { ?s peps:rank/skos:prefLabel ?rank . }
        OPTIONAL { ?s peps:isFlying ?isFlyingOptional . }
        OPTIONAL { ?s peps:source ?source . }
        OPTIONAL { ?s peps:imageURL ?imageUrl . }
        BIND ('${id}' AS ?id)
        BIND ( IF (bound(?isFlyingOptional), ?isFlyingOptional, 'false') as ?isFlying)
      }
      LIMIT 10
  `;

    return sparqlClient.query.select(QUERY_CLADE);
  };

  const bindings = await getClade(id);

  if (!bindings || !bindings.length) return null;

  const result = bindings.reduce((acc, item) => {
    console.log(item);
    return {
      ...acc,
      name: item.name.value,
      id: item.id.value,
      parentId: item.parentId.value,
      characteristics: [
        { name: 'isFlying', value: item.isFlying.value === 'true' },
      ],
      rank: item.rank.value,
      imageUrl: item.imageUrl?.value || null,
      sources: item.source
        ? uniq([...(acc.source || []), item.source.value])
        : [],
    };
  }, {});

  return result;
};

export default cladeResolver;
