import fs from "fs-extra"
import {getPath} from "./paths"

test("zq exists", () => {
  expect(fs.existsSync(getPath("zq"))).toBe(true)
})

test("zed exists", () => {
  expect(fs.existsSync(getPath("zed"))).toBe(true)
})
