const expect = require('chai').expect;
const open = require("./../../src/util/open");
const promote = require("./../../src/cmds/promote");
const git = require("./../../src/util/git");

describe("Testing `promote <branch>`", () => {
  const urls = [];
  let gitGhPromoteUrl;
  let openUrl;

  before(() => {
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
