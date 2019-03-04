/* @flow */

export default class Handler {
  abortFunc: Function
  channelCallbacks: {[number]: Function[]}
  doneCallbacks: Function[]
  eachCallbacks: Function[]
  errorCallbacks: Function[]
  abortCallbacks: Function[]
  isDone: boolean
  isAborted: boolean

  constructor(abortFunc: Function) {
    this.abortFunc = abortFunc
    this.isDone = false
    this.isAborted = false
    this.channelCallbacks = {}
    this.doneCallbacks = []
    this.eachCallbacks = []
    this.errorCallbacks = []
    this.abortCallbacks = []
  }

  abortRequest() {
    if (!this.isDone) {
      this.abortFunc()
    }
  }

  abort(cb: Function) {
    this.abortCallbacks.push(cb)
    return this
  }

  each(callback: Function) {
    this.eachCallbacks.push(callback)
    return this
  }

  channel(id: number, callback: Function) {
    if (this.channelCallbacks[id]) {
      this.channelCallbacks[id].push(callback)
    } else {
      this.channelCallbacks[id] = [callback]
    }
    return this
  }

  done(callback: Function) {
    this.doneCallbacks.push(callback)
    return this
  }

  error(callback: Function) {
    this.errorCallbacks.push(callback)
    return this
  }

  onError(error: *) {
    if (this.isAborted) return

    this.errorCallbacks.forEach(cb => cb(error))
  }

  onDone(payload: *) {
    if (this.isAborted) return

    this.isDone = true
    this.doneCallbacks.forEach(cb => cb(payload))
  }

  onAbort() {
    this.isAborted = true
    this.abortCallbacks.forEach(cb => cb())
  }

  receive(payload: *) {
    if (this.isAborted) return

    this.eachCallbacks.forEach(cb => cb(payload))

    if ("channel_id" in payload) {
      this.channelCallback(payload.channel_id, payload)
    }
  }

  channelCallback(id: number, payload: *) {
    if (id in this.channelCallbacks) {
      this.channelCallbacks[id].forEach(cb => cb(payload))
    }
  }
}
