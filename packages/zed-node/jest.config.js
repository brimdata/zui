module.exports = {
  transform: { '^.+\\.(t|j)sx?$': '@swc/jest' },
  moduleNameMapper: {
    '@brimdata/sample-data': '<rootDir>/../sample-data/index.js',
    '@brimdata/zed-js': '<rootDir>/../zed-js/src/index.ts',
  },
};
