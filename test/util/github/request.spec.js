const path = require('path');
const expect = require('chai').expect;
const { describe } = require('node-tdd');
const nockBack = require('nock').back;
const request = require('../../../src/util/github/request');

describe('Testing request', { timeout: 60000 }, () => {
  before(() => {
    nockBack.setMode('record');
    nockBack.fixtures = path.join(__dirname, '__cassette');
  });

  it('Testing get (cached)', (done) => {
    nockBack('request-get-cached.json', {}, (nockDone) => {
      request.get(
        'https://api.github.com/repos/loopmediagroup/gally',
        '--secret-token--',
        { cached: true }
      ).then((resp) => {
        expect(resp.statusCode).to.equal(200);
        request.get(
          'https://api.github.com/repos/loopmediagroup/gally',
          '--secret-token--',
          { cached: true }
        ).then((respCached) => {
          expect(respCached.statusCode).to.equal(200);
          nockDone();
          done();
        }).catch(done.fail);
      }).catch(done.fail);
    });
  });
});
