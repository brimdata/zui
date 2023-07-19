import '../lib/wasm_exec';
import bridge from 'golang-wasm/src/bridge';
import { LoadFormat, decode, ndjson } from '@brimdata/zed-js';

const url = new URL('.', import.meta.url);
const path = url.href + 'main.wasm';
const wasm = await fetch(path);
const go = bridge(wasm.arrayBuffer());

export async function zq(opts: {
  program?: string;
  input?: string | File | Blob | ReadableStream | any[];
  inputFormat?: LoadFormat;
  outputFormat?: 'js' | 'zed';
}) {
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

function getInput(
  input: string | File | Blob | ReadableStream | Response | undefined | any[]
) {
  if (typeof input === 'string') return input;
  if (input instanceof File) return input.stream();
  if (input instanceof Blob) return input.stream();
  if (input instanceof ReadableStream) return input;
  if (input instanceof Response) return input.body;
  if (Array.isArray(input)) return arrayStream(input);
  if (input === undefined) return undefined;
  if (input === null) return undefined;
  throw new Error(`Unsupported input type provided to zq ${input}`);
}

function arrayStream(input: any[]) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(ctl) {
      for (const item of input) {
        ctl.enqueue(encoder.encode(JSON.stringify(item) + '\n'));
      }
      ctl.close();
    },
  });
}
