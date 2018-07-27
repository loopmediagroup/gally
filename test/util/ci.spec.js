const expect = require('chai').expect;
const ci = require('./../../src/util/ci');

describe("Testing ci.js", () => {
  it("Testing isCi", () => {
    expect(typeof ci.isCI()).to.equal("boolean");
  });
});
