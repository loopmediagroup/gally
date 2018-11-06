const expect = require('chai').expect;
const logger = require('./../../src/util/logger');

describe('Testing logger.js', () => {
  let consoleWarn;
  const logs = [];

  before(() => {
    // eslint-disable-next-line no-console
    consoleWarn = console.warn;
    // eslint-disable-next-line no-console
    console.warn = input => logs.push(input);
  });

  after(() => {
    // eslint-disable-next-line no-console
    console.warn = consoleWarn;
  });

  beforeEach(() => {
    logs.length = 0;
  });

  it('Testing logger.warn', () => {
    logger.warn('test');
    expect(logs).to.deep.equal(['test']);
  });
});
