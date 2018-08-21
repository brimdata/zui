import Client from "./Client"

let client = new Client()
beforeAll(() => {
  client.connect({
    host: "localhost",
    port: 9867,
    user: "james",
    pass: "kerr"
  })
})

test("send", done => {
  client.send({method: "GET", path: "/space"}).done(_data => {
    done()
  })
})
