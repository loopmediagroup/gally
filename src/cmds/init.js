const fs = require("fs");
const path = require("path");

exports.command = 'init';
exports.desc = 'Create .gally configuration file.';
exports.builder = {};
exports.handler = async () => fs
  .createReadStream(path.join(__dirname, "..", "configs", "default.json"))
  .pipe(fs.createWriteStream(path.join(process.cwd(), ",gally.json")));
