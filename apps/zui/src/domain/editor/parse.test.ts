/**
 * @jest-environment jsdom
 */
import {SystemTest} from "src/test/system"
import {parse} from "./operations"

new SystemTest("editor.parse op")

test("editor.parse", async () => {
  const result = await parse("from source | count() by name")
  expect(result.map((o) => o.kind)).toEqual(["From", "Summarize"])
})

test("editor.parse error", async () => {
  await expect(parse("from source | ;;;(")).rejects.toHaveProperty(
    "error",
    expect.stringContaining("error parsing Zed at column 15")
  )
})
