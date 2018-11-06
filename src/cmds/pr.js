const os = require('os');
const git = require('./../util/git');
const gally = require('./../gally');
const open = require('./../util/open');

exports.command = 'pr [branch]';
exports.desc = 'Open pr URL from origin branch to upstream branch';
exports.builder = {};
exports.handler = argv => gally
  .load(`${os.homedir()}/.gally`, process.cwd())
  .then(config => git.ghPrUrl(config, argv.branch).then(open.url));
