import createTestBrim from "itest/lib/createTestBrim"

describe("Workspace routes", () => {
  const brim = createTestBrim("workspaces.test")

  test("visiting a workspace that doesn't exist", async () => {
    try {
      await brim.navTo("/workspaces/none")
      await brim.hasText("Choose a Workspace")
    } catch (e) {
      await brim.takeScreenshot()
      throw e
    }
  })
})
