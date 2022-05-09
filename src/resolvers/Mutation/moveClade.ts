import { PREFIXES } from '../../lib/sparql-queries';

const moveCladeResolver = async (_, { id, newParentId }, { dataSources }) => {
  console.log('moveClade');
  console.log({ id, newParentId });

  const QUERY = `
    ${PREFIXES}
    DELETE {
        ?s rdfs:subClassOf ?o
    }
    INSERT {
        ?s rdfs:subClassOf ?newParent
    }
    WHERE {
        ?s peps:id '${id}' ;
            rdfs:subClassOf ?o .
        ?newParent peps:id '${newParentId}' .
    } 
  `;

  const response = await dataSources.sparqlClient.query.update(QUERY);
  console.log({ response });

  return { success: true };
};

export default moveCladeResolver;
