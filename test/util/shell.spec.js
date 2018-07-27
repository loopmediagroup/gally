const expect = require('chai').expect;
const shell = require('./../../src/util/shell');

describe("Testing shell.js", () => {
  it("Testing Resolve", (done) => {
    shell.run("whoami").then((r) => {
      expect(typeof r).to.equal("string");
      done();
    }).catch(done.fail);
  });

  it("Testing Reject", (done) => {
    shell.run("some invalid command").catch((e) => {
      expect(String(e)).to.contain("Command failed");
      done();
    });
  });
});
