import * as path from 'path';

export function getPath(name: string) {
  return path.join(__dirname, 'data', name);
}
