import {migrate} from "test/unit/helpers/migrate"

test("migrating 202111111659_prependWorkspaceProtocol", async () => {
  const next = await migrate({state: "v0.26.0", to: "202111111659"})

  // expect(next).toBe("what you'd expect")
})
