const request = require("./../github/request");

const create = (source, target, repoKey, token) => request.post(
  `https://api.github.com/repos/${repoKey}/pulls`,
  token,
  {
    body: {
      title: `[Gally]: ${target} <- ${source}`,
      head: source,
      base: target,
      maintainer_can_modify: false,
      body: "Automatically created by Git-Ally"
    }
  }
);
module.exports.create = create;
