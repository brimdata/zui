export default class Connection {
  constructor(opts = {}) {
    this.sessionUrl = opts.sessionUrl
    this.sendBuffer = []
    this.transport = opts.transport || WebSocket
    this.reconnectTimer = new Timer(() => this.connect())
    this.callbacks = {open: [], error: [], message: [], close: []}
  }

  connect() {
    if (this.socket) this.socket.close()

    this.socket = new this.transport(`ws://${this.sessionUrl}`)
    this.socket.onopen = () => this.onSocketOpen()
    this.socket.onerror = error => this.onSocketError(error)
    this.socket.onmessage = message => this.onSocketMessage(message)
    this.socket.onclose = () => this.onSocketClose()
  }

  disconnect() {
    if (this.socket) this.socket.close()
  }

  onOpen(callback) {
    this.callbacks.open.push(callback)
  }

  onError(callback) {
    this.callbacks.error.push(callback)
  }

  onMessage(callback) {
    this.callbacks.message.push(callback)
  }

  onClose(callback) {
    this.callbacks.close.push(callback)
  }

  send(payload) {
    if (this.isConnected()) {
      this.socket.send(JSON.stringify(payload))
    } else {
      this.sendBuffer.push(payload)
    }
  }

  // Private Interface Below

  isConnected() {
    if (!this.socket) return false
    else return this.socket.readyState === WebSocket.OPEN
  }

  onSocketOpen() {
    this.reconnectTimer.clear()
    this.callbacks.open.forEach(callback => callback())
    this.flushSendBuffer()
  }

  onSocketError(error) {
    this.callbacks.error.forEach(callback => callback(error))
  }

  onSocketMessage(message) {
    this.callbacks.message.forEach(callback => callback(message))
  }

  onSocketClose() {
    this.callbacks.close.forEach(callback => callback())
    this.socket = null
    this.reconnectTimer.scheduleAttempt()
  }

  flushSendBuffer() {
    while (this.isConnected() && this.sendBuffer.length > 0) {
      this.send(this.sendBuffer.shift())
    }
  }
}

class Timer {
  constructor(callback, delayFunc) {
    this.delayFunc =
      delayFunc || (tries => [1000, 2000, 3000][tries - 1] || 4000)
    this.callback = callback
    this.timeoutId = null
    this.tries = 0
  }

  scheduleAttempt() {
    const nextTry = this.tries + 1
    const delay = this.delayFunc(nextTry)
    clearTimeout(this.timeoutId)

    this.timeoutId = setTimeout(() => {
      this.tries = nextTry
      this.callback()
    }, delay)
  }

  clear() {
    this.tries = 0
    clearTimeout(this.timeoutId)
  }
}
