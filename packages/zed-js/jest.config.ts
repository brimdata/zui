const esModules = ['d3-time-format', 'd3-time', 'd3-array', 'internmap'].join(
  '|'
);

export default {
  displayName: 'zed-js',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['@swc/jest'],
  },
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  moduleFileExtensions: ['ts', 'js', 'html'],
};
