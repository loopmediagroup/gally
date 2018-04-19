const path = require("path");
const expect = require('chai').expect;
const github = require("./../../src/util/github");
const nockBack = require('nock').back;

describe("Testing github", () => {
  before(() => {
    nockBack.setMode('record');
    nockBack.fixtures = path.join(__dirname, "__cassette");
  });

  // eslint-disable-next-line func-names
  it("Testing evaluate (missing local config)", function (done) {
    this.timeout(60000);
    nockBack(`github-evaluate-missing-local-config.json`, {}, (nockDone) => {
      github.evaluate({ config: { local: null } }, "upstream").catch(e => {
        expect(e.message).to.equal('Missing ".gally.json". Please run "gally init."');
        nockDone();
        done();
      });
    });
  });

  // eslint-disable-next-line func-names
  it("Testing evaluate (incorrect default branch)", function (done) {
    this.timeout(60000);
    nockBack(`github-evaluate-incorrect-default-branch.json`, {}, (nockDone) => {
      github.evaluate({
        config: { local: { defaultBranch: "custom" } },
        credentials: { github: { token: "--secret-token--" } }
      }, "upstream").catch(e => {
        expect(e.message).to.equal('Incorrect default branch configured!');
        nockDone();
        done();
      });
    });
  });

  // eslint-disable-next-line func-names
  it("Testing evaluate (unexpected branch)", function (done) {
    this.timeout(60000);
    nockBack(`github-evaluate-unexpected-branch.json`, {}, (nockDone) => {
      github.evaluate({
        config: { local: { defaultBranch: "master", branches: [] } },
        credentials: { github: { token: "--secret-token--" } }
      }, "upstream").catch(e => {
        expect(e.message).to.equal('Unexpected Branches: master');
        nockDone();
        done();
      });
    });
  });
});
