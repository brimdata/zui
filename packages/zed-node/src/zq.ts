/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { getZqPath } from './binpath';
import { Readable, Stream } from 'stream';
import { Value, decode, ndjson, zjson } from '@brimdata/zed-js';
import { pipeline } from 'stream/promises';

type ZqArgs = {
  query?: string;
  bin?: string;
  f?: string;
  i?: string;
  file?: string;
  input?: Readable | string;
};

type Output = 'js' | 'zed' | 'zjson';

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

export function decodeStream(as: Output) {
  return async function (src: AsyncIterable<object>) {
    switch (as) {
      case 'zed':
        return decodeZed(src as Readable);
      case 'zjson':
        return decodeZJSON(src as Readable);
      case 'js':
      default:
        return decodeJS(src as Readable);
    }
  };
}

function createReadable(zq: ChildProcessWithoutNullStreams, args: ZqArgs) {
  if (args.input) return wrapInput(args.input).pipe(createTransformStream(zq));
  if (args.file) return wrapStdout(zq);
  throw new Error('Provide input or file arg to zq()');
}

function wrapInput(input: string | Readable) {
  if (typeof input === 'string') return Readable.from([input]);
  return input;
}

function wrapStdout(zq: ChildProcessWithoutNullStreams) {
  zq.stderr
    .on('data', (data) => zq.stdout.destroy(new Error(data.toString())))
    .on('error', (e) => zq.stdout.destroy(e));

  return zq.stdout;
}

function createTransformStream(child: ChildProcessWithoutNullStreams) {
  const stream = new Stream.Transform({
    transform(chunk, encoding, callback) {
      if (!child.stdin.write(chunk, encoding)) {
        child.stdin.once('drain', callback);
      } else {
        process.nextTick(callback);
      }
    },

    flush(callback) {
      child.stdin.end();
      if (child.stdout.destroyed) callback();
      else child.stdout.on('close', () => callback());
    },
  });

  child.stdin.on('error', (e: Error & { code: string }) => {
    if (e.code === 'EPIPE') {
      // zq finished before reading the file finished (i.e. head proc)
      stream.emit('end');
    } else {
      stream.destroy(e);
    }
  });

  child.stdout
    .on('data', (data) => stream.push(data))
    .on('error', (e) => stream.destroy(e));

  child.stderr
    .on('data', (data) => stream.destroy(new Error(data.toString())))
    .on('error', (e) => stream.destroy(e));

  return stream;
}

/**
 * Spawn the zq process with the appropriate arguments and return the
 * child process object.
 */
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

/**
 * Invokes the zq command then wraps the child process in a
 * transform stream. You can pipe your own input to the
 * transform stream.
 */
export function createStream(args: Omit<ZqArgs, 'file'>) {
  const zq = createProcess(args);
  return createTransformStream(zq);
}

/**
 * Use this function to invoke the zq cli and receive an array of
 * results as either Zed objects, JS objects, or zjson objects.
 */
export async function zq(
  args: Omit<ZqArgs, 'f'> & { as: 'zjson' }
): Promise<zjson.Obj[]>;
export async function zq(
  args: Omit<ZqArgs, 'f'> & { as: 'js' }
): Promise<any[]>;
export async function zq(
  args: Omit<ZqArgs, 'f'> & { as: 'zed' }
): Promise<Value[]>;
export async function zq(
  args: Omit<ZqArgs, 'f'> & { as: Output }
): Promise<object[]> {
  const zq = createProcess({ ...args, f: 'zjson' });

  return await pipeline(createReadable(zq, args), decodeStream(args.as));
}
