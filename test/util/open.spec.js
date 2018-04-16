const expect = require('chai').expect;
const open = require('./../../src/util/open');

describe("Testing open.js", () => {
  it("Testing Error", (done) => {
    expect(() => open("invalid")).to.throw("");
    done();
  });
});
