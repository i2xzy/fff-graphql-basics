import { ContextType } from '../../lib/types';

const updateCladeResolver = async (
  _: any,
  { id, data }: { id: string; data: any },
  { dataSources }: ContextType
) => {
  console.log('updateClade');
  console.log(data);

  const branch = 'test-branch-edit';

  await dataSources.githubAPI.getOrCreateBranch({ branch });

  // get the current clade from github
  const currentClade = await dataSources.githubAPI.getCladeFile({ branch, id });

  if (currentClade) {
    // update the current clade with the new data
    const updatedClade = { ...currentClade, ...data };
    console.log('updatedClade', updatedClade);

    // write the updated clade to github
    await dataSources.githubAPI.upsertNodeFile({
      id,
      data: updatedClade,
      branch,
    });

    // if display information has changed
    if (data.name && data.name !== currentClade.name) {
      // update or create ancestor tree files
      // await dataSources.githubAPI.updateAncestorTreeFiles({
      //   id,
      //   data: updatedClade,
      // });
      // update parent node file
      // await dataSources.githubAPI.updateParentNodeFile({
      //   id,
      //   data: updatedClade,
      // });
    }
  }

  // get ott data
  // const ottData = await dataSources.treeAPI.getClade({ id });
  // write to github
  // const updatedClade = { ...ottData, ...data };
  // await dataSources.githubAPI.upsertNodeFile({ id, data: updatedClade, branch });

  return { success: true };
};

export default updateCladeResolver;
