/* @flow */

import {url} from "./utils"
import jsonPipeIterator from "./jsonPipeIterator"
import textIterator from "./textIterator"

export type FetchGenerator = AsyncGenerator<Object, void, void>
export type FetchPromise = Promise<Object>
export type FetchArgs = {method: string, path: string, body?: string}

function parseResponse(resp) {
  switch (resp.headers.get("Content-Type")) {
    case "application/ndjson":
    case "application/json":
      return resp.json()
    default:
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
  const content = await parseResponse(resp)
  if (!resp.ok) throw new Error(content)
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
