import {getRepo} from "./get-repo"

test("returns whatever is in package.json", () => {
  expect(getRepo("https://github.com/brimdata/brim")).toBe("brimdata/brim")
})
