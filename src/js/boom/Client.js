import request from "./request"

export default class Client {
  constructor(credentials = {}) {
    this.credentials = credentials
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
    const {host, port, user, pass} = this.credentials
    if (!host || !port || !user || !pass) {
      throw new Error("Need boom credentials to make a request")
    }

    return request({...this.credentials, ...options})
  }
}
