import { eachLine } from '../ndjson/lines';
import { JSOptions } from '../values/types';
import * as zjson from '../zjson';
import { Channel } from './channel';
import { Collector } from '../types';
import { IsoResponse } from '../client/types';

export class ResultStream {
  public status: 'idle' | 'pending' | 'error' | 'aborted' | 'success' = 'idle';

  private currentChannelId: number | undefined;
  private channelsMap = new Map<number, Channel>();
  private _promise?: Promise<void>;

  constructor(public resp: IsoResponse, private ctl: AbortController) {}

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
    return this.channel(0).shapes;
  }

  get rows() {
    return this.channel(0).rows;
  }

  channel(id: number | undefined = this.currentChannelId) {
    if (id === undefined) throw new Error('Current channel not set');
    let channel = this.channelsMap.get(id);
    if (!channel) {
      channel = new Channel();
      this.channelsMap.set(id, channel);
    }
    return channel;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async js(opts: JSOptions = {}): Promise<any> {
    this.consume();
    const channel = this.channel(0);
    await this.promise;
    return channel.rows.map((r) => r.toJS(opts));
  }

  async zed() {
    this.consume();
    const channel = this.channel(0);
    await this.promise;
    return channel.rows;
  }

  collect(collector: Collector) {
    this.consume();
    this.channel(0).collect(collector);
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
        resolve();
      } catch (e) {
        if (
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

  private consumeLine(json: zjson.QueryObject) {
    switch (json.type) {
      case 'QueryChannelSet':
        this.currentChannelId = json.value.channel_id;
        break;
      case 'QueryChannelEnd':
        this.currentChannelId = json.value.channel_id;
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
