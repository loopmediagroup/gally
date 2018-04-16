// @flow
// eslint-disable-next-line import/no-extraneous-dependencies
const gardener = require('js-gardener');

if (require.main === module) {
  gardener({
    skip: ["badges"],
    author: "Loop Media Group",
    license: "MIT"
  }).catch(() => process.exit(1));
}
