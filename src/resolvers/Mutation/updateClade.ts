import { PREFIXES } from '../../lib/sparql-queries';

const updateCladeResolver = async (_, { id, data }, { sparqlClient }) => {
  console.log('updateClade');
  console.log(data);

  const attribute = data.attributes[0];

  const QUERY = `
    ${PREFIXES}
    DELETE {
        ?s peps:${attribute.name} ?o
    }
    INSERT {
        ?s peps:${attribute.name} '${attribute.value}'
    }
    WHERE {
        ?s peps:id '${id}' .
        OPTIONAL { ?s peps:${attribute.name} ?o . }
    } 
  `;

  const response = await sparqlClient.query.update(QUERY);
  console.log({ response });

  return { success: true };
};

export default updateCladeResolver;
