const { exec } = require('child_process');

module.exports
  .run = cmd => new Promise((resolve, reject) => exec(cmd, (e, std) => (e ? reject(e) : resolve(std.trim()))));
