const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const tmp = require('tmp');
const init = require('./../../src/cmds/init');

tmp.setGracefulCleanup();

describe('Testing `init`', () => {
  it('Testing basic file copying', (done) => {
    const dir = tmp.dirSync({ keep: false, unsafeCleanup: true }).name;
    const cwd = process.cwd();
    process.chdir(dir);
    init.handler({}).then(() => {
      expect(fs.existsSync(path.join(dir, '.gally.json'))).to.equal(true);
      process.chdir(cwd);
      done();
    }).catch(done.fail);
  });
});
