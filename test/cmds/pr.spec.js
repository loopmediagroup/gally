const expect = require('chai').expect;
const { describe } = require('node-tdd');
const open = require('../../src/util/open');
const pr = require('../../src/cmds/pr');
const gally = require('../../src/gally');
const git = require('../../src/util/git');

describe('Testing `pr [branch]`', () => {
  let gallyLoad;
  const urls = [];
  let gitGhPrUrl;
  let openUrl;

  before(() => {
    gallyLoad = gally.load;
    gally.load = () => Promise.resolve({});
    gitGhPrUrl = git.ghPrUrl;
    git.ghPrUrl = () => Promise.resolve('URL');
    openUrl = open.url;
    open.url = (url) => {
      urls.push(url);
    };
  });

  after(() => {
    git.ghPrUrl = gitGhPrUrl;
    open.url = openUrl;
    gally.load = gallyLoad;
  });

  beforeEach(() => {
    urls.length = 0;
  });

  it('Testing pr (Integration)', (done) => {
    pr.handler({}).then(() => {
      expect(urls).to.deep.equal(['URL']);
      done();
    }).catch(done.fail);
  });
});
