const os = require('os');
const github = require('./../util/github');
const gally = require('./../gally');
const logger = require('./../util/logger');

exports.command = 'approve [remote] <prId> [condition]';
exports.desc = 'Approve pr.';
exports.builder = {};
exports.handler = argv => gally
  .load(`${os.homedir()}/.gally`, process.cwd())
  .then(config => github.approvePr(config, argv.remote, argv.prId, argv.condition))
  .then(logger.info);
