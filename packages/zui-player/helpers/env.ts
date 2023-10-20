import * as path from 'path';

export const repoDir = (): string =>
  path.resolve(path.join(__dirname, '..', '..', '..'));

export const itestDir = (): string =>
  path.join(process.env.WORKSPACE || 'run', 'playwright-itest');

export const isCI = () => {
  return process.env.GITHUB_ACTIONS === 'true';
};

export const isMac = () => {
  return process.platform === 'darwin';
};

export const isLinux = () => {
  return process.platform === 'linux';
};
