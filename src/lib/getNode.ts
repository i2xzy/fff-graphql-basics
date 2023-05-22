interface Data {
  id: string;
  name: string;
  children?: Data[];
  attributes?: any;
}

interface NodeSimple {
  id: string;
  name: string;
}

interface Node {
  id: string;
  name: string;
  children?: NodeSimple[];
  parentId?: string;
  lineage?: NodeSimple[];
}

// get list of nodes from tree
const getNodesFromTree = (data: Data): Node[] =>
  data.children?.reduce((acc, item) => {
    const lineage = [
      { id: data.id, name: data.name },
      ...(data.attributes.lineage || []),
    ];
    const children = item.children
      ? getNodesFromTree({
          ...item,
          attributes: { ...item.attributes, lineage },
        })
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

const getNodes = (data: Data): Node[] => {
  const nodes = getNodesFromTree(data);
  return [
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
  ];
};

export default getNodes;
