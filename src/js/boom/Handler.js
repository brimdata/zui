export default class Handler {
  constructor() {
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
    return this
  }

  done(callback) {
    this.doneCallbacks.push(callback)
    return this
  }

  error(callback) {
    this.errorCallbacks.push(callback)
    return this
  }

  onError(error) {
    this.errorCallbacks.forEach(cb => cb(error))
  }

  onDone(payload) {
    this.doneCallbacks.forEach(cb => cb(payload))
  }

  receive(payload) {
    this.eachCallbacks.forEach(cb => cb(payload))

    if ("channel_id" in payload) {
      this.channelCallback(payload.channel_id, payload)
    }
  }

  channelCallback(id, payload) {
    if (id in this.channelCallbacks) this.channelCallbacks[id](payload)
  }
}
