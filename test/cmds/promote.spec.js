const expect = require('chai').expect;
const github = require('../../src/util/github');
const promote = require('../../src/cmds/promote');
const gally = require('../../src/gally');
const logger = require('../../src/util/logger');

describe('Testing `promote <branch>`', () => {
  let gallyLoad;
  const logs = [];
  let githubPromoteBranch;
  let loggerInfo;

  before(() => {
    gallyLoad = gally.load;
    gally.load = () => Promise.resolve({});
    githubPromoteBranch = github.promoteBranch;
    github.promoteBranch = () => Promise.resolve('URL');
    loggerInfo = logger.info;
    logger.info = (log) => {
      logs.push(log);
    };
  });

  after(() => {
    github.promoteBranch = githubPromoteBranch;
    logger.info = loggerInfo;
    gally.load = gallyLoad;
  });

  beforeEach(() => {
    logs.length = 0;
  });

  it('Testing promote (Integration)', (done) => {
    promote.handler({}).then(() => {
      expect(logs).to.deep.equal(['URL']);
      done();
    }).catch(done.fail);
  });
});
