import {isObject} from "../util/utils"
import {pipeJson} from "./pipeJson"
import {pipeText} from "./pipeText"
import {parseContentType} from "./contentType"
import {Enhancer, ZIterator} from "../types"
import {FetchArgs} from "./fetcher"
import * as zqd from "../zqd"

export async function* createIterator(
  resp: Response,
  args: FetchArgs
): ZIterator {
  if (!resp.ok) {
    let contents = await parseContentType(resp)
    if (isObject(contents)) throw contents
    else throw new Error(contents)
  }

  const enhancers = (args.enhancers || []).map((fn: Enhancer) => fn())

  for await (let json of pipeJson(pipeText(resp.body))) {
    yield enhancers.reduce(
      (payload: zqd.Payload, fn: (p: zqd.Payload) => any) => fn(payload),
      json
    )
  }
}
