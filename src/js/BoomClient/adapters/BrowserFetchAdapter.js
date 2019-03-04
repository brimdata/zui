/* @flow */

import type {RequiredClientOptions, RequestOptions} from "../types"
import Handler from "../lib/Handler"
import NdJsonDecoder from "../lib/NdJsonDecoder"
import base64 from "../lib/base64"
import buildUrl from "../lib/buildUrl"

export const send = (
  request: RequestOptions,
  client: RequiredClientOptions
) => {
  const url = buildUrl(client.host, client.port, request.path, request.query)

  const options = {
    method: request.method,
    body: JSON.stringify(request.payload),
    headers: {
      Authorization: `Basic ${base64.encode(
        client.username + ":" + client.password
      )}`
    }
  }

  return fetch(url, options).then(resp => {
    if (!resp.ok) {
      return resp.text().then(t => Promise.reject(t))
    } else {
      return resp.json()
    }
  })
}

export const stream = (
  request: RequestOptions,
  client: RequiredClientOptions
) => {
  const url = buildUrl(client.host, client.port, request.path, request.query)
  const control = new AbortController()
  const handler = new Handler(() => control.abort())
  const options = {
    method: request.method,
    body: JSON.stringify(request.payload),
    signal: control.signal,
    headers: {
      Authorization: `Basic ${base64.encode(
        client.username + ":" + client.password
      )}`
    }
  }

  fetch(url, options)
    .then(resp => handleSuccess(resp, handler))
    .catch(error => handleError(error, handler))

  if (client.timeout !== 0) {
    setTimeout(() => handler.abortRequest(), client.timeout)
  }

  return handler
}

const handleSuccess = (resp, handler) => {
  if (!resp.ok) {
    resp.text().then(text => handler.onError(text))
  } else {
    streamJSON(resp, handler)
  }
}

const handleError = (error, handler) => {
  if (error.name === "AbortError" || error.message.match(/aborted/)) {
    handler.onAbort()
    return
  }

  handler.onError(error.message)
}

const streamJSON = (resp, handler) => {
  const text = new TextDecoder()
  const ndJson = new NdJsonDecoder(payload => handler.receive(payload))
  const stream = resp.body && resp.body.getReader()

  const pull = () => {
    if (!stream) return

    stream
      .read()
      .then(({done, value}) => {
        if (!done && value) {
          ndJson.decode(text.decode(value))
          pull()
        } else if (done) {
          ndJson.flush()
          handler.onDone()
        }
      })
      .catch(error => handleError(error, handler))
  }
  pull()
}
