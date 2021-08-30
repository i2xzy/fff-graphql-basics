import { PREFIXES } from '../../lib/sparql-queries';

const search2Resolver = async (_, { value }, { dataSources }) => {
  console.log('search2');
  console.log({ value });

  const QUERY_CLADE = `
    ${PREFIXES}
    SELECT ?id ?name
    WHERE {
      ?s peps:id ?id ;
         skos:prefLabel ?name ;
      FILTER regex(?name, "^${value}}", "i")
    }
    LIMIT 10
  `;

  const bindings = await dataSources.sparqlClient.query.select(QUERY_CLADE);

  if (!bindings || !bindings.length) return null;

  const result = bindings.map(row => ({
    id: row.id.value,
    name: row.name.value,
  }));

  return result;
};

export default search2Resolver;
