import { RESTDataSource } from 'apollo-datasource-rest';

class TreeAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.opentreeoflife.org/v3/';
  }

  async getTree({ id, depth }) {
    const response = await this.post('tree_of_life/subtree', {
      node_id: id,
      format: 'arguson',
      height_limit: depth,
    });
    return this.cladeReducer(response.arguson);
  }

  async getClade({ id }) {
    const response = await this.post('tree_of_life/node_info', {
      node_id: id,
      include_lineage: true,
    });
    return this.cladeReducer(response);
  }

  async searchClade({ value }) {
    const response = await this.post('tnrs/autocomplete_name', {
      name: value,
      // include_suppressed: true,
    });
    return response.map((result) => this.searchResultReducer(result));
  }

  cladeReducer(clade) {
    const name = clade.taxon
      ? clade.taxon.name
      : clade.descendant_name_list && clade.descendant_name_list.join(' and ');
    return {
      ...clade,
      ...clade.taxon,
      name,
      id: clade.node_id,
      leaves: clade.num_tips,
      hasChildren: clade.num_tips > 0,
      children:
        clade.children && clade.children.map((node) => this.cladeReducer(node)),
      lineage:
        clade.lineage && clade.lineage.map((node) => this.cladeReducer(node)),
      parentId: clade.lineage && clade.lineage[0] && clade.lineage[0].node_id,
      extant: !(clade.flags && clade.flags.includes('extinct')),
    };
  }

  searchResultReducer(result) {
    return {
      id: `ott${result.ott_id}`,
      name: result.unique_name,
    };
  }
}

export default TreeAPI;
