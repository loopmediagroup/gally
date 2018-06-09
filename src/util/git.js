const shell = require("./shell");

const getCurrentBranch = () => shell.run("git rev-parse --abbrev-ref HEAD");
module.exports.getCurrentBranch = getCurrentBranch;

const getRemoteUrl = remote => shell.run(`git config --get remote.${remote}.url`);
module.exports.getRemoteUrl = getRemoteUrl;

const getRemoteOrBestGuess = async (remote, exclude) => {
  let remotes = (await shell.run("git remote")).split("\n").map(e => e.trim()).filter(e => e.length !== 0);
  if (remotes.length === 0) {
    throw new Error("No git remotes defined.");
  }
  if (remotes.length > 1) {
    remotes = remotes.filter(e => e !== exclude);
  }
  return remotes.find(e => e === remote) || remotes[0];
};
module.exports.getRemoteOrBestGuess = getRemoteOrBestGuess;

module.exports.ghPrUrl = async (branch = "dev") => {
  const upstream = await getRemoteUrl(await getRemoteOrBestGuess("upstream", "origin"));
  const origin = await getRemoteUrl(await getRemoteOrBestGuess("origin", "upstream"));

  const sourceBranch = await getCurrentBranch();

  const target = `${upstream.slice(0, -4)}/compare/${branch}`;
  const source = `${origin.split("/").slice(-2, -1)[0]}:${sourceBranch}`;

  return `${target}...${source}?expand=1`;
};
