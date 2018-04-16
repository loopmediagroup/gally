const shell = require("./shell");

module.exports.ghPrUrl = async (branch = "develop") => {
  const upstream = await shell.run("git config --get remote.upstream.url");
  const origin = await shell.run("git config --get remote.origin.url");

  const sourceBranch = await shell.run("git branch");

  const target = `${upstream.slice(0, -4)}/compare/${branch}`;
  const source = `${origin.split("/").slice(-2, -1)[0]}:${sourceBranch.split(" ").pop()}`;

  return `${target}...${source}?expand=1`;
};
