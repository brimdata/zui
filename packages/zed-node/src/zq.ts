import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { getZqPath } from './binpath';
import { Readable, Stream } from 'stream';
import { decode, ndjson } from '@brimdata/zed-js';

type ZqArgs = {
  query?: string;
  bin?: string;
  f?: string;
  i?: string;
  file?: string;
  input?: Readable;
};

export async function decodeZJSON(stream: Readable) {
  const values = [];
  for await (const value of ndjson.eachLine(stream)) values.push(value);
  return values;
}

export async function decodeZed(stream: Readable) {
  return decode(await decodeZJSON(stream));
}

export async function decodeJS(stream: Readable) {
  return (await decodeZed(stream)).map((value) => value.toJS());
}

export async function zq(
  args: Omit<ZqArgs, 'f'> & { as: 'js' | 'zed' | 'zjson' }
) {
  const zq = createProcess({ ...args, f: 'zjson', i: '' });
  if (args.input) args.input.pipe(createTransform(zq));
  switch (args.as) {
    case 'zed':
      return decodeZed(zq.stdout);
    case 'zjson':
      return decodeZJSON(zq.stdout);
    case 'js':
    default:
      return decodeJS(zq.stdout);
  }
}

export function createStream(args: Omit<ZqArgs, 'file'>) {
  const zq = createProcess(args);
  return createTransform(zq);
}

export function createTransform(zq: ChildProcessWithoutNullStreams) {
  const stream = new Stream.Transform({
    transform(chunk, encoding, callback) {
      if (!zq.stdin.write(chunk, encoding)) {
        zq.stdin.once('drain', callback);
      } else {
        process.nextTick(callback);
      }
    },

    flush(callback) {
      zq.stdin.end();
      if (zq.stdout.destroyed) callback();
      else zq.stdout.on('close', () => callback());
    },
  });

  zq.stdin.on('error', (e: Error & { code: string }) => {
    if (e.code === 'EPIPE') {
      // zq finished before reading the file finished (i.e. head proc)
      stream.destroy();
    } else {
      stream.emit('error', e);
    }
  });

  zq.stdout
    .on('data', (data) => stream.push(data))
    .on('error', (e) => {
      console.log('stdout error');
      stream.emit('error', e);
    });

  zq.stderr
    .on('data', (data) => stream.emit('error', data.toString()))
    .on('error', (e) => stream.emit('error', e));

  return stream;
}

export function createProcess(args: ZqArgs) {
  const bin = args.bin || getZqPath();
  const spawnargs = [];
  if (args.i) spawnargs.push('-i', args.i);
  if (args.f) spawnargs.push('-f', args.f);
  if (args.query) spawnargs.push(args.query);
  if (args.file) spawnargs.push(args.file);
  else spawnargs.push('-');

  return spawn(bin, spawnargs);
}
