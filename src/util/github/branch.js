const request = require('./../github/request');

const list = async (repoKey, token) => {
  const result = await request.get(
    `https://api.github.com/repos/${repoKey}/branches`,
    token,
    { cached: true }
  );
  return result.body.map((e) => e.name);
};
module.exports.list = list;

const updateProtection = async (branch, protection, repoKey, token) => {
  if (protection === null) {
    const result = await request.delete(
      `https://api.github.com/repos/${repoKey}/branches/${branch}/protection`,
      token
    );
    return [204, 404].indexOf(result.statusCode) !== -1 ? true : result.body;
  }
  const result = await request.put(
    `https://api.github.com/repos/${repoKey}/branches/${branch}/protection`,
    token,
    { body: protection }
  );
  return result.statusCode === 200 ? true : result.body;
};
module.exports.updateProtection = updateProtection;

const getDefaultBranch = async (repoKey, token) => {
  const repoInfo = await request.get(
    `https://api.github.com/repos/${repoKey}`,
    token,
    { cached: true }
  );
  return repoInfo.body.default_branch;
};
module.exports.getDefaultBranch = getDefaultBranch;

const create = async (branch, repoKey, token) => {
  const defaultBranch = await getDefaultBranch(repoKey, token);
  const head = await request.get(
    `https://api.github.com/repos/${repoKey}/git/refs/heads/${defaultBranch}`,
    token,
    { cached: true }
  );
  // noinspection JSDeprecatedSymbols
  const sha = head.body.object.sha;
  const result = await request.post(
    `https://api.github.com/repos/${repoKey}/git/refs`,
    token,
    { body: { ref: `refs/heads/${branch}`, sha } }
  );
  return result.statusCode === 201;
};
module.exports.create = create;
