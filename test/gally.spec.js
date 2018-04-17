const expect = require('chai').expect;
const inquirer = require('inquirer');
const tmp = require('tmp');
const gally = require('./../src/gally');

tmp.setGracefulCleanup();

describe("Testing Gally", () => {
  let inquirerPrompt;
  let promptCount = 0;

  before(() => {
    inquirerPrompt = inquirer.prompt;
    inquirer.prompt = () => {
      promptCount += 1;
      return {
        username: "username",
        token: "token"
      };
    };
  });

  after(() => {
    inquirer.prompt = inquirerPrompt;
  });

  beforeEach(() => {
    promptCount = 0;
  });

  it("Testing load", (done) => {
    const dir = `${tmp.dirSync({ keep: false, unsafeCleanup: true }).name}/.gally`;
    const config = { config: {}, credentials: { github: { username: "username", token: 'token' } } };
    // load (create)
    gally.load(dir).then((cfg1) => {
      console.log(cfg1);
      expect(cfg1).to.deep.equal(config);
      expect(promptCount).to.equal(2);
      // load (existing)
      gally.load(dir).then((cfg2) => {
        expect(cfg2).to.deep.equal(config);
        expect(promptCount).to.equal(2);
        done();
      });
    });
  });
});
