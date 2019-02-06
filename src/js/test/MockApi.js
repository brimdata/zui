/* @flow */

import Client, {Handler} from "boom-js-client"

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
