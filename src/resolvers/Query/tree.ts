// import getNodes from '../../lib/getNode';
import { ContextType } from '../../lib/types';

const treeResolver = async (
  _: any,
  { id, depth }: { id: string; depth: number },
  { dataSources, email, isEditor, isDevTeam }: ContextType
) => {
  const canEdit = isEditor || isDevTeam;
  console.log({ email });
  // const branchName = 'test-branch-edit';
  // const hasBranch = await dataSources.githubAPI.hasBranch(branchName);
  const branch = canEdit ? email : 'main';

  if (canEdit) {
    // update branch
    await dataSources.githubAPI.getOrCreateBranch({ branch });
  }

  const data = await dataSources.githubAPI.getTreeFile({ branch, id });

  if (data) {
    return data;
  }

  console.log('no data found, fetching from ott');

  const ottData = await dataSources.treeAPI.getTree({ id, depth });

  // write to github
  // await dataSources.githubAPI.upsertTreeFile({ id, data: ottData, branch });
  // const nodes = getNodes(ottData);
  // const sha = await dataSources.githubAPI.getOrCreateBranch(branch);
  // await dataSources.githubAPI.updateMultipleFiles(branch, sha, nodes);

  return ottData;
};

export default treeResolver;
