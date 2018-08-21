import request from "./request"

export default class Client {
  constructor() {
    this.connected = () => {}
    this.disconnected = () => {}
  }

  connect({host, port, user, pass}) {
    this.credentials = {host, port, user, pass}

    return new Promise((resolve, reject) =>
      this.spaces()
        .done(resolve)
        .error(reject)
    )
  }

  spaces() {
    return this.send({
      stream: false,
      method: "GET",
      path: "/space"
    })
  }

  space({name}) {
    return this.send({
      stream: false,
      method: "GET",
      path: `/space/${name}`
    })
  }

  send(options) {
    return request({...this.credentials, ...options})
  }

  onConnect(callback) {
    this.connected = callback
  }

  onDisconnect(callback) {
    this.disconnected = callback
  }
}
