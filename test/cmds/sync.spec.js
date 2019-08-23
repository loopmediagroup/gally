const expect = require('chai').expect;
const { describe } = require('node-tdd');
const sync = require('../../src/cmds/sync');
const gally = require('../../src/gally');
const github = require('../../src/util/github');

describe('Testing `sync <remote>`', () => {
  let gallyLoad;
  let githubEvaludate;

  before(() => {
    gallyLoad = gally.load;
    gally.load = () => Promise.resolve({});
    githubEvaludate = github.evaluate;
    github.evaluate = () => Promise.resolve({});
  });

  after(() => {
    github.evaluate = githubEvaludate;
    gally.load = gallyLoad;
  });

  it('Testing sync (Integration)', (done) => {
    sync.handler({}).then((r) => {
      expect(r).to.deep.equal({});
      done();
    }).catch(done.fail);
  });
});
