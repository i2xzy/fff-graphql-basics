import { RESTDataSource } from 'apollo-datasource-rest';
import { Octokit } from '@octokit/rest';
import { parse, stringify } from 'yaml';

const OWNER = 'phylogeny-explorer';
const REPO = 'phylogeny-index';

const fileContentReducer = (raw: string) => {
  const buffer = Buffer.from(raw, 'base64');
  return parse(buffer.toString());
};

class GithubAPI extends RESTDataSource {
  octokit: Octokit;

  constructor() {
    super();
    this.baseURL = 'https://api.github.com/';
    this.octokit = new Octokit({
      auth: process.env.GITHUB_ACCESS_TOKEN,
    });
  }

  async getFile({ path }) {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner: OWNER,
        repo: REPO,
        path,
        type: 'file',
      });
      if (Array.isArray(data)) {
        return null;
      }
      return data;
    } catch (err) {
      if (err.status === 404) {
        return null;
      }
      throw err;
    }
  }

  async getTreeFile({ id }) {
    const data = await this.getFile({ path: `${id}-tree.yml` });
    if (data && 'content' in data) {
      return fileContentReducer(data.content);
    }
    return null;
  }

  async getCladeFile({ id }) {
    const data = await this.getFile({ path: `${id}-info.yml` });
    if (data && 'content' in data) {
      return fileContentReducer(data.content);
    }
    return null;
  }

  async getCladeFileSha({ id }) {
    const data = await this.getFile({ path: `${id}-info.yml` });
    if (data && 'sha' in data) {
      return data.sha;
    }
    return null;
  }

  async writeNodeFile({ data }) {
    const sha = await this.getCladeFileSha({ id: data.id });

    const content = stringify(data, { directives: true });
    const buffer = Buffer.from(content);
    const base64data = buffer.toString('base64');
    const response = await this.octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: `${data.id}-info.yml`,
      message: `${sha ? 'Update' : 'Create'} ${data.id}-info.yml`,
      content: base64data,
      sha,
      committer: {
        name: 'phylogeny-explorer',
        email: 'yitzchokr@live.com',
      },
      author: {
        name: 'phylogeny-explorer',
        email: 'yitzchokr@live.com',
      },
    });
    return response;
  }

  // write each file in series using array reduce
  async writeNodeFiles({ files }) {
    const result = await files.reduce(async (acc, file) => {
      const response = await acc;
      const data = await this.writeNodeFile({ data: file });
      return [...response, data];
    }, Promise.resolve([]));
    return result;
  }

  async createBranch(branchName: string, sha: string) {
    const response = await this.octokit.git.createRef({
      owner: OWNER,
      repo: REPO,
      ref: `refs/heads/${branchName}`,
      sha,
    });
    return response.data;
  }

  async getOrCreateBranch(branchName: string) {
    try {
      // try to get the branch
      const response = await this.octokit.repos.getBranch({
        owner: OWNER,
        repo: REPO,
        branch: branchName,
      });
      return response.data.commit.sha;
    } catch (error) {
      // if the branch does not exist, create a new one
      if (error.status === 404) {
        const main = await this.octokit.repos.getBranch({
          owner: OWNER,
          repo: REPO,
          branch: 'main',
        });
        const response = await this.createBranch(
          branchName,
          main.data.commit.sha
        );
        return response.object.sha;
      }
      // re-throw the error if it is not a 404 error
      throw error;
    }
  }

  static createBlob(file) {
    const folders = file.id
      .substring(file.id.length - 6)
      .match(/.{1,2}/g)
      .join('/');

    const content = stringify(file, { directives: true });

    return {
      path: `${folders}/${file.id}-info.yml`,
      mode: '100644',
      type: 'blob',
      content,
    };
  }

  async updateMultipleFiles(branchName, sha, files) {
    const tree = files.map(GithubAPI.createBlob);
    console.log({ tree });
    const treeResponse = await this.octokit.git.createTree({
      owner: OWNER,
      repo: REPO,
      base_tree: sha,
      tree: files.map(GithubAPI.createBlob),
    });

    // create a new commit with the updated tree
    const commitResponse = await this.octokit.git.createCommit({
      owner: OWNER,
      repo: REPO,
      message: 'Updating multiple files',
      tree: treeResponse.data.sha,
      parents: [sha],
    });

    // update the branch to point to the new commit
    await this.octokit.git.updateRef({
      owner: OWNER,
      repo: REPO,
      ref: `heads/${branchName}`,
      sha: commitResponse.data.sha,
    });
  }
}

export default GithubAPI;
