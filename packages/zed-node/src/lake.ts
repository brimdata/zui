import { ChildProcess, spawn, SpawnOptions } from 'child_process';
import { mkdirpSync } from 'fs-extra';
import { join } from 'path';
import { getZedPath } from './binpath';
import { get } from 'http';
import { Socket } from 'net';

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
  keepAliveSocket?: Socket;

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

  async start() {
    mkdirpSync(this.root, { mode: 0o755 });
    mkdirpSync(this.logs, { mode: 0o755 });

    const args = [
      'serve',
      '-l',
      ':' + this.port,
      '-lake',
      this.root,
      '-log.level=info',
      '-log.filemode=rotate',
      '-log.path',
      join(this.logs, 'zlake.log'),
      '-keepalive',
    ];
    for (const origin of this.cors) {
      args.push(`--cors.origin=${origin}`);
    }

    const opts = {
      stdio: ['inherit', 'inherit', 'inherit'],
      windowsHide: true,
    };
    this.lake = spawn(this.bin, args, opts as SpawnOptions);
    this.lake.on('error', (err) => {
      console.error('lake spawn error', err);
    });

    const ok = await waitFor(async () => this.isUp());
    if (ok) {
      // Poll the keepalive endpoint for the life of the program. If the
      // connection goes away the Zed process know that it has been orphaned and
      // will shutdown.
      get(`http://${this.addr()}/keepalive`, (res) => {
        if (res.statusCode !== 200) {
          console.error(`error polling keepalive endpoint: ${res.statusCode} ${res.statusMessage}`)
        } else {
          this.keepAliveSocket = res.socket
        }
      })
    }
    return ok
  }

  async stop(): Promise<boolean> {
    await this.stopPoll()
    if (this.lake) {
      return waitFor(() => this.isDown());
    } else {
      return true;
    }
  }

  stopPoll(): Promise<void> {
    return new Promise(resolve => {
      if (this.keepAliveSocket) {
        this.keepAliveSocket?.on('close', resolve)
        this.keepAliveSocket?.end()
      } else {
        resolve()
      }
    })
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
