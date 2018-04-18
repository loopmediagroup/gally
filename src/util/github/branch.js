const request = require("./../github/request");

const getDefaultBranch = async (repoKey, token) => {
  const repoInfo = await request.get(
    `https://api.github.com/repos/${repoKey}`,
    token,
    { cached: true }
  );
  return repoInfo.body.default_branch;
};
module.exports.getDefaultBranch = getDefaultBranch;

const create = async (repoKey, branch, token) => {
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
