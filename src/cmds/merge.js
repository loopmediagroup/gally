const os = require('os');
const github = require('../util/github');
const gally = require('../gally');
const logger = require('../util/logger');

exports.command = 'merge [remote] <prId> [condition]';
exports.desc = 'Marge pr.';
exports.builder = {};
exports.handler = (argv) => gally
  .load(`${os.homedir()}/.gally`, process.cwd())
  .then((config) => github.mergePr(config, argv.remote, argv.prId, argv.condition))
  .then(logger.info);
