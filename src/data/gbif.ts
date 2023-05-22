import { RESTDataSource } from 'apollo-datasource-rest';
import { v4 as uuidv4 } from 'uuid';

interface SpeciesResponse {
  key: number;
  canonicalName: string;
  vernacularName: string;
  basionym: string;
  authorship: string;
  publishedIn: string;
}

const getAuthorship = (authorship: string) => {
  const regex = /(\()?([^()\n]*), (\d{4})(\))?/;
  const matches = authorship.match(regex);
  return {
    name: matches ? matches[2] : authorship,
    year: matches ? parseInt(matches[3], 10) : null,
    isOriginalAuthor: !!(matches?.[1] && matches?.[4]),
  };
};

class GbifApi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.gbif.org/v1/';
  }

  async getClade({ id }: { id?: string }) {
    if (!id) return {};

    const response = await this.get(`species/${id}`);
    return GbifApi.cladeReducer(response);
  }

  static cladeReducer(clade: SpeciesResponse) {
    // console.log(clade);
    const source = { id: uuidv4(), name: clade.publishedIn };
    return {
      authorship: clade.authorship
        ? {
            ...getAuthorship(clade.authorship),
            sources: clade.publishedIn ? [source.id] : null,
          }
        : null,
      commonNames: clade.vernacularName ? [clade.vernacularName] : null,
      sources: clade.publishedIn ? [source] : null,
    };
  }
}

export default GbifApi;
