/* eslint-disable no-console */
module.exports = ['warn', 'info', 'error']
  .reduce((prev, cur) => Object.assign(prev, { [cur]: input => console[cur](input) }), {});
