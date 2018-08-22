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
      method: "GET",
      path: "/space",
      stream: false
    })
  }

  space({name}) {
    return this.send({
      method: "GET",
      path: `/space/${name}`,
      stream: false
    })
  }

  descriptor({space, id}) {
    return this.send({
      method: "GET",
      path: `/space/${space}/descriptor/${id}`,
      stream: false
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
