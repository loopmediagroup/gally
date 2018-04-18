const evaluate = (configBranches, remoteBranches) => {
  const nonPartialBranches = configBranches.filter(lb => !lb.endsWith("*"));
  const partialLocalBranches = configBranches
    .filter(lb => lb.endsWith("*"))
    .map(lb => lb.slice(0, -1));
  const invalidBranches = remoteBranches.filter(rb => (
    configBranches.indexOf(rb) === -1 &&
    !partialLocalBranches.some(lb => rb.startsWith(lb))
  ));

  return {
    unexpected: invalidBranches,
    missing: nonPartialBranches.filter(b => remoteBranches.indexOf(b) === -1)
  }
};
module.exports.evaluate = evaluate;
