const path = require("path");
const expect = require('chai').expect;
const nockBack = require('nock').back;
const branch = require("./../../../src/util/github/branch");
const request = require("./../../../src/util/github/request");

describe("Testing branch", () => {
  before(() => {
    nockBack.setMode('record');
    nockBack.fixtures = path.join(__dirname, "__cassette");
  });

  beforeEach(() => {
    request.flushCache();
  });

  // eslint-disable-next-line func-names
  it("Testing create", function (done) {
    this.timeout(60000);
    nockBack(`branch-create.json`, {}, (nockDone) => {
      branch.create("dev", "loopmediagroup/gally", "--secret-token--").then((r) => {
        expect(r).to.equal(true);
        nockDone();
        done();
      }).catch(done.fail);
    });
  });

  // eslint-disable-next-line func-names
  it("Testing updateProtection (create)", function (done) {
    this.timeout(60000);
    nockBack(`branch-updateProtection-create.json`, {}, (nockDone) => {
      branch.updateProtection("custom", {
        required_status_checks: {
          strict: true,
          contexts: []
        },
        enforce_admins: true,
        required_pull_request_reviews: {
          dismissal_restrictions: {
            users: [],
            teams: []
          },
          dismiss_stale_reviews: true,
          require_code_owner_reviews: true,
          required_approving_review_count: 1
        },
        restrictions: {
          users: [],
          teams: []
        }
      }, "loopmediagroup/gally", "--secret-token--").then((r) => {
        expect(r).to.equal(true);
        nockDone();
        done();
      }).catch(done.fail);
    });
  });

  // eslint-disable-next-line func-names
  it("Testing updateProtection (delete)", function (done) {
    this.timeout(60000);
    nockBack(`branch-updateProtection-delete.json`, {}, (nockDone) => {
      branch.updateProtection("custom", null, "loopmediagroup/gally", "--secret-token--").then((r) => {
        expect(r).to.equal(true);
        nockDone();
        done();
      }).catch(done.fail);
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
      }).catch(done.fail);
    });
  });
});
