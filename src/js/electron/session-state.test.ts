import {decodeSessionState} from "./session-state"
import {WindowManager} from "./windows/window-manager"

test("decoding undefined", () => {
  const data = decodeSessionState(undefined)
  return new WindowManager(data).init()
})

test("decoding corrupt string", () => {
  const data = decodeSessionState("hi")
  return new WindowManager(data).init()
})

test("decoding corrupt object", () => {
  const data = decodeSessionState({name: "corrupt"})
  return new WindowManager(data).init()
})

test("decoding corrupt object with data", () => {
  const data = decodeSessionState({version: 1234, data: {}})
  return new WindowManager(data).init()
})

test("decoding corrupt object with windows", () => {
  const data = decodeSessionState({
    version: 1234,
    data: {
      order: null,
      windows: "hi",
    },
  })
  return new WindowManager(data).init()
})

test("decoding corrupt object with windows various", () => {
  const data = decodeSessionState({
    version: 1234,
    data: {
      order: null,
      windows: {
        "1": "bad value",
        "2": {},
        "3": undefined,
      },
      globalState: "jkjkjkjkj",
    },
  })
  return new WindowManager(data).init()
})
