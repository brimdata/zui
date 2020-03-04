/* @flow */

import {tryJson, url} from "./utils"
import jsonPipeIterator from "./jsonPipeIterator"
import textIterator from "./textIterator"

export type FetchGenerator = AsyncGenerator<Object, void, void>
export type FetchPromise = Promise<Object>
export type FetchArgs = {method: string, path: string, body?: string}

export function fetchPromise(host: string, args: FetchArgs): FetchPromise {
  return doFetch(host, args).then((resp) => {
    resp
      .text()
      .then(tryJson)
      .then((content) => (resp.ok ? content : Promise.reject(content)))
  })
}

export async function* fetchGenerator(
  host: string,
  args: FetchArgs
): FetchGenerator {
  let resp = await doFetch(host, args)
  if (!resp.ok) throw new Error(await resp.text().then(tryJson))
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
