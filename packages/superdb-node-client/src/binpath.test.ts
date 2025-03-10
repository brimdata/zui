import { getZedPath, getZqPath } from './binpath';

describe('paths', () => {
  it('can find the path to zed', () => {
    getZedPath();
  });

  it('can find the path to zq', () => {
    getZqPath();
  });
});
