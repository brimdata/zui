import {parseJSONLib} from "./parsers"
import * as path from "path"

const fixturePath = path.join(__dirname, "fixtures", "test-query-lib.json")

test("parses json file as query lib with annotations", () => {
  expect.assertions(8)
  const {libRoot: parsedQueryLib} = parseJSONLib(fixturePath)
  expect(parsedQueryLib["isOpen"]).toEqual(false)
  expect(parsedQueryLib.items[2]["isOpen"]).toEqual(false)

  expect(parsedQueryLib.id).toBeDefined()

  // 4 assertions in here
  parsedQueryLib.items.forEach((item) => {
    expect(item.id).toBeDefined()
  })

  expect(parsedQueryLib.items[2]["items"][0].id).toBeDefined()
})
