import { decode, ndjson } from '@brimdata/zed-js';
// import '../lib/node-globals.js';
import '../lib/wasm_exec.js';
import { getInput } from '../lib/input.js';
import createZedWasm from '../lib/bridge.js';

const url = new URL('.', import.meta.url);
const wasmPath = url.href + 'main.wasm';
const wasm = createZedWasm(fetch(wasmPath).then((r) => r.arrayBuffer()));

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

export function parse(string) {
  return wasm.parse(string);
}

window.zedWasm = { zq, parse };
