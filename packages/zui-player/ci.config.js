import baseConfig from './playwright.config';

export default {
  ...baseConfig,
  /* This is the list of flaky tests to ignore when running on CI */
  testIgnore: /(pool-load-fail|pool-groups).spec/,
};
