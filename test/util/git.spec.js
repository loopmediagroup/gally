const expect = require('chai').expect;
const shell = require('../../src/util/shell');
const git = require('../../src/util/git');

describe('Testing git.js', () => {
  let shellRun;
  let lookup = {};

  before(() => {
    shellRun = shell.run;
    shell.run = (input) => (lookup[input]);
  });

  after(() => {
    shell.run = shellRun;
  });

  beforeEach(() => {
    lookup = {
      'git remote': 'origin\nupstream\n',
      'git config --get remote.upstream.url': 'https://github.com/loopmediagroup/gally.git',
      'git config --get remote.origin.url': 'https://github.com/simlu/gally.git',
      'git rev-parse --abbrev-ref HEAD': 'dev'
    };
  });

  it('Testing ghPrUrl Default', (done) => {
    git.ghPrUrl().then((r) => {
      expect(r).to.equal('https://github.com/loopmediagroup/gally/compare/dev...simlu:dev?expand=1');
      done();
    }).catch(done.fail);
  });

  it('Testing ghPrUrl Custom Target', (done) => {
    git.ghPrUrl({}, 'custom').then((r) => {
      expect(r).to.equal('https://github.com/loopmediagroup/gally/compare/custom...simlu:dev?expand=1');
      done();
    }).catch(done.fail);
  });

  it('Testing getRemoteOrBestGuess no git remote defined.', (done) => {
    lookup['git remote'] = '';
    git.getRemoteOrBestGuess('origin', 'upstream').catch((e) => {
      expect(e.message).to.equal('No git remotes defined.');
      done();
    }).then(done.fail);
  });

  it('Testing getRemoteOrBestGuess single with exclude still returned.', (done) => {
    lookup['git remote'] = 'custom\n';
    git.getRemoteOrBestGuess('origin', 'custom').then((r) => {
      expect(r).to.equal('custom');
      done();
    }).catch(done.fail);
  });

  it('Testing getRemoteOrBestGuess position with exclude returns second.', (done) => {
    lookup['git remote'] = 'custom\ncustom2\n';
    git.getRemoteOrBestGuess('origin', 'custom').then((r) => {
      expect(r).to.equal('custom2');
      done();
    }).catch(done.fail);
  });
});
