import Client from "./Client"

test("test connection", () => {
  let client = new Client()
  client.connect({
    host: "localhost",
    port: 9867,
    user: "james",
    pass: "kerr"
  })
})

test("connect when no server is up", () => {})

test("connect when the password is not correct", () => {})
