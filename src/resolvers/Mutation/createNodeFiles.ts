import getNodes from '../../lib/getNode';
import { ContextType } from '../../lib/types';

const createNodeFiles = async (
  _: any,
  { id }: { id: string },
  { dataSources }: ContextType
) => {
  const branch = 'test-branch';
  const data = await dataSources.githubAPI.getTreeFile({ branch, id });
  console.log(data);

  const nodes = getNodes(data);
  console.log(nodes);

  const sha = await dataSources.githubAPI.getOrCreateBranch({ branch });

  await dataSources.githubAPI.updateMultipleFiles(branch, sha, nodes);

  return { success: true };
};

export default createNodeFiles;
