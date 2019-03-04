/* @flow */

import BoomClient, {Handler} from "../BoomClient"

export default class MockBoomClient extends BoomClient {
  send() {
    throw new Error(`
  Http Requests are disabled in tests.
  Use #stubStream(method, val) or #stubSend(method, val)
  to mock the server response.`)
  }

  stream() {
    throw new Error(`
  Http Requests are disabled in tests.
  Use #stubStream(method, val) or #stubSend(method, val)
  to mock the server response.`)
  }

  stubSend(method: string, returnVal: *) {
    return this.stub(method, () => new Promise(r => r(returnVal)))
  }

  stubSendError(method: string, error: *) {
    return this.stub(method, () => new Promise((_, r) => r(error)))
  }

  stubStream(method: string, returnVal: *) {
    const handler = new Handler(() => {})
    return this.stub(method, () => {
      setTimeout(() => handler.onDone(returnVal), 0)
      return handler
    })
  }

  stub(method: string, methodBody: Function) {
    const props = method.split(".")
    let parent = this
    for (let i = 0; i < props.length; i++) {
      // $FlowFixMe
      if (!parent[props[i]])
        throw new Error(`${method} does not exist on BoomClient`)

      if (i < props.length - 1) {
        parent = parent[props[i]]
      } else {
        // $FlowFixMe
        parent[props[i]] = methodBody
      }
    }
    return this
  }
}
