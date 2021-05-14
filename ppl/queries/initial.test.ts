import {parse} from "zealot"
import init from "./initial"

test("they all parse", () => {
  const queries = init()
  queries.items.forEach((item) => {
    if (!("value" in item)) return

    try {
      parse(item.value)
    } catch (e) {
      throw new Error(item.value + "\n" + e.toString())
    }
  })
})
