const querystring = require('querystring');
const get = require('lodash.get');
const request = require('./../github/request');

const create = (source, target, repoKey, token) => request.post(
  `https://api.github.com/repos/${repoKey}/pulls`,
  token,
  {
    body: {
      title: `[Gally]: ${target} <- ${source}`,
      head: source,
      base: target,
      maintainer_can_modify: false,
      body: 'Automatically created by Git-Ally'
    }
  }
);
module.exports.create = create;

const approve = (repoKey, prId, token) => request.post(
  `https://api.github.com/repos/${repoKey}/pulls/${prId}/reviews`,
  token,
  {
    body: {
      event: 'APPROVE'
    }
  }
);
module.exports.approve = approve;

const merge = async (repoKey, prId, token) => {
  const prInfo = await request.get(`https://api.github.com/repos/${repoKey}/pulls/${prId}`, token);
  const sha = get(prInfo, 'head.sha');
  return request.put(
    `https://api.github.com/repos/${repoKey}/pulls/${prId}/merge`,
    token,
    {
      body: {
        commit_title: '[Gally]: Merged',
        commit_message: '',
        sha,
        merge_method: 'merge'
      }
    }
  );
};
module.exports.merge = merge;

const check = async (repoKey, prId, token, condition) => {
  const conditionParsed = Object.entries(querystring.parse(condition));
  if (conditionParsed.length === 0) {
    return true;
  }
  const prInfo = (await request.get(`https://api.github.com/repos/${repoKey}/pulls/${prId}`, token)).body;
  return conditionParsed.every(([k, v]) => String(get(prInfo, k)) === v);
};
module.exports.check = check;
