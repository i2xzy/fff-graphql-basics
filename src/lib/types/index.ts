import GbifApi from '../../data/gbif';
import GithubAPI from '../../data/github';
import TreeAPI from '../../data/tree';
import WikiSpeciesApi from '../../data/wikispecies';

export interface ContextType {
  dataSources: {
    treeAPI: TreeAPI;
    wikiSpeciesAPI: WikiSpeciesApi;
    gbifAPI: GbifApi;
    githubAPI: GithubAPI;
  };
  token: string;
  email: string;
  isEditor: boolean;
  isDevTeam: boolean;
}
