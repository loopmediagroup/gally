module.exports.isCI = () => [
  'CI',
  'CONTINUOUS_INTEGRATION',
  'BUILD_NUMBER',
  'TRAVIS'
].some(v => process.env[v] !== undefined);
