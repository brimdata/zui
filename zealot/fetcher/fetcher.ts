import { url } from "../util/utils.ts";
import { parseContentType } from "./contentType.ts";
import { Enhancer } from "../types.ts";
import { createIterator } from "./iterator.ts";
import { createStream } from "./stream.ts";

export type FetchArgs = {
  path: string;
  method: string;
  body?: string;
  enhancers?: Enhancer[];
};

export function createFetcher(host: string) {
  return {
    async promise(args: FetchArgs) {
      const { path, method, body } = args;
      const resp = await fetch(url(host, path), { method, body });
      const content = await parseContentType(resp);
      return resp.ok ? content : Promise.reject(content);
    },
    async stream(args: FetchArgs) {
      const { path, method, body } = args;
      const ctl = new AbortController();
      const resp = await fetch(
        url(host, path),
        { method, body, signal: ctl.signal },
      );
      const abort = () => ctl.abort();
      const iterator = createIterator(resp, args);
      return createStream(iterator, abort, resp);
    },
  };
}
