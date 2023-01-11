const tree2Resolver = async (_, { id }, { dataSources }) => {
  // const endpoint = `https://raw.githubusercontent.com/phylogeny-explorer/phylogeny-index/main/${id}-tree.yml`;
  // const response = await fetch(endpoint);
  // const data = await response.text();
  const data = await dataSources.githubAPI.getTreeFile({ id });

  return data;
};

export default tree2Resolver;
