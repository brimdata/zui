import {createData} from "src/test/shared/factories/zed-factory"
import {zed} from "@brimdata/zealot"
import {formatValue} from "./format"

test("format a long number", () => {
  const num = createData(1394668388559068) as zed.Primitive
  const str = formatValue(num)

  expect(str).toBe("1,394,668,388,559,068")
})
