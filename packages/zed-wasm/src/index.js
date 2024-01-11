import { readFile } from 'fs/promises';
import { decode, ndjson } from '@brimdata/zed-js';
import '../lib/node-globals.js';
import '../lib/wasm_exec.js';
import createZedWasm from '../lib/bridge.js';
import { getWasmPath } from '../lib/node-wasm-path.js';

const wasmFile = getWasmPath();
const wasm = createZedWasm(readFile(wasmFile));

//   program?: string,
//   input?: string | File | Blob | ReadableStream | any[],
//   inputFormat?: LoadFormat,
//   outputFormat?: 'js' | 'zed',

export async function zq(opts) {
  const result = await wasm.zq({
    input: getInput(opts.input),
    inputFormat: opts.inputFormat,
    program: opts.program,
    outputFormat: 'zjson',
  });

  const zed = decode(ndjson.parseLines(result));
  if (opts.outputFormat === 'zed') return zed;
  return zed.map((val) => val.toJS());
}

function getInput(input) {
  if (typeof input === 'string') return input;
  if (input === undefined) return undefined;
  if (input === null) return undefined;
  throw new Error(`Unsupported input type provided to zq ${input}`);
}

export function parse(string) {
  return wasm.parse(string);
}
