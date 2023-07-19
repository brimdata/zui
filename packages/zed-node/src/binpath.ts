import { platform } from 'os';

const isWindows = platform() == 'win32';

export function getZedPath() {
  return require.resolve('zed/dist/' + exeName('zed'));
}

export function getZqPath() {
  return require.resolve('zed/dist/' + exeName('zq'));
}

function exeName(name: string) {
  return isWindows ? name + '.exe' : name;
}
