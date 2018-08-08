export default class ApiMessageHandler {
  constructor(request) {
    this.request = request
    this.pending = 0
    this.channelCallbacks = {}
    this.doneCallbacks = []
    this.eachCallbacks = []
    this.errorCallbacks = []
  }

  each(callback) {
    this.eachCallbacks.push(callback)
    return this
  }

  channel(id, callback) {
    this.channelCallbacks[id] = callback
    this.pending += 1
    return this
  }

  done(callback) {
    this.doneCallbacks.push(callback)
    return this
  }

  isDone() {
    return this.pending === 0
  }

  receive(payload) {
    this.eachCallbacks.forEach(cb => cb(payload))

    if ("channel_id" in payload) {
      if (payload.type === "SearchEnd") {
        this.pending -= 1
      }
      this.channelCallback(payload.channel_id, payload)
    }

    if (this.isDone()) {
      this.doneCallbacks.forEach(cb => cb(payload))
    }
  }

  channelCallback(id, payload) {
    if (id in this.channelCallbacks) this.channelCallbacks[id](payload)
  }
}
