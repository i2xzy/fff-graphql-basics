import { ContextType } from '../../lib/types';

const FILE_VERSION = '1.1.2';

const cladeResolver = async (
  _: any,
  { id }: { id: string },
  { dataSources, email, isEditor, isDevTeam }: ContextType
) => {
  console.log('cladeResolver', id);
  const canEdit = isEditor || isDevTeam;
  console.log({ email });

  // use user email as branch name
  // const branchName = 'test-branch-edit';
  // get branch
  // const hasBranch = await dataSources.githubAPI.hasBranch({
  //   branch: branchName,
  // });
  // const branch = hasBranch ? branchName : 'main';

  const branch = canEdit ? email : 'main';

  if (canEdit) {
    // update branch
    await dataSources.githubAPI.getOrCreateBranch({ branch });
  }

  // get clade file
  const result = await dataSources.githubAPI.getCladeFile({ branch, id });
  // console.log('cladeResolver result', result);

  if (result && result.version === FILE_VERSION) {
    return result;
  }

  console.log('no data found, fetching from ott');

  const ottData = await dataSources.treeAPI.getClade({ id });
  // console.log('cladeResolver ottData', ottData);

  if (!ottData) {
    return null;
  }

  const images = await dataSources.wikiSpeciesAPI.findImagesByName({
    name: ottData.name,
  });
  const imageUrl = images.length > 0 ? images[0].url : null;

  const gbifId = ottData.dataSources
    ?.find(s => s.startsWith('gbif'))
    ?.split(':')[1];
  // console.log('gbifId', gbifId);
  const gbifData = await dataSources.gbifAPI.getClade({ id: gbifId });
  // console.log('gbifData', gbifData);

  const data = {
    version: FILE_VERSION,
    ...ottData,
    imageUrl,
    ...gbifData,
  };

  // write to github main branch
  dataSources.githubAPI.upsertNodeFile({ id, data, branch: 'main' });

  // try to merge main into user branch
  dataSources.githubAPI.mergeBranch({ base: branch, head: 'main' });

  return data;
};

export default cladeResolver;
