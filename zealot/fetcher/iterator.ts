import { isObject } from "../util/utils.ts";
import { pipeJson } from "./pipeJson.ts";
import { pipeText } from "./pipeText.ts";
import { parseContentType } from "./contentType.ts";
import { Payload, Enhancer, ZIterator } from "../types.ts";
import { FetchArgs } from "./fetcher.ts";


export async function* createIterator(resp: Response, args: FetchArgs): ZIterator {
  if (!resp.ok) {
    let contents = await parseContentType(resp);
    if (isObject(contents)) throw contents;
    else throw new Error(contents);
  }

  const enhancers = (args.enhancers || []).map((fn: Enhancer) => fn());

  for await (let json of pipeJson(pipeText(resp.body))) {
    yield enhancers.reduce((payload: Payload, fn: (p: Payload) => any) => fn(payload), json);
  }
}
