import {migrate} from "test/unit/helpers/migrate"

test("migrating 202110150837_querylibFolders", async () => {
  const next = await migrate({state: "v0.26.0", to: "202110150837"})

  expect(next).toBe("what you'd expect")
})
