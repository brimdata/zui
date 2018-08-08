export default class MockWebSocket {
  constructor() {
    this.readyState = WebSocket.CONNECTING
    this.sentMessages = []
  }

  send(payload) {
    this.sentMessages.push(JSON.parse(payload))
  }

  mockOpen() {
    this.readyState = WebSocket.OPEN
    this.onopen()
  }

  mockClose() {
    this.readyState = WebSocket.CLOSING
    this.onclose()
    this.readyState = WebSocket.CLOSED
  }

  mockError(err) {
    this.onerror(err)
  }

  mockMessage(msg) {
    this.onmessage(msg)
  }
}
