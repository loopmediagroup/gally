const expect = require('chai').expect;
const shell = require("./../../src/util/shell");
const git = require("./../../src/util/git");

describe("Testing git.js", () => {
  let shellRun;

  before(() => {
    shellRun = shell.run;
    shell.run = input => ({
      "git config --get remote.upstream.url": "https://github.com/loopmediagroup/gally.git",
      "git config --get remote.origin.url": "https://github.com/simlu/gally.git",
      "git branch": "develop"
    }[input]);
  });

  after(() => {
    shell.run = shellRun;
  });

  it("Testing ghPrUrl Default", (done) => {
    git.ghPrUrl().then((r) => {
      expect(r).to.equal("https://github.com/loopmediagroup/gally/compare/develop...simlu:develop?expand=1");
      done();
    });
  });

  it("Testing ghPrUrl Custom Target", (done) => {
    git.ghPrUrl("custom").then((r) => {
      expect(r).to.equal("https://github.com/loopmediagroup/gally/compare/custom...simlu:develop?expand=1");
      done();
    });
  });
});
