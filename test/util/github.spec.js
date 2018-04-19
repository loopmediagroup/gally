const path = require("path");
const set = require("lodash.set");
const expect = require('chai').expect;
const nockBack = require('nock').back;
const shell = require("./../../src/util/shell");
const logger = require("./../../src/util/logger");
const request = require("./../../src/util/github/request");
const github = require("./../../src/util/github");

const configTemplate = {
  config: {
    local: {
      defaultBranch: "master",
      branches: {
        dev: {
          protection: "$full",
          create: true
        },
        master: {
          protection: "$full",
          create: true
        }
      },
      protection: {
        $full: {}
      }
    }
  },
  credentials: { github: { token: "--secret-token--" } }
};

describe("Testing github", () => {
  const logs = [];
  let loggerInfo;
  let lookup = {};
  let shellRun;

  before(() => {
    loggerInfo = logger.info;
    logger.info = input => logs.push(input);
    shellRun = shell.run;
    shell.run = input => (lookup[input]);
    nockBack.setMode('record');
    nockBack.fixtures = path.join(__dirname, "__cassette");
  });

  after(() => {
    logger.info = loggerInfo;
    shell.run = shellRun;
  });

  beforeEach(() => {
    request.flushCache();
    logs.length = 0;
    lookup = {
      "git remote": "origin\nupstream\n",
      "git config --get remote.upstream.url": "https://github.com/loopmediagroup/gally.git",
      "git config --get remote.origin.url": "https://github.com/simlu/gally.git",
      "git branch": "dev"
    };
  });

  // eslint-disable-next-line func-names
  it("Testing evaluate (missing local config)", function (done) {
    this.timeout(60000);
    nockBack(`github-evaluate-missing-local-config.json`, {}, (nockDone) => {
      github.evaluate({ config: { local: null } }, "upstream").catch((e) => {
        expect(logs).to.deep.equal([]);
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
      }, "upstream").catch((e) => {
        expect(logs).to.deep.equal([]);
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
      }, "upstream").catch((e) => {
        expect(logs).to.deep.equal([]);
        expect(e.message).to.equal('Unexpected Branches: master');
        nockDone();
        done();
      });
    });
  });

  // eslint-disable-next-line func-names
  it("Testing evaluate (create failure)", function (done) {
    this.timeout(60000);
    nockBack(`github-evaluate-create-failure.json`, {}, (nockDone) => {
      github.evaluate(configTemplate, "upstream").catch((e) => {
        expect(logs).to.deep.equal(["Creating Branches: \u001b[32mdev\u001b[39m"]);
        expect(e.message).to.deep.equal("Failed to create Branch!");
        nockDone();
        done();
      });
    });
  });

  // eslint-disable-next-line func-names
  it("Testing evaluate (sync failure)", function (done) {
    this.timeout(60000);
    nockBack(`github-evaluate-sync-failure.json`, {}, (nockDone) => {
      github.evaluate(configTemplate, "upstream").catch((e) => {
        expect(logs).to.deep.equal([
          "Synchronizing Branches: master [\u001b[32mprotected\u001b[39m], dev [\u001b[32mprotected\u001b[39m]"
        ]);
        expect(e.message).to.deep.equal("Failed to sync Branch!");
        nockDone();
        done();
      });
    });
  });

  // eslint-disable-next-line func-names
  it("Testing evaluate (create and sync)", function (done) {
    this.timeout(60000);
    nockBack(`github-evaluate-create-and-sync.json`, {}, (nockDone) => {
      github.evaluate(configTemplate, "upstream").then((r) => {
        expect(logs).to.deep.equal([
          'Creating Branches: \u001b[32mdev\u001b[39m',
          '\u001b[32mok\u001b[39m',
          'Synchronizing Branches: master [\u001b[32mprotected\u001b[39m], dev [\u001b[32mprotected\u001b[39m]',
          '\u001b[32mok\u001b[39m'
        ]);
        expect(r).to.deep.equal({});
        nockDone();
        done();
      });
    });
  });

  // eslint-disable-next-line func-names
  it("Testing evaluate (sync only)", function (done) {
    this.timeout(60000);
    nockBack(`github-evaluate-sync-only.json`, {}, (nockDone) => {
      github.evaluate(configTemplate, "upstream").then((r) => {
        expect(logs).to.deep.equal([
          'Synchronizing Branches: master [\u001b[32mprotected\u001b[39m], dev [\u001b[32mprotected\u001b[39m]',
          '\u001b[32mok\u001b[39m'
        ]);
        expect(r).to.deep.equal({});
        nockDone();
        done();
      });
    });
  });

  // eslint-disable-next-line func-names
  it("Testing evaluate (sync only unprotected)", function (done) {
    this.timeout(60000);
    const config = JSON.parse(JSON.stringify(configTemplate));
    set(config, "config.local.branches.dev.protection", null);
    nockBack(`github-evaluate-sync-only-unprotected.json`, {}, (nockDone) => {
      github.evaluate(config, "upstream").then((r) => {
        expect(logs).to.deep.equal([
          'Synchronizing Branches: master [\u001b[32mprotected\u001b[39m], dev [\u001b[31munprotected\u001b[39m]',
          '\u001b[32mok\u001b[39m'
        ]);
        expect(r).to.deep.equal({});
        nockDone();
        done();
      });
    });
  });
});
