import { RESTDataSource } from 'apollo-datasource-rest';

interface CladeReducerResult {
  id: string;
  name: string;
  rank?: string;
  extant?: boolean;
  leaves?: number;
  dataSources?: string[];
  hasChildren?: boolean;
  parentId?: string;
  lineage?: CladeReducerResult[];
  children?: CladeReducerResult[];
}

class TreeAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.opentreeoflife.org/v3/';
  }

  async getTree({ id, depth }: { id: string; depth: number }) {
    const response = await this.post('tree_of_life/subtree', {
      node_id: id,
      format: 'arguson',
      height_limit: depth,
      include_lineage: true,
    });
    return this.nodeReducer(response.arguson);
  }

  async getClade({ id }: { id: string }) {
    try {
      const response = await this.post('tree_of_life/subtree', {
        node_id: id,
        format: 'arguson',
        height_limit: 1,
        include_lineage: true,
      });
      // console.log('getClade response', response);
      return this.cladeReducer(response.arguson);
    } catch (error) {
      console.log('getClade error', error);
      return null;
    }
  }

  async searchClade({ value }: { value: string }) {
    const response = await this.post('tnrs/autocomplete_name', {
      name: value,
      // include_suppressed: true,
    });
    return response.map(result => ({
      id: `ott${result.ott_id}`,
      name: result.unique_name,
    }));
  }

  async mrca({ clade1, clade2 }: { clade1: string; clade2: string }) {
    const response = await this.post('tree_of_life/mrca', {
      node_ids: [clade1, clade2],
    });
    const taxon = response.mrca.taxon || response.nearest_taxon;
    return {
      id: taxon.ott_id,
      name: taxon.name,
    };
  }

  static getName(clade: any) {
    if (clade.taxon) {
      return clade.taxon.name;
    }
    if (clade.descendant_name_list) {
      return clade.descendant_name_list.join(' and ');
    }
    return null;
  }

  cladeReducer(clade: any, isMini = false): CladeReducerResult {
    const taxon = {
      id: clade.node_id,
      name: TreeAPI.getName(clade),
      rank: clade.taxon?.rank,
      extant: !clade.extinct,
      leaves: clade.num_tips,
    };
    return isMini
      ? taxon
      : {
          ...taxon,
          dataSources: clade.taxon?.tax_sources,
          hasChildren: clade.num_tips > 0,
          parentId: clade.lineage?.[0]?.node_id,
          lineage: clade.lineage?.map(node => this.cladeReducer(node, true)),
          children: clade.children?.map(node => this.cladeReducer(node, true)),
        };
  }

  nodeReducer(clade: any) {
    return {
      id: clade.node_id,
      name: TreeAPI.getName(clade),
      attributes: {
        id: clade.node_id,
        leaves: clade.num_tips,
        hasChildren: clade.num_tips > 0,
        extant: !clade.extinct,
        rank: clade.taxon?.rank,
        lineage:
          clade.lineage &&
          clade.lineage.map(node => ({
            id: node.node_id,
            name: TreeAPI.getName(node),
            extant: !node.extinct,
          })),
      },
      children:
        clade.children && clade.children.map(node => this.nodeReducer(node)),
    };
  }
}

export default TreeAPI;
