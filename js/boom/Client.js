import jsonStream from "./jsonStream"
import textStream from "./textStream"
import base64 from "../base64"
import ApiMessageHandler from "./ApiMessageHander"

export default class Client {
  constructor() {
    this.connected = () => {}
    this.disconnected = () => {}
  }

  connect({host, port, user, pass}) {
    this.host = host
    this.port = port
    this.user = user
    this.pass = pass
    this.isConnected = true
    this.connected()
  }

  send({method, path, payload}) {
    const handler = new ApiMessageHandler(payload)

    setTimeout(() => {
      let promise
      if (method === "GET") {
        console.log("sending a get request")
        promise = fetch(`http://${this.host}:${this.port}` + path, {
          credentials: "include",
          headers: {
            Authorization: `Basic ${base64.encode(`${this.user}:${this.pass}`)}`
          }
        })
      } else {
        promise = fetch(`http://${this.host}:${this.port}` + path, {
          credentials: "include",
          headers: {
            Authorization: `Basic ${base64.encode(`${this.user}:${this.pass}`)}`
          },
          method,
          body: JSON.stringify(payload)
        })
      }
      promise.then(response => {
        if (response.ok) {
          const byteReader = response.body.getReader()
          const textReader = textStream(byteReader).getReader()
          const jsonReader = jsonStream(textReader).getReader()

          jsonReader.read().then(function processStream({value, done}) {
            if (done) return
            handler.receive(value)
            jsonReader.read().then(processStream)
          })
        } else {
          console.error(response)
        }
      })
    })

    return handler
  }

  onConnect(callback) {
    this.connected = callback
  }

  onDisconnect(callback) {
    this.disconnected = callback
  }
}
