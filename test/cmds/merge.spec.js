const expect = require('chai').expect;
const github = require('../../src/util/github');
const merge = require('../../src/cmds/merge');
const gally = require('../../src/gally');
const logger = require('../../src/util/logger');

describe('Testing `merge <prId>`', () => {
  let gallyLoad;
  const logs = [];
  let githubMergePr;
  let loggerInfo;

  before(() => {
    gallyLoad = gally.load;
    gally.load = () => Promise.resolve({});
    githubMergePr = github.mergePr;
    github.mergePr = () => Promise.resolve('URL');
    loggerInfo = logger.info;
    logger.info = (log) => {
      logs.push(log);
    };
  });

  after(() => {
    github.mergePr = githubMergePr;
    logger.info = loggerInfo;
    gally.load = gallyLoad;
  });

  beforeEach(() => {
    logs.length = 0;
  });

  it('Testing merge (Integration)', (done) => {
    merge.handler({}).then(() => {
      expect(logs).to.deep.equal(['URL']);
      done();
    }).catch(done.fail);
  });
});
