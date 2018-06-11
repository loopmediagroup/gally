const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const inquirer = require('inquirer');
const tmp = require('tmp');
const gally = require('./../src/gally');

tmp.setGracefulCleanup();

describe("Testing Gally", () => {
  let ghToken;
  let inquirerPrompt;
  let promptCount = 0;

  before(() => {
    inquirerPrompt = inquirer.prompt;
    inquirer.prompt = () => {
      promptCount += 1;
      return {
        token: "token"
      };
    };
    ghToken = process.env.GH_TOKEN;
    delete process.env.GH_TOKEN;
  });

  after(() => {
    inquirer.prompt = inquirerPrompt;
    process.env.GH_TOKEN = ghToken;
  });

  beforeEach(() => {
    promptCount = 0;
  });

  it("Test Empty Local Config", (done) => {
    const dir = tmp.dirSync({ keep: false, unsafeCleanup: true }).name;
    gally.load(`${dir}/$HOME.gally`, dir).then((cfg) => {
      expect(promptCount).to.equal(1);
      expect(cfg.config.local).to.equal(null);
      done();
    });
  });

  it("Testing load", (done) => {
    const dir = tmp.dirSync({ keep: false, unsafeCleanup: true }).name;
    const localConfig = {
      protection: {
        $child2: {
          "@": "$parent",
          field: {
            prop1: "child2",
            prop3: []
          }
        },
        $child1: {
          "@": "$parent",
          field: {
            prop1: "child1",
            prop3: []
          }
        },
        $parent: {
          field: {
            prop1: "parent1",
            prop2: "parent2",
            prop3: ["parent3"]
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
            $child2: {
              field: {
                prop1: "child2",
                prop2: "parent2",
                prop3: []
              }
            },
            $child1: {
              field: {
                prop1: "child1",
                prop2: "parent2",
                prop3: []
              }
            },
            $parent: {
              field: {
                prop1: "parent1",
                prop2: "parent2",
                prop3: ["parent3"]
              }
            }
          }
        }
      },
      credentials: { github: { token: 'token' } }
    };
    // load (create)
    gally.load(`${dir}/$HOME.gally`, dir).then((cfg1) => {
      expect(cfg1).to.deep.equal(config);
      expect(promptCount).to.equal(1);
      // load (existing)
      gally.load(`${dir}/$HOME.gally`, dir).then((cfg2) => {
        expect(cfg2).to.deep.equal(config);
        expect(promptCount).to.equal(1);
        done();
      });
    });
  });
});
