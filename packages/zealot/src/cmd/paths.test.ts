import {getPath} from "./paths"
import fs from "fs-extra"

test("zq exists", () => {
  expect(fs.existsSync(getPath("zq"))).toBe(true)
})

test("zed exists", () => {
  expect(fs.existsSync(getPath("zed"))).toBe(true)
})
