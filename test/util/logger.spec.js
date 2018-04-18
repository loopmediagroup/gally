const expect = require('chai').expect;
const logger = require("./../../src/util/logger");

describe("Testing logger.js", () => {
  let consoleWarn;
  const logs = [];

  before(() => {
    consoleWarn = console.warn;
    console.warn = input => logs.push(input);
  });

  after(() => {
    console.warn = consoleWarn;
  });

  beforeEach(() => {
    logs.length = 0;
  });

  it("Testing logger.warn", () => {
    logger.warn("test");
    expect(logs).to.deep.equal(["test"]);
  });
});
