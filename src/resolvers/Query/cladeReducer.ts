import { uniq, uniqBy } from 'lodash';

type Node = {
  [key: string]: { value: string };
};

type Clade = {
  id: string;
  name?: string;
  children: Clade[];
  attributes: {
    id: string;
    hasChildren?: boolean;
    parentId?: string;
    characteristics?: { name: string; value: boolean }[];
    rank?: string;
    source?: string[];
  };
};

const cladeReducer = async (
  clade: Node[],
  getNode: (id: string) => Promise<Node[]>,
  depth = 3
): Promise<Clade> => {
  const result = clade.reduce(
    (acc, item) => {
      const children =
        item.children && depth > 1
          ? uniqBy(
              [
                ...(acc.children || []),
                { attributes: { id: item.children.value } },
              ],
              'attributes.id'
            )
          : [];

      return {
        ...acc,
        id: item.id?.value,
        name: item.name?.value,
        children,
        attributes: {
          ...acc.attributes,
          id: item.id?.value,
          hasChildren: item.hasChildren?.value === 'true',
          parentId: item.parentId?.value,
          characteristics: [
            { name: 'isFlying', value: item.isFlying?.value === 'true' },
          ],
          rank: item.rank?.value,
          source: item.source
            ? uniq([...(acc.attributes.source || []), item.source?.value])
            : [],
        },
      };
    },
    { attributes: {}, children: [] } as Clade
  );

  return {
    ...result,
    children: await Promise.all(
      result.children.map(async child => {
        const node = await getNode(child.attributes.id);
        return cladeReducer(node, getNode, depth - 1);
      })
    ),
  };
};

export default cladeReducer;
