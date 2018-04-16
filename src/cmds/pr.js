const git = require("./../util/git");
const open = require("./../util/open");

exports.command = 'pr [branch]';
exports.desc = 'Open pr URL from origin branch to upstream branch';
exports.builder = {};
exports.handler = argv => git.ghPrUrl(argv.branch).then(open.url);
