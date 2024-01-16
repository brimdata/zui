import '../lib/node-globals.js';
import '../lib/wasm_exec.js';
import '../lib/bridge.js';
import { readFile } from 'node:fs/promises';
import { createInterface } from './interface.js';

export async function initZedWasm(wasmFilePath) {
  const go = new Go();
  const { instance } = await WebAssembly.instantiate(
    await readFile(wasmFilePath),
    go.importObject
  );
  go.run(instance);
  return createInterface(__go_wasm__, { getInput });
}

function getInput(input) {
  if (typeof input === 'string') return input;
  if (input === undefined) return undefined;
  if (input === null) return undefined;
  throw new Error(`Unsupported input type provided to zq ${input}`);
}
