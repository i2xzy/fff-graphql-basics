import { RESTDataSource } from 'apollo-datasource-rest';

class WikiSpeciesApi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://species.wikimedia.org/w/';
  }

  async findImagesByName({ name }) {
    // console.log('findImagesByName', name);
    const params = {
      action: 'query',
      prop: 'imageinfo',
      generator: 'search',
      gsrsearch: `File:"${name}" NOT map NOT atlas NOT lineage NOT svg NOT phylogram NOT cladogram NOT Destroy_this_mad_brute NOT Classification NOT Anatomical_Man`,
      format: 'json',
      origin: '*',
      iiprop: 'url|size',
    };
    const response = await this.get('api.php', params);

    if (!response.query) return [];

    const images: any[] = Object.values(response.query.pages);
    // console.log(images[0]);

    return images
      .filter(r => r.title.match(/\.(gif|png|jpe?g|svg)$/))
      .map(page => ({
        title: page.title,
        url: page.imageinfo[0].url,
        width: page.imageinfo[0].width,
        height: page.imageinfo[0].height,
      }));
  }
}

export default WikiSpeciesApi;
