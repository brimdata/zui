import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export function getWasmPath() {
  if (import.meta.url) {
    // In ESM we go back to the dist
    const dir = dirname(fileURLToPath(import.meta.url));
    return join(dir, '../dist/main.wasm');
  } else {
    // In CSJ we are already in dist because we got built
    const dir = __dirname;
    return join(dir, './main.wasm');
  }
}
