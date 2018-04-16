const expect = require('chai').expect;
const open = require("./../../src/util/open");
const pr = require("./../../src/cmds/pr");
const git = require("./../../src/util/git");

describe("Testing `pr [branch]`", () => {
  const urls = [];
  let gitGhPrUrl;
  let openUrl;

  before(() => {
    gitGhPrUrl = git.ghPrUrl;
    git.ghPrUrl = () => Promise.resolve("URL");
    openUrl = open.url;
    open.url = (url) => {
      urls.push(url);
    };
  });

  after(() => {
    git.ghPrUrl = gitGhPrUrl;
    open.url = openUrl;
  });

  beforeEach(() => {
    urls.length = 0;
  });

  it("Testing pr (Integration)", (done) => {
    pr.handler({}).then(() => {
      expect(urls).to.deep.equal(['URL']);
      done();
    });
  });
});
