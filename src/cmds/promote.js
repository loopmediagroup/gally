const os = require('os');
const github = require('../util/github');
const gally = require('../gally');
const logger = require('../util/logger');

exports.command = 'promote [remote] <branch>';
exports.desc = 'Open pr URL from provided to configured "upstream" branch';
exports.builder = {};
exports.handler = (argv) => gally
  .load(`${os.homedir()}/.gally`, process.cwd())
  .then((config) => github.promoteBranch(config, argv.remote, argv.branch))
  .then(logger.info);
