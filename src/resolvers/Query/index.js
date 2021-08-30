import tree2 from './tree2';
import search2 from './search2';
import mrca2 from './mrca2';

export default {
  tree: (_, { id, depth }, { dataSources }) =>
    dataSources.treeAPI.getTree({ id, depth }),
  clade: (_, { id }, { dataSources }) => dataSources.treeAPI.getClade({ id }),
  search: (_, { value }, { dataSources }) =>
    dataSources.treeAPI.searchClade({ value }),
  mrca: (_, { clade1, clade2 }, { dataSources }) =>
    dataSources.treeAPI.mrca({ clade1, clade2 }),

  tree2,
  search2,
  mrca2,
};
