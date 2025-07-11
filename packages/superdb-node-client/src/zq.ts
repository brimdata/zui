import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { getZqPath } from './binpath';
import { Readable, Stream, pipeline } from 'stream';
import { pipeline as promisePipeline } from 'stream/promises';
import { Value, decode, ndjson, jsup } from '../../superdb-types/dist';
import { arrayWrap } from './util';

type ZqArgs = {
  query?: string;
  bin?: string;
  f?: string;
  i?: string;
  file?: string | string[];
  input?: Readable | string;
  signal?: AbortSignal;
};

type Output = 'js' | 'zed' | 'jsup';

export async function decodeJSUP(stream: Readable) {
  const values = [];
  for await (const value of ndjson.eachLine(stream)) values.push(value);
  return values;
}

export async function decodeZed(stream: Readable) {
  return decode(await decodeJSUP(stream));
}

export async function decodeJS(stream: Readable) {
  return (await decodeZed(stream)).map((value) => value.toJS());
}

export function decodeStream(as: Output) {
  return async function (src: AsyncIterable<object>) {
    switch (as) {
      case 'zed':
        return decodeZed(src as Readable);
      case 'jsup':
        return decodeJSUP(src as Readable);
      case 'js':
      default:
        return decodeJS(src as Readable);
    }
  };
}

function readableStream(zq: ChildProcessWithoutNullStreams, args: ZqArgs) {
  if (args.input)
    return pipeline(wrapInput(args.input), transformStream(zq), (err) => {
      err; // There was an error in the pipeline, but users can listen for the event
    });
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

function transformStream(sub: ChildProcessWithoutNullStreams) {
  const stream = new Stream.Transform({
    transform(chunk, encoding, callback) {
      if (!sub.stdin.write(chunk, encoding)) {
        sub.stdin.once('drain', callback);
      } else {
        process.nextTick(callback);
      }
    },

    flush(callback) {
      sub.stdin.end();
      if (sub.stdout.destroyed) callback();
      else sub.stdout.on('close', () => callback());
    },
  });

  stream.on('error', () => {
    sub.kill('SIGKILL');
  });

  sub.stdin.on('error', (e: Error & { code: string }) => {
    if (e.code === 'EPIPE') {
      stream.push(null);
    } else {
      stream.destroy(e);
    }
  });

  sub.stdout
    .on('data', (data) => stream.push(data))
    .on('error', (e) => stream.destroy(e));

  sub.stderr
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
  if (args.query) spawnargs.push('-c', args.query);
  if (args.file) spawnargs.push(...arrayWrap(args.file));
  else spawnargs.push('-');

  const zq = spawn(bin, spawnargs, { signal: args.signal }).on('error', (e) => {
    // This error must be caught in order to not throw an exception in main process
    // Also, really make sure this process is killed. It wasn't with only the SIGTERM
    if (e?.name == 'AbortError') zq.kill('SIGKILL');
    else console.error(e);
  });
  return zq;
}

/**
 * Invokes the zq command then wraps the child process in a
 * transform stream. You can pipe your own input to the
 * transform stream.
 */
export function createTransformStream(args: ZqArgs) {
  console.log(args)
  const zq = createProcess(args);
  return transformStream(zq);
}

/**
 * Invokes the zq command then wraps the child process in a
 * readable stream to be used as the source a pipeline.
 */
export function createReadableStream(args: ZqArgs) {
  const zq = createProcess(args);
  return readableStream(zq, args);
}

/**
 * Use this function to invoke the zq cli and receive an array of
 * results as either Zed objects, JS objects, or JSUP objects.
 */
export async function zq(
  args: Omit<ZqArgs, 'f'> & { as: 'jsup' }
): Promise<jsup.Obj[]>;
export async function zq(
  args: Omit<ZqArgs, 'f'> & { as: 'js' }
): Promise<any[]>;
export async function zq(
  args: Omit<ZqArgs, 'f'> & { as: 'zed' }
): Promise<Value[]>;
export async function zq(
  args: Omit<ZqArgs, 'f'> & { as: Output }
): Promise<object[]> {
  const zq = createProcess({ ...args, f: 'jsup' });

  return await promisePipeline(
    readableStream(zq, args),
    decodeStream(args.as),
    { signal: args.signal as AbortSignal }
  );
}
