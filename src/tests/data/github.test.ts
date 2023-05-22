import GithubAPI from '../../data/github';

describe('GithubAPI', () => {
  it('should be defined', () => {
    expect(GithubAPI).toBeDefined();
  });
  it('should have a getFile method', () => {
    expect(GithubAPI.prototype.getFile).toBeDefined();
  });
  it('should have a getTreeFile method', () => {
    expect(GithubAPI.prototype.getTreeFile).toBeDefined();
  });
  it('should have a getCladeFile method', () => {
    expect(GithubAPI.prototype.getCladeFile).toBeDefined();
  });
  it('should have a getFileSha method', () => {
    expect(GithubAPI.prototype.getFileSha).toBeDefined();
  });
  it('should have a upsertFile method', () => {
    expect(GithubAPI.prototype.upsertFile).toBeDefined();
  });
  it('should have a upsertTreeFile method', () => {
    expect(GithubAPI.prototype.upsertTreeFile).toBeDefined();
  });
  it('should have a upsertNodeFile method', () => {
    expect(GithubAPI.prototype.upsertNodeFile).toBeDefined();
  });
  it('should have a createBranch method', () => {
    expect(GithubAPI.prototype.createBranch).toBeDefined();
  });
  it('should have a hasBranch method', () => {
    expect(GithubAPI.prototype.hasBranch).toBeDefined();
  });
  it('should have a getUpdatedBranch method', () => {
    expect(GithubAPI.prototype.getUpdatedBranch).toBeDefined();
  });
  it('should have a getOrCreateBranch method', () => {
    expect(GithubAPI.prototype.getOrCreateBranch).toBeDefined();
  });
  it('should have a updateMultipleFiles method', () => {
    expect(GithubAPI.prototype.updateMultipleFiles).toBeDefined();
  });

  const githubAPI = new GithubAPI('phylogeny-index-test');

  it('should have a githubAPI instance', () => {
    expect(githubAPI).toBeDefined();
  });

  describe('getFile', () => {
    it('should return null if no file found', async () => {
      const file = await githubAPI.getFile({
        ref: 'main',
        path: 'test.yml',
      });
      expect(file).toBeNull();
    });
    it('should return file with content', async () => {
      const file = await githubAPI.getFile({
        ref: 'main',
        path: 'README.md',
      });
      expect(file).toBeDefined();
      expect(file).toHaveProperty('content');
    });
  });

  describe('getFileSha', () => {
    it('should return a sha', async () => {
      const sha = await githubAPI.getFileSha({
        ref: 'main',
        path: 'README.md',
      });
      expect(sha).toBeDefined();
      expect(typeof sha).toBe('string');
    });
    it('should return null if no file found', async () => {
      const sha = await githubAPI.getFileSha({
        ref: 'main',
        path: 'test.yml',
      });
      expect(sha).toBeNull();
    });
  });

  describe('upsertFile', () => {
    it('should return file with content', async () => {
      const file = await githubAPI.upsertFile({
        path: 'test.yml',
        data: 'test',
        branch: 'main',
      });
      expect(file).toBeDefined();
      expect(file).toHaveProperty('content');
    });
  });

  describe('getTreeFile', () => {
    it('should return null if no file found', async () => {
      const file = await githubAPI.getTreeFile({
        branch: 'main',
        id: 'test',
      });
      expect(file).toBeNull();
    });
    it('should return file with content', async () => {
      const file = await githubAPI.getTreeFile({
        branch: 'main',
        id: 'ott4801797',
      });
      expect(file).toBeDefined();
      expect(file).toHaveProperty('content');
    });
  });
});
