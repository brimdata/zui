import { ChildProcess, spawn, SpawnOptions } from 'child_process';
import { mkdirpSync } from 'fs-extra';
import { join } from 'path';
import { getZedPath } from './binpath';
import { waitFor } from './util';

type ConstructorOpts = {
  root: string;
  logs: string;
  addr: string;
  port?: number;
  bin?: string;
  corsOrigins?: string[];
};

export class Lake {
  fetch = globalThis.fetch;
  lake?: ChildProcess;
  root: string;
  addr: string;
  port: number;
  logs: string;
  bin: string;
  cors: string[];

  constructor(opts: ConstructorOpts) {
    this.root = opts.root;
    this.logs = opts.logs;
    this.addr = opts.addr ?? 'localhost';
    this.port = opts.port || 9867;
    this.bin = opts.bin || getZedPath();
    this.cors = opts.corsOrigins || [];
  }

  asJSON() {
    return {
      root: this.root,
      logs: this.logs,
      addr: this.addr,
      port: this.port,
      bin: this.bin,
      cors: this.cors,
    };
  }

  start() {
    mkdirpSync(this.root, { mode: 0o755 });
    mkdirpSync(this.logs, { mode: 0o755 });

    const args = [
      'db',
      'serve',
      '-l',
      `${this.addr}:${this.port}`,
      '-lake',
      this.root,
      '-manage=5m',
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
    // For unix systems, pass a pipe file descriptor into the lake process.
    // In the event of Zui getting shutdown via `SIGKILL`, this will let lake
    // know that it has been orphaned and to shutdown.

    if (process.platform !== 'win32') {
      opts.stdio.push('pipe');
      args.push(`-brimfd=${opts.stdio.length - 1}`);
    }

    this.lake = spawn(this.bin, args, opts as SpawnOptions);
    this.lake.on('error', (err) => {
      console.error('lake spawn error', err);
    });

    return waitFor(async () => this.isUp());
  }

  stop(): Promise<boolean> {
    if (this.lake) {
      this.lake.kill('SIGTERM');
      return waitFor(() => this.isDown());
    } else {
      return Promise.resolve(true);
    }
  }

  async isUp() {
    try {
      const response = await this.fetch(this.statusUrl);
      const text = await response.text();
      return text === 'ok';
    } catch (e) {
      return false;
    }
  }

  async isDown() {
    return !(await this.isUp());
  }

  get statusUrl() {
    // 'localhost' will always get us to the zed service,
    // even when the addr is set to an empty string.
    return `http://localhost:${this.port}/status`;
  }
}
