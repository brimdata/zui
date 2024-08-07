import { EventEmitter } from 'events';
import { eachLine } from '../ndjson/lines';
import { JSOptions } from '../values/types';
import * as zjson from '../zjson';
import { Channel } from './channel';
import { Collector } from '../types';
import { IsoResponse } from '../client/types';

export class ResultStream extends EventEmitter {
  public status: 'idle' | 'pending' | 'error' | 'aborted' | 'success' = 'idle';

  private currentChannel: string | undefined;
  private channelsMap = new Map<string, Channel>();
  private _promise?: Promise<void>;

  constructor(public resp: IsoResponse, private ctl: AbortController) {
    super();
  }

  get requestId() {
    return this.resp.headers.get('x-request-id');
  }

  get body() {
    return this.resp.body;
  }

  get promise() {
    return this.consume();
  }

  get channels() {
    return Array.from(this.channelsMap.values());
  }

  get shapes() {
    return this.channel("main").shapes;
  }

  get rows() {
    return this.channel("main").rows;
  }

  channel(name: string | undefined = this.currentChannel) {
    if (name === undefined) throw new Error('Current channel not set');
    let channel = this.channelsMap.get(name);
    if (!channel) {
      channel = new Channel();
      this.channelsMap.set(name, channel);
    }
    return channel;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async js(opts: JSOptions = {}): Promise<any> {
    this.consume();
    const channel = this.channel("main");
    await this.promise;
    return channel.rows.map((r) => r.toJS(opts));
  }

  async zed() {
    this.consume();
    const channel = this.channel("main");
    await this.promise;
    return channel.rows;
  }

  collect(collector: Collector) {
    this.consume();
    this.channel("main").collect(collector);
    return this.promise;
  }

  abort() {
    this.ctl.abort();
  }

  private consume() {
    if (this._promise) return this._promise;

    this.status = 'pending';
    // eslint-disable-next-line
    this._promise = new Promise(async (resolve, reject) => {
      try {
        for await (const json of eachLine(this.resp.body)) {
          this.consumeLine(json);
        }
        this.status = 'success';
        this.emit('success');
        resolve();
      } catch (e: unknown) {
        if (
          (e instanceof Object && 'name' in e && e.name === 'AbortError') ||
          (e instanceof DOMException && e.message.match(/user aborted/)) ||
          (e instanceof Error && e.message.match(/context canceled/))
        ) {
          this.status = 'aborted';
          reject(e);
        } else {
          this.status = 'error';
          reject(e);
        }
      }
    });

    return this._promise;
  }

  private getChannel(o: any): string {
    // XXX This is here to support backwards compatibility for the channel name
    // in the query API. This can be removed after a reasonable period from
    // 8/2024.
    if ("channel_id" in o) {
      return o.channel_id === 0 ? "main" : o.channel_id.toString()
    }
    return o.channel
  }

  private consumeLine(json: zjson.QueryObject) {
    switch (json.type) {
      case 'QueryChannelSet':
        this.currentChannel = this.getChannel(json.value)
        break;
      case 'QueryChannelEnd':
        this.currentChannel = this.getChannel(json.value)
        this.channel().done();
        break;
      case 'QueryStats':
        // Do something with stats eventually
        break;
      case 'QueryError':
        throw new Error(json.value.error);
      default:
        if (typeof json.type === 'object') {
          this.channel().consume(json);
          break;
        }
        console.error('Unknown zjson object', json);
    }
  }
}
