/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  moduleNameMapper: {
    '@brimdata/sample-data': '<rootDir>/../sample-data/index.js',
    '@brimdata/zed-js': '<rootDir>/../zed-js/src/index.ts',
  },
};
