import { RESTDataSource } from 'apollo-datasource-rest';
import { Octokit } from '@octokit/rest';
import { parse, stringify } from 'yaml';

const OWNER = 'phylogeny-explorer';
const REPO = 'phylogeny-index';

const fileContentReducer = (raw: string) => {
  const buffer = Buffer.from(raw, 'base64');
  return parse(buffer.toString());
};

const getFoldersFromId = (id: string) =>
  id
    .substring(id.length - 6)
    .match(/.{1,2}/g)
    .join('/');

class GithubAPI extends RESTDataSource {
  REPO: string;

  octokit: Octokit;

  constructor(repo?: string) {
    super();
    this.REPO = repo || REPO;
    this.baseURL = 'https://api.github.com/';
    this.octokit = new Octokit({
      auth: process.env.GITHUB_ACCESS_TOKEN,
    });
  }

  async getFile({ ref = 'main', path }: { ref: string; path: string }) {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner: OWNER,
        repo: this.REPO,
        ref,
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

  async getTreeFile({ branch, id }: { branch: string; id: string }) {
    const data = await this.getFile({
      ref: branch,
      path: `trees/${getFoldersFromId(id)}/${id}.yml`,
    });
    if (data && 'content' in data) {
      return fileContentReducer(data.content);
    }
    return null;
  }

  async getCladeFile({ branch, id }: { branch: string; id: string }) {
    const data = await this.getFile({
      ref: branch,
      path: `nodes/${getFoldersFromId(id)}/${id}.yml`,
    });
    if (data && 'content' in data) {
      return fileContentReducer(data.content);
    }
    return null;
  }

  async getFileSha({ ref, path }: { ref: string; path: string }) {
    const data = await this.getFile({ ref, path });
    if (data && 'sha' in data) {
      return data.sha;
    }
    return null;
  }

  async upsertFile({
    path,
    data,
    branch,
  }: {
    path: string;
    data: any;
    branch: string;
  }) {
    const sha = await this.getFileSha({ ref: branch, path });

    const content = stringify(data, { directives: true });
    const buffer = Buffer.from(content);
    const base64data = buffer.toString('base64');

    try {
      const { data: file } =
        await this.octokit.repos.createOrUpdateFileContents({
          owner: OWNER,
          repo: this.REPO,
          branch,
          path,
          message: `${sha ? 'Update' : 'Create'} ${path}`,
          content: base64data,
          sha,
        });
      return file;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async upsertTreeFile({
    id,
    data,
    branch,
  }: {
    id: string;
    data: any;
    branch: string;
  }) {
    const path = `trees/${getFoldersFromId(id)}/${id}.yml`;
    return this.upsertFile({ path, data, branch });
  }

  async upsertNodeFile({
    id,
    data,
    branch,
  }: {
    id: string;
    data: any;
    branch: string;
  }) {
    const path = `nodes/${getFoldersFromId(id)}/${id}.yml`;
    return this.upsertFile({ path, data, branch });
  }

  async createBranch({ branch, sha }: { branch: string; sha: string }) {
    const response = await this.octokit.git.createRef({
      owner: OWNER,
      repo: this.REPO,
      ref: `refs/heads/${branch}`,
      sha,
    });
    return response.data;
  }

  async getBranch({ branch }: { branch: string }) {
    const response = await this.octokit.repos.getBranch({
      owner: OWNER,
      repo: this.REPO,
      branch,
    });
    return response.data.commit.sha;
  }

  async hasBranch({ branch }: { branch: string }) {
    try {
      await this.getBranch({ branch });
      return true;
    } catch (error) {
      if (error.status === 404) {
        return false;
      }
      throw error;
    }
  }

  async mergeBranch({ base, head }: { base: string; head: string }) {
    const response = await this.octokit.repos.merge({
      owner: OWNER,
      repo: this.REPO,
      base,
      head,
      commit_message: `Merge ${head} into ${base}}`,
    });
    return response.data?.sha;
  }

  async getUpdatedBranch({ branch }: { branch: string }) {
    const sha = await this.getBranch({ branch });
    // try to rebase main into the branch
    try {
      const updatedSha = await this.mergeBranch({ base: branch, head: 'main' });
      return updatedSha || sha;
    } catch (error) {
      // if the rebase fails, it means that there are conflicts
      console.error(error);
      // to do: handle conflicts
      return sha;
    }
  }

  async getOrCreateBranch({ branch }: { branch: string }) {
    // try to get the branch
    try {
      const sha = await this.getUpdatedBranch({ branch });
      return sha;
    } catch (error) {
      // if the branch does not exist, create a new one
      if (error.status === 404) {
        const mainSha = await this.getBranch({ branch: 'main' });
        const response = await this.createBranch({ branch, sha: mainSha });
        return response.object.sha;
      }
      // re-throw the error if it is not a 404 error
      throw error;
    }
  }

  async updateMultipleFiles(branchName: string, sha: string, files: any[]) {
    const treeResponse = await this.octokit.git.createTree({
      owner: OWNER,
      repo: this.REPO,
      base_tree: sha,
      tree: files.map(file => ({
        path: `nodes/${getFoldersFromId(file.id)}/${file.id}.yml`,
        mode: '100644',
        type: 'blob',
        content: stringify(file, { directives: true }),
      })),
    });

    // create a new commit with the updated tree
    const commitResponse = await this.octokit.git.createCommit({
      owner: OWNER,
      repo: this.REPO,
      message: 'Updating multiple files',
      tree: treeResponse.data.sha,
      parents: [sha],
    });

    // update the branch to point to the new commit
    await this.octokit.git.updateRef({
      owner: OWNER,
      repo: this.REPO,
      ref: `heads/${branchName}`,
      sha: commitResponse.data.sha,
    });
  }
}

export default GithubAPI;
