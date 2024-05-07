import {
  decode,
  BaseClient,
  LoadOpts,
  getLoadContentType,
  jsonHeader,
} from '@brimdata/zed-js';
// @ts-ignore
import nodeFetch from 'node-fetch';

export class Client extends BaseClient {
  public fetch = (...args: any[]) => nodeFetch(...args);

  async load(
    data: string | NodeJS.ReadableStream,
    opts: Partial<LoadOpts> = {}
  ) {
    const { pool } = opts;
    if (!pool) throw new Error("Missing required option 'pool'");
    const poolId = typeof pool === 'string' ? pool : pool.id;
    const branch = opts.branch || 'main';
    const headers: Record<string, string> = {};
    if (opts.message) headers['Zed-Commit'] = jsonHeader(opts.message);
    const res = await this.send({
      path: `/pool/${poolId}/branch/${encodeURIComponent(branch)}`,
      method: 'POST',
      // @ts-ignore
      body: data,
      duplex: 'half',
      headers,
      contentType: getLoadContentType(opts.format) ?? '',
      signal: opts.signal,
      timeout: Infinity,
    });
    return decode(await res.json()).toJS();
  }
}
