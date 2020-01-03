/* @flow */

import BoomClient from "../services/BoomClient"
import BoomRequest from "../services/BoomClient/lib/BoomRequest"

export default class MockBoomClient extends BoomClient {
  mockRequest() {
    return mockRequest()
  }

  send(args: *) {
    throw new Error(`
  Http Requests are disabled in tests.
  Use #stub(method, val) or #stub(method, val)
  to mock the server response.

  Args: ${JSON.stringify(args)}
  `)
  }

  stub(name: string, returnVal: any) {
    return this.redef(name, () => {
      let req = mockRequest()
      setTimeout(() => req.emitDone(returnVal), 0)
      return req
    })
  }

  stubError(name: string, error: *) {
    let req = this.mockRequest()
    function newMethod() {
      setTimeout(() => req.emitError(error), 0)
      return req
    }
    return this.redef(name, newMethod)
  }

  redef(method: string, methodBody: Function) {
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

export function mockRequest() {
  return new BoomRequest({
    method: "GET",
    url: "testing.123",
    body: ""
  })
}
