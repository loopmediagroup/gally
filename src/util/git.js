const shell = require("./shell");

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

module.exports.ghPrUrl = async (branch = "develop") => {
  const upstream = await shell.run(`git config --get remote.${await getRemoteOrBestGuess("upstream", "origin")}.url`);
  const origin = await shell.run(`git config --get remote.${await getRemoteOrBestGuess("origin", "upstream")}.url`);

  const sourceBranch = await shell.run("git branch");

  const target = `${upstream.slice(0, -4)}/compare/${branch}`;
  const source = `${origin.split("/").slice(-2, -1)[0]}:${sourceBranch.split(" ").pop()}`;

  return `${target}...${source}?expand=1`;
};
