const os = require("os");
const git = require("./../util/git");
const gally = require("./../gally");
const open = require("./../util/open");

exports.command = 'promote <branch>';
exports.desc = 'Open pr URL from provided to configured "upstream" branch';
exports.builder = {};
exports.handler = argv => gally
  .load(`${os.homedir()}/.gally`, process.cwd())
  .then(config => git.ghPromoteUrl(config, argv.branch).then(open.url));
