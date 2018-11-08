/* @flow */

export default class MockApi {
  constructor(obj: Object) {
    Object.assign(this, obj)
  }

  search() {
    return this
  }
  each() {
    return this
  }
  channel() {
    return this
  }
  done() {
    return this
  }
  abort() {
    return this
  }
  error() {
    return this
  }
  abortRequest() {}
}
