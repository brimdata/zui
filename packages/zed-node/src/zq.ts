import { spawn } from 'child_process';
import { getZqPath } from './binpath';

function execute(bin: string, opts: string[], input?: string) {
  return new Promise<string>((resolve, reject) => {
    const p = spawn(bin, opts)
      .on('error', (e) => reject(e))
      .on('close', () => resolve(out));

    let out = '';
    p.stdout.on('data', (data: string) => (out += data));
    p.stderr.on('data', (data: string) => (out += data));
    if (input) {
      p.stdin.write(input);
      p.stdin.end();
    }
  });
}

function parseNDJSON(input: string) {
  return input
    .trim()
    .split('\n')
    .map((s) => {
      try {
        return JSON.parse(s);
      } catch (_) {
        throw new Error(s);
      }
    });
}

export async function zq(opts: {
  query?: string;
  file?: string;
  input?: string;
  format?: string;
  bin?: string;
  // eslint-disable-next-line
}): Promise<any> {
  const bin = opts.bin || getZqPath();
  const args = [];
  if (opts.format) args.push('-f', opts.format);
  if (opts.query) args.push(opts.query);
  if (opts.file) args.push(opts.file);
  else if (opts.input) args.push('-');

  const result = await execute(bin, args, opts.input);
  if (opts.format === 'zjson') {
    return parseNDJSON(result);
  } else {
    return result;
  }
}
