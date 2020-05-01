/* @flow */

import {isObject} from "../../lib/is"
import {url} from "./utils"
import jsonPipeIterator from "./jsonPipeIterator"
import textIterator from "./textIterator"

export type FetchGenerator = AsyncGenerator<Object, void, void>
export type FetchPromise = Promise<Object>
export type FetchArgs = {method: string, path: string, body?: string}

export function parseResponse(resp: Response): Promise<*> {
  switch (resp.headers.get("Content-Type")) {
    case "application/json":
      try {
        return resp.json()
      } catch {
        console.error("Unable to parse json content, parsing as text instead")
        return resp.text()
      }
    case "text/html; charset=UTF-8":
      return resp.text()
    default:
      console.error("unknown Content-Type, parsing as text")
      return resp.text()
  }
}

export async function fetchPromise(
  host: string,
  args: FetchArgs
): FetchPromise {
  const resp = await doFetch(host, args)
  const content = await parseResponse(resp)
  return resp.ok ? content : Promise.reject(content)
}

export async function* fetchGenerator(
  host: string,
  args: FetchArgs
): FetchGenerator {
  let resp = await doFetch(host, args)
  if (!resp.ok) {
    let contents = await parseResponse(resp)
    if (isObject(contents)) throw contents
    else throw new Error(contents)
  }
  let {body} = resp
  if (body) {
    for await (let json of jsonPipeIterator(textIterator(body))) {
      yield json
    }
  }
}

function doFetch(host, {method, path, body}) {
  return fetch(url(host, path), {method, body})
}
