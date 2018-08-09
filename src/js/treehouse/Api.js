import shortid from "shortid"
import Connection from "./Connection"

export default class Api {
  constructor({conn = new Connection()} = {}) {
    this.messageTracker = new MessageTracker()
    this.conn = conn
    this.onConnectCallback = () => {}
    this.onDisconnectCallback = () => {}
    this.registerCallbacks()
  }

  registerCallbacks() {
    this.conn.onOpen(this.onConnectCallback)
    this.conn.onClose(this.onDisconnectCallback)
    this.conn.onError(this.onError.bind(this))
    this.conn.onMessage(this.onMessage.bind(this))
  }

  connect({host, port, _user, _pass}) {
    this.conn = new Connection({
      sessionUrl: `${host}:${port}/session`
    })
    this.registerCallbacks()
    try {
      this.conn.connect()
    } catch (e) {
      this.onDisconnectCallback(e)
    }
  }

  onConnect(callback) {
    this.onConnectCallback = callback
  }

  onDisconnect(callback) {
    this.onDisconnectCallback = callback
  }

  send(payload) {
    const id = this.newId()
    const message = new ApiMessageHandler(payload)

    this.messageTracker.register(id, message)
    setTimeout(() => this.conn.send({...payload, eid: id}))

    return message
  }

  onMessage(messageEvent) {
    const {eid, payload} = JSON.parse(messageEvent.data)
    const handler = this.messageTracker.lookup(eid)

    if (handler) {
      handler.receive(payload)

      if (handler.isDone()) {
        this.messageTracker.unregister(eid)
      }
    } else {
      console.warn("Unhandled message", eid, payload)
    }
  }

  onError(error) {
    console.error(error)
  }

  pendingRequests() {
    return this.messageTracker.getMap()
  }

  newId() {
    return shortid.generate()
  }
}

class MessageTracker {
  constructor() {
    this.map = {}
  }

  getMap() {
    return this.map
  }

  register(id, message) {
    this.map[id] = message
  }

  lookup(key) {
    return this.map[key]
  }

  unregister(key) {
    delete this.map[key]
  }
}

class ApiMessageHandler {
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
