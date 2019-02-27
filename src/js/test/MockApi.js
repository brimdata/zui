/* @flow */

import Client, {BoomClient, Handler} from "boom-js-client"

export default class MockApi extends Client {
  constructor(obj: Object = {}) {
    super()
    Object.assign(this, obj)
    this.send = jest.fn(() => new Handler(() => {}))
  }

  stub(method: string, returnVal: *) {
    const handler = new Handler(() => {})
    this[method] = () => {
      setTimeout(() => handler.onDone(returnVal))
      return handler
    }
    return this
  }
}

export function MockBoomClient() {
  BoomClient.call(this)
  return this
}

MockBoomClient.prototype = Object.create(BoomClient.prototype)

Object.defineProperty(MockBoomClient.prototype, "constructor", {
  value: MockBoomClient,
  enumerable: false,
  writeable: true
})

MockBoomClient.prototype.stubPromise = function(method: string, returnVal: *) {
  if (!this[method]) throw new Error(`${method} does not exist on BoomClient`)
  this[method] = () => new Promise(r => r(returnVal))
  return this
}

MockBoomClient.prototype.send = jest.fn()

// Delete this after fixing tests to use MockBoomClient
BoomClient.prototype.send = jest.fn(() => new Handler(() => {}))
