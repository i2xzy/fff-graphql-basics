const cladeResolver = async (_, { id }, { dataSources }) => {
  console.log('cladeResolver', id);

  const result = await dataSources.githubAPI.getCladeFile({ id });
  console.log('cladeResolver result', result);

  return result;
};

export default cladeResolver;
