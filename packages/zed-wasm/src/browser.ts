import '../lib/wasm_exec';
import bridge from 'golang-wasm/src/bridge';
import { LoadFormat, decode, ndjson } from '@brimdata/zed-js';
import { getInput } from './input';

let go: any;

async function loadWasm() {
  const url = new URL('.', import.meta.url);
  const path = url.href + 'main.wasm';
  const wasm = await fetch(path);
  console.log('wasm', wasm);
  go = bridge(wasm.arrayBuffer());
}

export async function zq(opts: {
  program?: string;
  input?: string | File | Blob | ReadableStream | any[];
  inputFormat?: LoadFormat;
  outputFormat?: 'js' | 'zed';
}) {
  if (!go) await loadWasm();
  const result = await go.zq({
    input: getInput(opts.input),
    inputFormat: opts.inputFormat,
    program: opts.program,
    outputFormat: 'zjson',
  });

  const zed = decode(ndjson.parseLines(result));
  if (opts.outputFormat === 'zed') return zed;
  return zed.map((val) => val.toJS());
}

export async function parse(query: string) {
  if (!go) await loadWasm();
  return go.parse(query);
}

