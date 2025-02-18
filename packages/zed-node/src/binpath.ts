import { platform } from 'os';

const isWindows = platform() == 'win32';

export function getZedPath() {
  return require.resolve('super/dist/' + exeName('super'));
}

export function getZqPath() {
  return require.resolve('super/dist/' + exeName('super'));
}

function exeName(name: string) {
  return isWindows ? name + '.exe' : name;
}
