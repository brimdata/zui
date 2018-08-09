import Connection from "./Connection"
import MockWebSocket from "../mocks/MockWebSocket"

test("onOpen callback", () => {
  let conn = new Connection({transport: MockWebSocket})
  let called = false
  conn.onOpen(() => (called = true))

  conn.connect()
  conn.socket.mockOpen()

  expect(called).toBe(true)
})

test("onError Callback", () => {
  let conn = new Connection({transport: MockWebSocket})
  let error = null
  conn.onError(err => (error = err))

  conn.connect()
  conn.socket.mockError("bad bad bad")

  expect(error).toBe("bad bad bad")
})

test("onMessage callback", () => {
  let conn = new Connection({transport: MockWebSocket})
  let message = null
  conn.onMessage(msg => (message = msg))

  conn.connect()
  conn.socket.mockMessage("hello world")

  expect(message).toBe("hello world")
})

test("onClose callback", () => {
  let conn = new Connection({transport: MockWebSocket})
  let called = false
  conn.onClose(() => (called = true))

  conn.connect()
  conn.socket.mockClose()

  expect(called).toBe(true)
})

test("isConnected when no socket instance", () => {
  let conn = new Connection({transport: MockWebSocket})

  expect(conn.isConnected()).toBe(false)
})

test("isConnected when still connecting", () => {
  let conn = new Connection({transport: MockWebSocket})

  conn.connect()

  expect(conn.isConnected()).toBe(false)
})

test("isConnected when socket is connected", () => {
  let conn = new Connection({transport: MockWebSocket})

  conn.connect()
  conn.socket.mockOpen()

  expect(conn.isConnected()).toBe(true)
})

test("isConnected when socket is closed", () => {
  let conn = new Connection({transport: MockWebSocket})
  conn.connect()
  conn.socket.mockOpen()
  expect(conn.isConnected()).toBe(true)

  conn.socket.mockClose()

  expect(conn.isConnected()).toBe(false)
})

test("buffers messages until connected", () => {
  let conn = new Connection({transport: MockWebSocket})
  conn.connect()
  conn.send({james: "kerr"})
  conn.send({matt: "nibecker"})
  expect(conn.socket.sentMessages.length).toBe(0)

  conn.socket.mockOpen()

  expect(conn.socket.sentMessages).toEqual([
    {james: "kerr"},
    {matt: "nibecker"}
  ])
})

test("retries to connect if failed", () => {
  let conn = new Connection({transport: MockWebSocket})
  conn.connect()
  expect(conn.reconnectTimer.timeoutId).toBe(null)

  conn.socket.mockClose()
  expect(conn.reconnectTimer.timeoutId).toEqual(expect.any(Number))
})

test("the reconnect timer calls connect", () => {
  let conn = new Connection({transport: MockWebSocket})
  let called = false
  conn.connect = () => (called = true)

  conn.reconnectTimer.callback()

  expect(called).toBe(true)
})
