const path = require("path");
const expect = require('chai').expect;
const request = require("./../../../src/util/github/request");
const nockBack = require('nock').back;

describe("Testing request", () => {
  before(() => {
    nockBack.setMode('record');
    nockBack.fixtures = path.join(__dirname, "__cassette");
  });

  // eslint-disable-next-line func-names
  it("Testing get (cached)", function (done) {
    this.timeout(60000);
    nockBack(`request-get-cached.json`, {}, (nockDone) => {
      request.get(
        "https://api.github.com/repos/loopmediagroup/gally",
        "--secret-token--",
        { cached: true }
      ).then(r => {
        expect(r.statusCode).to.equal(200);
        request.get(
          "https://api.github.com/repos/loopmediagroup/gally",
          "--secret-token--",
          { cached: true }
        ).then(r => {
          expect(r.statusCode).to.equal(200);
          nockDone();
          done();
        });
      });
    });
  });
});
