import { EventSourcePolyfill } from 'event-source-polyfill';
import { PoolConfig, PoolStats } from '../types';
import { ResultStream } from '../query/result-stream';
import { createError } from '../util/error';
import * as Types from './types';
import { accept, defaults, parseContent, toJS, wrapAbort } from './utils';

export abstract class BaseClient {
  public abstract fetch: Types.IsoFetch;
  public auth: string | null;
  public timeout = 60_000;

  constructor(public baseURL: string, opts: Partial<Types.ClientOpts> = {}) {
    const defaults: Types.ClientOpts = { auth: null };
    const options: Types.ClientOpts = { ...defaults, ...opts };
    this.auth = options.auth || null;
  }

  async version() {
    const r = await this.send({
      method: 'GET',
      path: '/version',
    });
    return await r.json();
  }

  async authMethod() {
    const r = await this.send({
      method: 'GET',
      path: '/auth/method',
    });
    return toJS(r);
  }

  async query(query: string, opts: Partial<Types.QueryOpts> = {}) {
    const options = defaults<Types.QueryOpts>(opts, {
      format: 'zjson',
      controlMessages: true,
    });
    const abortCtl = wrapAbort(options.signal);
    const result = await this.send({
      method: 'POST',
      path: `/query?ctrl=${options.controlMessages}`,
      body: JSON.stringify({ query }),
      contentType: 'application/json',
      format: options.format,
      signal: abortCtl.signal,
      timeout: options.timeout,
    });
    return new ResultStream(result, abortCtl);
  }

  async createPool(name: string, opts: Partial<Types.CreatePoolOpts> = {}) {
    const options = defaults<Types.CreatePoolOpts>(opts, {
      order: 'desc',
      key: ['ts'],
    });

    const keys =
      typeof options.key === 'string' ? [[options.key]] : [options.key];
    const layout = { order: options.order, keys };
    return this.send({
      method: 'POST',
      path: '/pool',
      body: JSON.stringify({ name, layout }),
      contentType: 'application/json',
    }).then(toJS);
  }

  async deletePool(poolId: string) {
    await this.send({
      method: 'DELETE',
      path: `/pool/${poolId}`,
    });
    return true;
  }

  async getPools(): Promise<Types.Pool[]> {
    const resp = await this.query('from :pools');
    return resp.js();
  }

  async getPool(nameOrId: string): Promise<PoolConfig> {
    const res = await this.query(
      `from :pools | id == ${nameOrId} or name == "${nameOrId}"`
    );
    const values = await res.js();
    if (!values || values.length == 0)
      throw new Error(`Pool Not Found: ${nameOrId}`);
    return values[0];
  }

  async getPoolStats(poolId: string): Promise<PoolStats> {
    const res = await this.send({
      method: 'GET',
      path: `/pool/${poolId}/stats`,
    });
    return toJS(res);
  }

  async updatePool(poolId: string, args: Partial<Types.Pool>) {
    await this.send({
      method: 'PUT',
      path: `/pool/${poolId}`,
      body: JSON.stringify(args),
      contentType: 'application/json',
    });
    return true;
  }

  subscribe(): EventSource {
    return new EventSourcePolyfill(this.baseURL + '/events', {
      headers: { Accept: 'application/json' },
    });
  }

  curl(query: string, opts: Partial<Types.QueryOpts> = {}) {
    const options = defaults<Types.QueryOpts>(opts, {
      format: 'zjson',
      controlMessages: true,
    });
    return `curl -X POST -d '${JSON.stringify({ query })}' \\
  -H "Accept: ${accept(options.format)}" \\
  -H "Content-Type: application/json" \\
  ${this.baseURL}/query`;
  }

  protected async send(opts: {
    method: 'GET' | 'POST' | 'DELETE' | 'PUT';
    path: string;
    body?: Types.IsoBody;
    format?: Types.ResponseFormat;
    signal?: Types.IsoAbortSignal;
    headers?: Record<string, string>;
    timeout?: number;
    contentType?: string;
  }) {
    const abortCtl = wrapAbort(opts.signal);
    const clearTimer = this.setTimeout(() => {
      abortCtl.abort();
    }, opts.timeout);
    const headers = { ...opts.headers };
    headers['Accept'] = accept(opts.format || 'zjson');
    if (opts.contentType !== undefined) {
      headers['Content-Type'] = opts.contentType;
    }
    if (this.auth) {
      headers['Authorization'] = `Bearer ${this.auth}`;
    }
    const resp = await this.fetch(this.baseURL + opts.path, {
      method: opts.method,
      headers: headers,
      // eslint-disable-next-line
      // @ts-ignore
      signal: abortCtl.signal,
      // eslint-disable-next-line
      // @ts-ignore
      body: opts.body,
    });
    clearTimer();
    if (resp.ok) {
      return resp;
    } else {
      return Promise.reject(createError(await parseContent(resp)));
    }
  }

  private setTimeout(fn: () => void, ms?: number) {
    if (ms === Infinity) return () => void 0;
    if (ms === undefined) ms = this.timeout;
    const id = setTimeout(fn, ms);
    return () => clearTimeout(id);
  }
}
