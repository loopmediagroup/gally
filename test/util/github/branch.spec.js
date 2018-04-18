const path = require("path");
const expect = require('chai').expect;
const branch = require("./../../../src/util/github/branch");
const nockBack = require('nock').back;

describe("Testing branch", () => {
  before(() => {
    nockBack.setMode('record');
    nockBack.fixtures = path.join(__dirname, "__cassette");
  });

  // eslint-disable-next-line func-names
  it("Testing create", function (done) {
    this.timeout(60000);
    nockBack(`branch-create.json`, {}, (nockDone) => {
      branch.create("loopmediagroup/gally", "dev", "--secret-token--").then((r) => {
        expect(r).to.equal(true);
        nockDone();
        done();
      });
    });
  });

  // eslint-disable-next-line func-names
  it("Testing list", function (done) {
    this.timeout(60000);
    nockBack(`branch-list.json`, {}, (nockDone) => {
      branch.list("loopmediagroup/gally", "--secret-token--").then((r) => {
        expect(r).to.deep.equal(['dev', 'stage', 'master']);
        nockDone();
        done();
      });
    });
  });
});
