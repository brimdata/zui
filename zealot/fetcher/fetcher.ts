import {url} from "../util/utils"
import {parseContentType} from "./contentType"
import {Enhancer, ZResponse} from "../types"
import {createIterator} from "./iterator"
import {createStream} from "./stream"
import {createError} from "../util/error"
import {EventSourcePolyfill} from "event-source-polyfill"
import nodeFetch from "node-fetch"
import stream from "stream"
import {AbortController as NodeAbortController} from "node-abort-controller"

export type FetchArgs = {
  path: string
  method?: string
  body?: string | FormData | ReadableStream | NodeJS.ReadableStream
  headers?: Headers
  enhancers?: Enhancer[]
  signal?: AbortSignal
  useNodeFetch?: boolean
  timeout?: number
}

const fetchWithTimeout = async (
  baseUrl: string,
  args: FetchArgs
): Promise<Response> => {
  const {path, method, body, signal, headers, useNodeFetch, timeout} = args
  const [wrappedSignal, clearTimeout] = useTimeoutSignal({signal, timeout})
  if (body instanceof stream.Readable) {
    body.once("data", () => clearTimeout())
    body.once("start", () => clearTimeout())
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
    clearTimeout()
  }
}

const useTimeoutSignal = ({
  signal: wrappedSignal,
  timeout = 10000
}: {
  signal?: AbortSignal
  timeout?: number
}): [AbortSignal, () => void] => {
  // TODO: once we upgrade to Node 16, we won't need this polyfill
  let timeoutController
  try {
    timeoutController = new AbortController()
  } catch {
    timeoutController = new NodeAbortController()
  }

  // 10 second default timeout for all requests
  const id = setTimeout(() => {
    if (timeoutController.signal.aborted) return
    timeoutController.abort()
  }, timeout)
  const clear = () => clearTimeout(id)

  if (wrappedSignal) {
    wrappedSignal.addEventListener("abort", () => {
      timeoutController.abort()
      clear()
    })
  }

  return [timeoutController.signal, clear]
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
