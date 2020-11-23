import {url} from "../util/utils"
import {parseContentType} from "./contentType"
import {Enhancer} from "../types"
import {createIterator} from "./iterator"
import {createStream} from "./stream"
import {createError} from "../util/error"

export type FetchArgs = {
  path: string
  method: string
  body?: string
  enhancers?: Enhancer[]
  signal?: AbortSignal
}

export function createFetcher(host: string) {
  return {
    async promise(args: FetchArgs) {
      const {path, method, body, signal} = args
      const resp = await fetch(url(host, path), {method, body, signal})
      const content = await parseContentType(resp)
      return resp.ok ? content : Promise.reject(createError(content))
    },
    async stream(args: FetchArgs) {
      const {path, method, body, signal} = args
      const resp = await fetch(url(host, path), {method, body, signal})
      if (!resp.ok) {
        const content = await parseContentType(resp)
        return Promise.reject(createError(content))
      }
      const iterator = createIterator(resp, args)
      return createStream(iterator, resp)
    }
  }
}
