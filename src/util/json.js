const fs = require('fs');

const load = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
module.exports.load = load;

const loadOrDefault = (file, defaultResponse = {}) => (fs.existsSync(file) ? load(file) : defaultResponse);
module.exports.loadOrDefault = loadOrDefault;

const write = (file, content) => fs.writeFileSync(file, JSON.stringify(content, null, 2), 'utf8');
module.exports.write = write;
