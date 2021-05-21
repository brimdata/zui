import {getRepo} from "./get-repo"

test("returns whatever is in package.json", async () => {
  expect(await getRepo("https://github.com/brimdata/brim")).toBe(
    "brimdata/brim"
  )
})
