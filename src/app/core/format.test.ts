import {createData} from "@brimdata/zed-js"
import * as zed from "@brimdata/zed-js"
import {formatValue} from "./format"

test("format a long number", () => {
  const num = createData(1394668388559068) as zed.Primitive
  const str = formatValue(num)

  expect(str).toBe("1,394,668,388,559,068")
})
