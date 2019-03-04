import Handler from "./Handler"

test("#channel accepts multiple callbacks for same number", () => {
  const handler = new Handler({})
  const cb1 = jest.fn()
  const cb2 = jest.fn()
  handler.channel(1, cb1)
  handler.channel(1, cb2)
  handler.channelCallback(1, "payload")

  expect(cb1).toBeCalled()
  expect(cb2).toBeCalled()
})
