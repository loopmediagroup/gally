const request = require("./../github/request");

module.exports.create = async (repoKey, branch, token) => {
  const repoInfo = await request.get(
    `https://api.github.com/repos/${repoKey}`,
    token,
    { cache: true }
  );
  const head = await request.get(
    `https://api.github.com/repos/${repoKey}/git/refs/heads/${repoInfo.body.default_branch}`,
    token,
    { cache: true }
  );
  // noinspection JSDeprecatedSymbols
  const sha = head.body.object.sha;

  return (await request.post(
    `https://api.github.com/repos/${repoKey}/git/refs`,
    token,
    { body: { "ref": `refs/heads/${branch}`, "sha": sha } }
  )).statusCode === 201;
};
