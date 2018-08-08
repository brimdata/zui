import Connection from "./Connection"
import MockWebSocket from "../mocks/MockWebSocket"
import Api from "./Api"

let api

beforeEach(() => {
  let conn = new Connection({transport: MockWebSocket})
  conn.connect()
  conn.socket.mockOpen()
  api = new Api({conn})
})

test("using channel callbacks", () => {
  const channel0 = jest.fn()
  const channel1 = jest.fn()

  api
    .send({data: "Marco"})
    .channel(0, channel0)
    .channel(1, channel1)

  const messageId = Object.keys(api.pendingRequests())[0]
  const response = {
    eid: messageId,
    payload: {type: "SearchResult", channel_id: 0}
  }

  api.conn.socket.mockMessage({data: JSON.stringify(response)})

  expect(channel0).toHaveBeenCalled()
  expect(channel1).not.toHaveBeenCalled()
})

test("using the done callback", () => {
  const channel1 = jest.fn()
  const complete = jest.fn()
  const request = {data: "Marco"}

  api
    .send(request)
    .channel(1, channel1)
    .done(complete)

  const messageId = Object.keys(api.pendingRequests())[0]
  const response = {
    eid: messageId,
    payload: {type: "SearchEnd", looky: "here", channel_id: 1}
  }

  api.conn.socket.mockMessage({data: JSON.stringify(response)})

  expect(channel1).toHaveBeenCalledWith({
    looky: "here",
    channel_id: 1,
    type: "SearchEnd"
  })
  expect(complete).toHaveBeenCalled()
})
