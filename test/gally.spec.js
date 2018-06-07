const fs = require('fs');
const path = require('path');
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

  it("Test Empty Local Config", (done) => {
    const dir = tmp.dirSync({ keep: false, unsafeCleanup: true }).name;
    gally.load(`${dir}/$HOME.gally`, dir).then((cfg) => {
      expect(promptCount).to.equal(2);
      expect(cfg.config.local).to.equal(null);
      done();
    });
  });

  it("Testing load", (done) => {
    const dir = tmp.dirSync({ keep: false, unsafeCleanup: true }).name;
    const localConfig = {
      protection: {
        $child: {
          "@": "$parent",
          field: {
            prop1: "child1"
          }
        },
        $parent: {
          field: {
            prop1: "parent1",
            prop2: "parent2"
          }
        }
      }
    };
    fs.writeFileSync(path.join(dir, ".gally.json"), JSON.stringify(localConfig));
    const config = {
      config: {
        global: {},
        local: {
          protection: {
            $child: {
              field: {
                prop1: "child1",
                prop2: "parent2"
              }
            },
            $parent: {
              field: {
                prop1: "parent1",
                prop2: "parent2"
              }
            }
          }
        }
      },
      credentials: { github: { username: "username", token: 'token' } }
    };
    // load (create)
    gally.load(`${dir}/$HOME.gally`, dir).then((cfg1) => {
      expect(cfg1).to.deep.equal(config);
      expect(promptCount).to.equal(2);
      // load (existing)
      gally.load(`${dir}/$HOME.gally`, dir).then((cfg2) => {
        expect(cfg2).to.deep.equal(config);
        expect(promptCount).to.equal(2);
        done();
      });
    });
  });
});
