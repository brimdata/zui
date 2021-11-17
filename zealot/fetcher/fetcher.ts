import {url} from "../util/utils"
import {parseContentType} from "./contentType"
import {Enhancer, ZResponse} from "../types"
import {createIterator} from "./iterator"
import {createStream} from "./stream"
import {createError} from "../util/error"
import {EventSourcePolyfill} from "event-source-polyfill"
import nodeFetch from "node-fetch"
import stream from "stream"

export type FetchArgs = {
  path: string
  method?: string
  body?: string | FormData | ReadableStream | NodeJS.ReadableStream
  headers?: Headers
  enhancers?: Enhancer[]
  signal?: AbortSignal
  useNodeFetch?: boolean
}

const fetchWithTimeout = async (
  baseUrl: string,
  args: FetchArgs
): Promise<Response> => {
  const {path, method, body, signal, headers, useNodeFetch} = args
  const [wrappedSignal, cleanupTimeout] = useTimeoutSignal(signal)
  if (body instanceof stream.Readable) {
    body.once("start", () => cleanupTimeout())
  }
  const switchFetch = useNodeFetch ? nodeFetch : fetch
  try {
    return await switchFetch(url(baseUrl, path), {
      method,
      body,
      signal: wrappedSignal,
      headers
    })
  } catch (e) {
    // if wrapped signal is the only one aborted, then this is a timeout
    if (!signal?.aborted && wrappedSignal.aborted) {
      throw new Error("Request timed out")
    }

    throw e
  } finally {
    cleanupTimeout()
  }
}

const useTimeoutSignal = (
  wrappedSignal?: AbortSignal
): [AbortSignal, () => void] => {
  const timeoutController = new AbortController()

  // 10 second default timeout for all requests
  const id = setTimeout(() => {
    if (timeoutController.signal.aborted) return
    timeoutController.abort()
  }, 10000)
  const cleanup = () => clearTimeout(id)

  if (wrappedSignal) {
    wrappedSignal.addEventListener("abort", () => {
      timeoutController.abort()
      cleanup()
    })
  }

  return [timeoutController.signal, cleanup]
}

export function createFetcher(baseUrl: string) {
  return {
    async promise(args: FetchArgs) {
      const resp = await fetchWithTimeout(baseUrl, args)
      const content = await parseContentType(resp)
      return resp.ok ? content : Promise.reject(createError(content))
    },
    async stream(args: FetchArgs): Promise<ZResponse> {
      const resp = await fetchWithTimeout(baseUrl, args)
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
