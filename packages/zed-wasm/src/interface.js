import { decode, ndjson } from '@brimdata/zed-js';

export function createInterface(go, deps) {
  return {
    //   program?: string,
    //   input?: string | File | Blob | ReadableStream | any[],
    //   inputFormat?: LoadFormat,
    //   outputFormat?: 'js' | 'zed',
    zq: async (opts) => {
      const result = await go.zq({
        input: deps.getInput(opts.input),
        inputFormat: opts.inputFormat,
        program: opts.program,
        outputFormat: 'zjson',
      });

      const zed = decode(ndjson.parseLines(result));
      if (opts.outputFormat === 'zed') return zed;
      return zed.map((val) => val.toJS());
    },

    parse: (string) => go.parse(string),
  };
}
