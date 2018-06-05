const expect = require('chai').expect;
const open = require("./../../src/util/open");
const promote = require("./../../src/cmds/promote");
const gally = require("./../../src/gally");
const git = require("./../../src/util/git");

describe("Testing `promote <branch>`", () => {
  let gallyLoad;
  const urls = [];
  let gitGhPromoteUrl;
  let openUrl;

  before(() => {
    gallyLoad = gally.load;
    gally.load = () => Promise.resolve({});
    gitGhPromoteUrl = git.ghPromoteUrl;
    git.ghPromoteUrl = () => Promise.resolve("URL");
    openUrl = open.url;
    open.url = (url) => {
      urls.push(url);
    };
  });

  after(() => {
    git.ghPromoteUrl = gitGhPromoteUrl;
    open.url = openUrl;
    gally.load = gallyLoad;
  });

  beforeEach(() => {
    urls.length = 0;
  });

  it("Testing promote (Integration)", (done) => {
    promote.handler({}).then(() => {
      expect(urls).to.deep.equal(['URL']);
      done();
    });
  });
});
