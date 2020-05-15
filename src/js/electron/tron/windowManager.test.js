/* @flow */
import tron from "./"

test("fetchWindowStates", () => {
  let manager = tron.windowManager()
  manager.openWindow("search")
  manager.fetchWindowStates()
})
