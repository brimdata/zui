/* @flow */

import trim from "lodash/trim"

import http from "http"

import type {RequiredClientOptions, RequestOptions} from "../types"
import Handler from "../lib/Handler"
import buildUrl from "../lib/buildUrl"
import jsonTransform from "../lib/jsonTransform"

export const stream = (
  request: RequestOptions,
  client: RequiredClientOptions
) => {
  const url = buildUrl(client.host, client.port, request.path, request.query)

  // $FlowFixMe
  const req = http.request(url, {
    method: request.method,
    auth: `${client.username}:${client.password}`,
    timeout: client.timeout
  })

  const handler = new Handler(() => req.abort())
  if (request.payload) req.write(JSON.stringify(request.payload))
  req
    .on("response", resp => {
      resp.setEncoding("utf8")
      if (resp.statusCode !== 200) {
        streamString(resp, handler)
      } else {
        streamJSON(resp, handler)
      }
    })
    .on("abort", () => handler.onAbort())
    .on("timeout", () => req.abort())
    .on("error", error => handler.onError(error.toString()))
    .end()

  return handler
}

export const send = (request: RequestOptions, client: RequiredClientOptions) =>
  // $FlowFixMe
  new Promise((resolve, reject) => {
    const req = http.request({
      hostname: client.host,
      port: client.port,
      path: request.path,
      method: request.method,
      auth: `${client.username}:${client.password}`,
      timeout: client.timeout
    })
    if (request.payload) req.write(JSON.stringify(request.payload))
    req
      .on("response", resp => {
        resp.setEncoding("utf8")
        resp.statusCode !== 200
          ? bufferString(resp, reject)
          : bufferJSON(resp, resolve)
      })
      .on("abort", reject)
      .on("timeout", reject)
      .on("error", reject)
      .end()
  })

/* Private */

const bufferJSON = (resp, resolve) => {
  const messages = []
  resp
    .pipe(jsonTransform())
    .on("data", data => messages.push(data))
    .on("end", () => resolve(messages.length === 1 ? messages[0] : messages))
}

const bufferString = (resp, reject) => {
  let error = ""
  resp.on("data", chunk => (error += chunk))
  resp.on("end", () => reject(trim(error)))
}

const streamJSON = (resp, handler) => {
  return resp
    .pipe(jsonTransform())
    .on("data", data => handler.receive(data))
    .on("end", () => handler.onDone())
}

const streamString = (resp, handler) => {
  let error = ""
  resp.on("data", chunk => (error += chunk))
  resp.on("end", () => handler.onError(trim(error)))
}
