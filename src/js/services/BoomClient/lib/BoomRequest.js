/* @flow */

type Method = "GET" | "POST" | "HEAD" | "PUT" | "DELETE" | "OPTIONS" | "PATCH"
type CallbackName = "error" | "done" | "stream" | "abort"
type RequestStatus = "fetch" | "done" | "error"
type RequestArgs = {|
  method: Method,
  url: string,
  body: ?string,
  headers?: ?Object,
  streaming?: boolean
|}

export default class BoomRequest {
  method: Method
  url: string
  body: ?string
  headers: Object
  streaming: boolean
  status: RequestStatus
  callbacks: {[CallbackName]: Function[]}
  abortFunc: Function
  emitAbort: boolean

  constructor(args: RequestArgs) {
    this.method = args.method
    this.url = args.url
    this.body = args.body
    this.headers = args.headers || {}
    this.streaming = args.streaming || false
    this.status = "fetch"
    this.callbacks = {}
    this.abortFunc = () => {}
    this.emitAbort = true
  }

  emitDone(payload: Object) {
    if (this.status === "error") return
    this.status = "done"
    this.emit("done", payload)
  }

  emitStream(payload: Object) {
    if (this.status === "error") return
    this.emit("stream", payload)
  }

  emitError(error: Error | string) {
    if (typeof error === "string") {
      this.emit("error", error)
    }

    this.status = "error"
    if (this.isAbortError(error)) {
      if (this.emitAbort) this.emit("abort", error)
    } else {
      this.emit("error", error)
    }
  }

  done(cb: Function) {
    this.addCallback("done", cb)
    return this
  }

  stream(cb: Function) {
    this.addCallback("stream", cb)
    return this
  }

  error(cb: Function) {
    this.addCallback("error", cb)
    return this
  }

  onAbort(cb: Function) {
    this.addCallback("abort", cb)
    return this
  }

  setAbort(func: Function) {
    this.abortFunc = func
  }

  abort(emit: boolean = true) {
    this.emitAbort = emit
    this.abortFunc()
  }

  addCallback(name: CallbackName, cb: Function) {
    if (!this.callbacks[name]) this.callbacks[name] = []
    this.callbacks[name].push(cb)
  }

  emit(name: CallbackName, data: *) {
    let cbs = this.callbacks[name] || []
    cbs.forEach((cb) => cb(data))
  }

  isAbortError(error: *) {
    return error.name === "AbortError" || (error.message || "").match(/aborted/)
  }
}
