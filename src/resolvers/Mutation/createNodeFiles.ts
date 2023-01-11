interface Node {
  id: string;
  name: string;
  children?: Node[];
  attributes?: any;
}

// get list of nodes from tree
const getNodes = (data: Node): Node[] =>
  data.children?.reduce((acc, item) => {
    const lineage = [
      { id: data.id, name: data.name },
      ...(data.attributes.lineage || []),
    ];
    const children = item.children
      ? getNodes({ ...item, attributes: { ...item.attributes, lineage } })
      : [];
    return [
      ...acc,
      {
        id: item.id,
        name: item.name,
        ...item.attributes,
        parentId: data.id,
        lineage,
        children:
          item.children?.map(child => ({ id: child.id, name: child.name })) ||
          [],
      },
      ...children,
    ];
  }, []);

const createNodeFiles = async (_, { id }, { dataSources }) => {
  const data = await dataSources.githubAPI.getTreeFile({ id });
  console.log(data);

  const nodes = getNodes(data);
  console.log(nodes);

  await dataSources.githubAPI.writeNodeFiles({
    files: [
      {
        id: data.id,
        name: data.name,
        ...data.attributes,
        parentId: data.attributes.lineage[0]?.id,
        children: data.children.map(child => ({
          id: child.id,
          name: child.name,
        })),
      },
      ...nodes,
    ],
  });

  // const sha = await dataSources.githubAPI.getOrCreateBranch('test-branch');

  // await dataSources.githubAPI.updateMultipleFiles('test-branch', sha, nodes);

  return { success: true };
};

export default createNodeFiles;
