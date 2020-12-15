import {HELLO} from "ppl/javascript"
import * as zealot from "zealot"

test("ppl directory", () => {
  expect(HELLO).toBe("WORLD")
})

test("zealot", () => {
  expect(zealot).toHaveProperty("createZealot")
})
