import {WindowManager} from "./windows/window-manager"

test("persis a session, then boot up from it", async () => {
  const manager = new WindowManager({
    order: ["1", "2", "3"],
    windows: {
      "1": {
        id: "1",
        lastFocused: 1,
        name: "search",
        size: [111, 111],
        position: [111, 111],
        state: {data: "window1"},
      },
      "2": {
        id: "2",
        lastFocused: 2,
        name: "detail",
        size: [222, 222],
        position: [222, 222],
        state: {data: "window2"},
      },
      "3": {
        id: "3",
        lastFocused: 3,
        name: "search",
        size: [333, 333],
        position: [333, 333],
        state: {data: "window3"},
      },
    },
    globalState: {
      data: "globalState",
    },
  })

  await manager.init()

  expect(manager.count).toBe(4)
  expect(manager.find("1").state).toEqual({data: "window1"})
})
