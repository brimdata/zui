const baseConfig = require('./playwright.config');

module.exports = {
  ...baseConfig,
  /* This is the list of flaky tests to ignore when running on CI */
  testIgnore: /(pool-load-fail|pool-groups).spec/,
};
