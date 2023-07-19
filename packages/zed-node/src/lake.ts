import { ChildProcess, spawn, SpawnOptions } from 'child_process';
import { mkdirpSync } from 'fs-extra';
import { join } from 'path';
import fetch from 'node-fetch';
import { getZedPath } from './binpath';

type ConstructorOpts = {
  root: string;
  logs: string;
  port?: number;
  bin?: string;
  corsOrigins?: string[];
};
export class Lake {
  lake?: ChildProcess;
  root: string;
  port: number;
  logs: string;
  bin: string;
  cors: string[];

  constructor(opts: ConstructorOpts) {
    this.root = opts.root;
    this.logs = opts.logs;
    this.port = opts.port || 9867;
    this.bin = opts.bin || getZedPath();
    this.cors = opts.corsOrigins || [];
  }

  addr(): string {
    return `localhost:${this.port}`;
  }

  start() {
    mkdirpSync(this.root, { mode: 0o755 });
    mkdirpSync(this.logs, { mode: 0o755 });

    const args = [
      'serve',
      '-l',
      this.addr(),
      '-lake',
      this.root,
      '-log.level=info',
      '-log.filemode=rotate',
      '-log.path',
      join(this.logs, 'zlake.log'),
    ];
    for (const origin of this.cors) {
      args.push(`--cors.origin=${origin}`);
    }

    const opts = {
      stdio: ['inherit', 'inherit', 'inherit'],
      windowsHide: true,
    };
    // For unix systems, pass posix pipe read file descriptor into lake process.
    // In the event of Zui getting shutdown via `SIGKILL`, this will let lake
    // know that it has been orphaned and to shutdown.

    if (process.platform !== 'win32') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { readfd } = require('node-pipe').pipeSync();
      opts.stdio.push(readfd);
      args.push(`-brimfd=${opts.stdio.length - 1}`);
    }

    this.lake = spawn(this.bin, args, opts as SpawnOptions);
    this.lake.on('error', (err) => {
      console.error('lake spawn error', err);
    });

    return waitFor(async () => this.isUp());
  }

  async stop(): Promise<boolean> {
    if (this.lake) {
      this.lake.kill('SIGTERM');
      return waitFor(() => this.isDown());
    } else {
      return true;
    }
  }

  async isUp() {
    try {
      const response = await fetch(`http://${this.addr()}/status`);
      const text = await response.text();
      return text === 'ok';
    } catch (e) {
      return false;
    }
  }

  async isDown() {
    return !(await this.isUp());
  }
}

async function waitFor(condition: () => Promise<boolean>) {
  let giveUp = false;
  const id = setTimeout(() => {
    giveUp = true;
  }, 5000);

  while (!giveUp) {
    if (await condition()) break;
    await sleep(50);
  }

  clearTimeout(id);
  return !giveUp;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
