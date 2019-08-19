const expect = require('chai').expect;
const github = require('../../src/util/github');
const approve = require('../../src/cmds/approve');
const gally = require('../../src/gally');
const logger = require('../../src/util/logger');

describe('Testing `approve <prId>`', () => {
  let gallyLoad;
  const logs = [];
  let githubApprovePr;
  let loggerInfo;

  before(() => {
    gallyLoad = gally.load;
    gally.load = () => Promise.resolve({});
    githubApprovePr = github.approvePr;
    github.approvePr = () => Promise.resolve('URL');
    loggerInfo = logger.info;
    logger.info = (log) => {
      logs.push(log);
    };
  });

  after(() => {
    github.approvePr = githubApprovePr;
    logger.info = loggerInfo;
    gally.load = gallyLoad;
  });

  beforeEach(() => {
    logs.length = 0;
  });

  it('Testing approve (Integration)', (done) => {
    approve.handler({}).then(() => {
      expect(logs).to.deep.equal(['URL']);
      done();
    }).catch(done.fail);
  });
});
