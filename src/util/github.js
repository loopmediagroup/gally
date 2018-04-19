const get = require("lodash.get");
const chalk = require("chalk");
const git = require("./git");
const logger = require("./logger");
const gitBranch = require("./git/branch");
const githubBranch = require("./github/branch");

const evaluate = async (config, remote) => {
  if (config.config.local === null) {
    throw new Error(`Missing ".gally.json". Please run "gally init."`);
  }

  const remoteUrl = await git.getRemoteUrl(remote);
  const repoKey = remoteUrl.slice(0, -4).split("/").slice(-2).join("/");

  // check default branch
  const defaultBranch = await githubBranch.getDefaultBranch(repoKey, config.credentials.github.token);
  if (get(config, "config.local.defaultBranch", "master") !== defaultBranch) {
    throw new Error("Incorrect default branch configured!");
  }

  // obtain branches and do basic checking
  const remoteBranches = await githubBranch.list(repoKey, config.credentials.github.token);
  const configBranches = Object.keys(get(config, "config.local.branches", {}));
  const branchInfo = gitBranch.evaluate(configBranches, remoteBranches);
  if (branchInfo.unexpected.length !== 0) {
    throw new Error(`Unexpected Branches: ${branchInfo.unexpected.join(", ")}`);
  }

  // handle missing branches
  if (branchInfo.missing.length !== 0) {
    const toCreate = branchInfo.missing.filter(b => config.config.local.branches[b], "create", false);
    logger.info(`Creating Branches: ${chalk.green(toCreate.join(", "))}`);
    const result = await Promise
      .all(toCreate.map(b => githubBranch.create(b, repoKey, config.credentials.github.token)));
    if (result.every(e => e === true)) {
      logger.info(chalk.green("ok"));
      // update branchInfo
      branchInfo.matched.push(...toCreate);
      toCreate.forEach(b => branchInfo.missing.splice(branchInfo.missing.indexOf(b), 1));
    } else {
      throw new Error("Failed to create Branch!");
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
      ? `${e} [${chalk.red("unprotected")}]`
      : `${e} [${chalk.green("protected")}]`))
    .join(", ")}`);
  const result = await Promise.all(Object.keys(toSync).map(b => githubBranch
    .updateProtection(b, toSync[b], repoKey, config.credentials.github.token)));
  if (result.every(e => e === true)) {
    logger.info(chalk.green("ok"));
  } else {
    logger.info(chalk.red("failure"));
  }
  return {};
};
module.exports.evaluate = evaluate;
