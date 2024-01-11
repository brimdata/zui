import { join } from 'path';

export function getWasmPath() {
  // In CSJ we are already in dist because we got built
  const dir = __dirname;
  return join(dir, './main.wasm');
}
