export default class MockConn {
  constructor() {
    this.sent = []
  }

  send(data) {
    this.sent.push(data)
  }
}
