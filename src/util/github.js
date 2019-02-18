const get = require('lodash.get');
const chalk = require('chalk');
const git = require('./git');
const logger = require('./logger');
const gitBranch = require('./git/branch');
const githubBranch = require('./github/branch');
const githubPr = require('./github/pr');

const getToken = config => get(config, 'credentials.github.token', process.env.GH_TOKEN);

const getRepoKey = async (config, remote = undefined) => {
  const remoteUrl = remote ? await git.getRemoteUrl(remote) : get(config, 'config.local.repository.url');
  return remoteUrl.slice(0, -4).split('/').slice(-2).join('/');
};

const renderError = r => `${r.statusCode}: ${get(r, 'body.message') || get(r, 'body.errors')}`;

const promoteBranch = async (config, remote, branch) => {
  const repoKey = await getRepoKey(config, remote);
  const upstreamBranch = get(config.config.local.branches[branch], 'upstream');
  if (upstreamBranch === undefined) {
    return `Warning: Branch "${branch}" has no upstream defined.`;
  }
  const result = await githubPr.create(branch, upstreamBranch, repoKey, getToken(config));
  if (result.statusCode === 201) {
    return result.body.html_url;
  }
  if (get(result, 'body.errors[0].message', '').startsWith('A pull request already exists for ')) {
    return `https://github.com/${repoKey}/pulls`;
  }
  return renderError(result);
};
module.exports.promoteBranch = promoteBranch;

const approvePr = async (config, remote, prId, condition) => {
  const repoKey = await getRepoKey(config, remote);
  const token = getToken(config);
  if (!await githubPr.check(repoKey, prId, token, condition)) {
    return 'skipping: condition mismatch';
  }
  const result = await githubPr.approve(repoKey, prId, token);
  if (result.statusCode === 200) {
    return 'ok';
  }
  return renderError(result);
};
module.exports.approvePr = approvePr;

const mergePr = async (config, remote, prId, condition) => {
  const repoKey = await getRepoKey(config, remote);
  const token = getToken(config);
  if (!await githubPr.check(repoKey, prId, token, condition)) {
    return 'skipping: condition mismatch';
  }
  const result = await githubPr.merge(repoKey, prId, token);
  if (result.statusCode === 200) {
    return 'ok';
  }
  return renderError(result);
};
module.exports.mergePr = mergePr;

const evaluate = async (config, remote = undefined) => {
  if (config.config.local === null) {
    throw new Error('Missing ".gally.json". Please run "gally init."');
  }

  const repoKey = await getRepoKey(config, remote);

  // check default branch
  const defaultBranch = await githubBranch.getDefaultBranch(repoKey, getToken(config));
  if (get(config, 'config.local.defaultBranch', 'master') !== defaultBranch) {
    throw new Error('Incorrect default branch configured!');
  }

  // obtain branches and do basic checking
  const remoteBranches = await githubBranch.list(repoKey, getToken(config));
  const configBranches = Object.keys(get(config, 'config.local.branches', {}));
  const branchInfo = gitBranch.evaluate(configBranches, remoteBranches);
  if (branchInfo.unexpected.length !== 0) {
    throw new Error(`Unexpected Branches: ${branchInfo.unexpected.join(', ')}`);
  }

  // handle missing branches
  const toCreate = branchInfo.missing.filter(b => get(config.config.local.branches[b], 'create', false));
  if (toCreate.length !== 0) {
    logger.info(`Creating Branches: ${chalk.green(toCreate.join(', '))}`);
    const result = await Promise
      .all(toCreate.map(b => githubBranch.create(b, repoKey, getToken(config))));
    if (result.every(e => e === true)) {
      logger.info(chalk.green('ok'));
      // update branchInfo
      branchInfo.matched.push(...toCreate);
      toCreate.forEach(b => branchInfo.missing.splice(branchInfo.missing.indexOf(b), 1));
    } else {
      throw new Error('Failed to create Branch!');
    }
  }

  // sync matched branches
  const toSync = branchInfo.matched
    .reduce((prev, cur) => Object.assign(prev, {
      [cur]: config.config.local.branches[cur].protection === null
        ? null
        : config.config.local.protection[config.config.local.branches[cur].protection]
    }), {});
  logger.info(`Synchronizing Branches: ${Object.keys(toSync)
    .map(e => (config.config.local.branches[e].protection === null
      ? `${e} [${chalk.red('unprotected')}]`
      : `${e} [${chalk.green('protected')}]`))
    .join(', ')}`);
  const result = await Promise.all(Object.keys(toSync).map(b => githubBranch
    .updateProtection(b, toSync[b], repoKey, getToken(config))));
  if (result.every(e => e === true)) {
    logger.info(chalk.green('ok'));
  } else {
    const details = result.filter(e => e !== true).map(e => JSON.stringify(e, null, 2)).join('\n');
    throw new Error(`Failed to sync Branch: ${details}`);
  }
  return {};
};
module.exports.evaluate = evaluate;
