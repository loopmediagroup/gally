module.exports.isCI = () => process.env.CI !== undefined
  || process.env.CONTINUOUS_INTEGRATION !== undefined
  || process.env.BUILD_NUMBER !== undefined
  || process.env.TRAVIS !== undefined;
