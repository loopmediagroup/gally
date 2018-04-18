const expect = require('chai').expect;
const branches = require("./../../../src/util/git/branches");

const check = (configBranches, remoteBranches, expected) => {
  expect(branches.evaluate(configBranches, remoteBranches)).to.deep.equal(expected);
};

describe("Testing branches", () => {
  it("Testing evaluate: Matching", () => {
    check(["master"], ["master"], { unexpected: [], missing: [] });
  });

  it("Testing evaluate: Matching with Star", () => {
    check(["prefix/*"], ["prefix/other"], { unexpected: [], missing: [] });
  });

  it("Testing evaluate: Unexpected", () => {
    check(["master"], ["custom"], { unexpected: ["custom"], missing: ["master"] });
  });

  it("Testing evaluate: Unexpected with Star", () => {
    check(["feat/*"], ["custom"], { unexpected: ["custom"], missing: [] });
  });

  it("Testing evaluate: Missing", () => {
    check(["master"], [], { unexpected: [], missing: ["master"] });
  });

  it("Testing evaluate: Missing with Star (not returned)", () => {
    check(["feat/*"], [], { unexpected: [], missing: [] });
  });
});
