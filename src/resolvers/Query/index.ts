import tree from './tree';
import search2 from './search2';
import mrca2 from './mrca2';
import clade from './clade';

export default {
  tree,
  clade,
  search: (_, { value }, { dataSources }) =>
    dataSources.treeAPI.searchClade({ value }),
  mrca: (_, { clade1, clade2 }, { dataSources }) =>
    dataSources.treeAPI.mrca({ clade1, clade2 }),

  images: (_, { name }, { dataSources }) =>
    dataSources.wikiSpeciesAPI.findImagesByName({ name }),

  search2,
  mrca2,
};
