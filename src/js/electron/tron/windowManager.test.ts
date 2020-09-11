import tron from "./"

test("fetchWindowStates", () => {
  const manager = tron.windowManager()
  manager.openWindow("search")
  manager.fetchWindowStates()
})
