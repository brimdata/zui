/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  transformIgnorePatterns: [
    'd3-time-format',
    'd3-time',
    'd3-array',
    'internmap',
  ].map((name) => `/node_modules/${name}`),
};
