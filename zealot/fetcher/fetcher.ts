import {url} from "../util/utils"
import {parseContentType} from "./contentType"
import {Enhancer, ZResponse} from "../types"
import {createIterator} from "./iterator"
import {createStream} from "./stream"
import {createError} from "../util/error"
import {EventSourcePolyfill} from "event-source-polyfill"
import nodeFetch from "node-fetch"

export type FetchArgs = {
  path: string
  method?: string
  body?: string | FormData | ReadableStream | NodeJS.ReadableStream
  headers?: Headers
  enhancers?: Enhancer[]
  signal?: AbortSignal
  useNodeFetch?: boolean
}

export function createFetcher(baseUrl: string) {
  return {
    async promise(args: FetchArgs) {
      const {path, method, body, signal, headers, useNodeFetch} = args
      const switchFetch = useNodeFetch ? nodeFetch : fetch
      const resp = await switchFetch(url(baseUrl, path), {
        method,
        body,
        signal,
        headers
      })
      const content = await parseContentType(resp)
      return resp.ok ? content : Promise.reject(createError(content))
    },
    async stream(args: FetchArgs): Promise<ZResponse> {
      const {path, method, body, signal, headers} = args
      const resp = await fetch(url(baseUrl, path), {
        method,
        body: body as string | FormData | ReadableStream,
        signal,
        headers
      })
      if (!resp.ok) {
        const content = await parseContentType(resp)
        return Promise.reject(createError(content))
      }
      const iterator = createIterator(resp, args)
      return createStream(iterator, resp)
    },
    async source(args: FetchArgs): Promise<EventSource> {
      const {path, headers} = args
      const unpackedHeaders = {}
      if (headers)
        for (let [hKey, hValue] of headers) unpackedHeaders[hKey] = hValue
      return new EventSourcePolyfill(url(baseUrl, path), {
        headers: {
          Accept: "application/json",
          ...unpackedHeaders
        }
      })
    }
  }
}
