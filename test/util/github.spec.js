const path = require('path');
const set = require('lodash.set');
const chalk = require('chalk');
const expect = require('chai').expect;
const { describe } = require('node-tdd');
const nockBack = require('nock').back;
const shell = require('../../src/util/shell');
const logger = require('../../src/util/logger');
const request = require('../../src/util/github/request');
const github = require('../../src/util/github');

const configTemplate = {
  config: {
    local: {
      defaultBranch: 'master',
      repository: {
        url: 'https://github.com/loopmediagroup/gally.git'
      },
      branches: {
        dev: {
          upstream: 'master',
          protection: '$full',
          create: true
        },
        master: {
          protection: '$full',
          create: true
        }
      },
      protection: {
        $full: {}
      }
    }
  },
  credentials: { github: { token: '--secret-token--' } }
};

describe('Testing github', { timeout: 60000 }, () => {
  const logs = [];
  let loggerInfo;
  let lookup = {};
  let shellRun;

  before(() => {
    loggerInfo = logger.info;
    logger.info = (input) => logs.push(input);
    shellRun = shell.run;
    shell.run = (input) => (lookup[input]);
    nockBack.setMode('record');
    nockBack.fixtures = path.join(__dirname, '__cassette');
  });

  after(() => {
    logger.info = loggerInfo;
    shell.run = shellRun;
  });

  beforeEach(() => {
    request.flushCache();
    logs.length = 0;
    lookup = {
      'git remote': 'origin\nupstream\n',
      'git config --get remote.upstream.url': 'https://github.com/loopmediagroup/gally.git',
      'git config --get remote.origin.url': 'https://github.com/simlu/gally.git',
      'git rev-parse --abbrev-ref HEAD': 'dev'
    };
  });

  it('Testing evaluate (missing local config)', (done) => {
    nockBack('github-evaluate-missing-local-config.json', {}, (nockDone) => {
      github.evaluate({ config: { local: null } }, 'upstream').catch((e) => {
        expect(logs).to.deep.equal([]);
        expect(e.message).to.equal('Missing ".gally.json". Please run "gally init."');
        nockDone();
        done();
      });
    });
  });

  it('Testing evaluate (incorrect default branch)', (done) => {
    nockBack('github-evaluate-incorrect-default-branch.json', {}, (nockDone) => {
      github.evaluate({
        config: {
          local: {
            defaultBranch: 'custom',
            repository: { url: 'https://github.com/loopmediagroup/gally.git' }
          }
        },
        credentials: { github: { token: '--secret-token--' } }
      }, 'upstream').catch((e) => {
        expect(logs).to.deep.equal([]);
        expect(e.message).to.equal('Incorrect default branch configured!');
        nockDone();
        done();
      });
    });
  });

  it('Testing evaluate (unexpected branch)', (done) => {
    nockBack('github-evaluate-unexpected-branch.json', {}, (nockDone) => {
      github.evaluate({
        config: {
          local: {
            defaultBranch: 'master',
            repository: { url: 'https://github.com/loopmediagroup/gally.git' },
            branches: []
          }
        },
        credentials: { github: { token: '--secret-token--' } }
      }).catch((e) => {
        expect(logs).to.deep.equal([]);
        expect(e.message).to.equal('Unexpected Branches: master');
        nockDone();
        done();
      });
    });
  });

  it('Testing evaluate (create failure)', (done) => {
    nockBack('github-evaluate-create-failure.json', {}, (nockDone) => {
      github.evaluate(configTemplate, 'upstream').catch((e) => {
        expect(logs).to.deep.equal([`Creating Branches: ${chalk.green('dev')}`]);
        expect(e.message).to.deep.equal('Failed to create Branch!');
        nockDone();
        done();
      });
    });
  });

  it('Testing evaluate (sync failure)', (done) => {
    const config = JSON.parse(JSON.stringify(configTemplate));
    set(config, 'config.local.branches.dev.protection', null);
    nockBack('github-evaluate-sync-failure.json', {}, (nockDone) => {
      github.evaluate(config, 'upstream').catch((e) => {
        expect(logs).to.deep.equal([
          `Synchronizing Branches: master [${chalk.green('protected')}], dev [${chalk.red('unprotected')}]`
        ]);
        expect(e.message).to.deep.equal('Failed to sync Branch: \n');
        nockDone();
        done();
      });
    });
  });

  it('Testing evaluate (create and sync)', (done) => {
    nockBack('github-evaluate-create-and-sync.json', {}, (nockDone) => {
      github.evaluate(configTemplate, 'upstream').then((r) => {
        expect(logs).to.deep.equal([
          `Creating Branches: ${chalk.green('dev')}`,
          chalk.green('ok'),
          `Synchronizing Branches: master [${chalk.green('protected')}], dev [${chalk.green('protected')}]`,
          chalk.green('ok')
        ]);
        expect(r).to.deep.equal({});
        nockDone();
        done();
      }).catch(done.fail);
    });
  });

  it('Testing evaluate (sync only)', (done) => {
    nockBack('github-evaluate-sync-only.json', {}, (nockDone) => {
      github.evaluate(configTemplate, 'upstream').then((r) => {
        expect(logs).to.deep.equal([
          `Synchronizing Branches: master [${chalk.green('protected')}], dev [${chalk.green('protected')}]`,
          chalk.green('ok')
        ]);
        expect(r).to.deep.equal({});
        nockDone();
        done();
      }).catch(done.fail);
    });
  });

  it('Testing evaluate (sync only unprotected)', (done) => {
    const config = JSON.parse(JSON.stringify(configTemplate));
    set(config, 'config.local.branches.dev.protection', null);
    nockBack('github-evaluate-sync-only-unprotected.json', {}, (nockDone) => {
      github.evaluate(config, 'upstream').then((r) => {
        expect(logs).to.deep.equal([
          `Synchronizing Branches: master [${chalk.green('protected')}], dev [${chalk.red('unprotected')}]`,
          chalk.green('ok')
        ]);
        expect(r).to.deep.equal({});
        nockDone();
        done();
      }).catch(done.fail);
    });
  });

  it('Testing promoteBranch Pr Created', (done) => {
    const config = JSON.parse(JSON.stringify(configTemplate));
    nockBack('github-promoteBranch-pr-created.json', {}, (nockDone) => {
      github.promoteBranch(config, undefined, 'dev').then((r) => {
        expect(logs).to.deep.equal([]);
        expect(r).to.deep.equal('https://github.com/loopmediagroup/gally/pull/62');
        nockDone();
        done();
      }).catch(done.fail);
    });
  });

  it('Testing promoteBranch Missing Upstream', (done) => {
    const config = JSON.parse(JSON.stringify(configTemplate));
    github.promoteBranch(config, undefined, 'master').then((r) => {
      expect(logs).to.deep.equal([]);
      expect(r).to.deep.equal('Warning: Branch "master" has no upstream defined.');
      done();
    }).catch(done.fail);
  });

  it('Testing promoteBranch Pr Exists', (done) => {
    const config = JSON.parse(JSON.stringify(configTemplate));
    nockBack('github-promoteBranch-pr-exists.json', {}, (nockDone) => {
      github.promoteBranch(config, undefined, 'dev').then((r) => {
        expect(logs).to.deep.equal([]);
        expect(r).to.deep.equal('https://github.com/loopmediagroup/gally/pulls');
        nockDone();
        done();
      }).catch(done.fail);
    });
  });

  it('Testing promoteBranch 401 Error', (done) => {
    const config = JSON.parse(JSON.stringify(configTemplate));
    nockBack('github-promoteBranch-401-error.json', {}, (nockDone) => {
      github.promoteBranch(config, undefined, 'dev').then((r) => {
        expect(logs).to.deep.equal([]);
        expect(r).to.deep.equal('401: Bad credentials');
        nockDone();
        done();
      }).catch(done.fail);
    });
  });

  it('Testing approvePr 401 Error', (done) => {
    const config = JSON.parse(JSON.stringify(configTemplate));
    nockBack('github-approvePr-401-error.json', {}, (nockDone) => {
      github.approvePr(config, undefined, 123).then((r) => {
        expect(logs).to.deep.equal([]);
        expect(r).to.deep.equal('401: Bad credentials');
        nockDone();
        done();
      }).catch(done.fail);
    });
  });

  it('Testing mergePr 401 Error', (done) => {
    const config = JSON.parse(JSON.stringify(configTemplate));
    nockBack('github-mergePr-401-error.json', {}, (nockDone) => {
      github.mergePr(config, undefined, 123).then((r) => {
        expect(logs).to.deep.equal([]);
        expect(r).to.deep.equal('401: Bad credentials');
        nockDone();
        done();
      }).catch(done.fail);
    });
  });

  it('Testing approvePr condition mismatch', (done) => {
    const config = JSON.parse(JSON.stringify(configTemplate));
    nockBack('github-approvePr-condition-mismatch.json', {}, (nockDone) => {
      github.approvePr(config, undefined, 123, 'unknown=key').then((r) => {
        expect(logs).to.deep.equal([]);
        expect(r).to.deep.equal('skipping: condition mismatch');
        nockDone();
        done();
      }).catch(done.fail);
    });
  });

  it('Testing mergePr condition mismatch', (done) => {
    const config = JSON.parse(JSON.stringify(configTemplate));
    nockBack('github-mergePr-condition-mismatch.json', {}, (nockDone) => {
      github.mergePr(config, undefined, 123, 'unknown=key').then((r) => {
        expect(logs).to.deep.equal([]);
        expect(r).to.deep.equal('skipping: condition mismatch');
        nockDone();
        done();
      }).catch(done.fail);
    });
  });

  it('Testing approvePr ok', (done) => {
    const config = JSON.parse(JSON.stringify(configTemplate));
    nockBack('github-approvePr-ok.json', {}, (nockDone) => {
      github.approvePr(config, undefined, 46).then((r) => {
        expect(logs).to.deep.equal([]);
        expect(r).to.deep.equal('ok');
        nockDone();
        done();
      }).catch(done.fail);
    });
  });

  it('Testing mergePr ok', (done) => {
    const config = JSON.parse(JSON.stringify(configTemplate));
    nockBack('github-mergePr-ok.json', {}, (nockDone) => {
      github.mergePr(config, undefined, 46).then((r) => {
        expect(logs).to.deep.equal([]);
        expect(r).to.deep.equal('ok');
        nockDone();
        done();
      }).catch(done.fail);
    });
  });

  it('Testing approvePr denied', (done) => {
    const config = JSON.parse(JSON.stringify(configTemplate));
    nockBack('github-approvePr-denied.json', {}, (nockDone) => {
      github.approvePr(config, undefined, 46).then((r) => {
        expect(logs).to.deep.equal([]);
        expect(r).to.deep.equal('422: Unprocessable Entity\nCan only approve open pull requests');
        nockDone();
        done();
      }).catch(done.fail);
    });
  });

  it('Testing mergePr denied', (done) => {
    const config = JSON.parse(JSON.stringify(configTemplate));
    nockBack('github-mergePr-denied.json', {}, (nockDone) => {
      github.mergePr(config, undefined, 46).then((r) => {
        expect(logs).to.deep.equal([]);
        expect(r).to.deep.equal('405: Pull Request is not mergeable');
        nockDone();
        done();
      }).catch(done.fail);
    });
  });
});
