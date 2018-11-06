const os = require('os');
const gally = require('./../gally');
const github = require('./../util/github');

exports.command = 'sync [remote]';
exports.desc = 'Apply local configuration to remote github repo.';
exports.builder = {};
exports.handler = argv => gally
  .load(`${os.homedir()}/.gally`, process.cwd())
  .then(config => github.evaluate(config, argv.remote));
