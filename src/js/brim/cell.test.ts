import {zng} from "zealot"
import {createCell} from "./cell"

test("null does not quote", () => {
  const data = new zng.Primitive("string", null)
  const f = createCell(new zng.Field("service", data))

  expect(f.queryableValue()).toEqual("null")
})

test("string does quote", () => {
  const data = new zng.Primitive("string", "d,n,s")
  const f = createCell(new zng.Field("service", data))

  expect(f.queryableValue()).toEqual('"d,n,s"')
})

test("string escapes double quotes", () => {
  const data = new zng.Primitive("string", '"test"')
  const f = createCell(new zng.Field("service", data))

  // "test", as a value of type 'string', should return "\"test\"" to escape the inner double quotes
  expect(f.queryableValue()).toEqual('"\\"test\\""')
})

test("string escapes backslash", () => {
  const data = new zng.Primitive("string", "Networks,\\")
  const f = createCell(new zng.Field("service", data))

  expect(f.queryableValue()).toBe('"Networks,\\\\"')
})

describe("#queryableValue", () => {
  const fn = (data: zng.Type) =>
    createCell(new zng.Field("anything", data)).queryableValue()

  test("set", () => {
    const data = new zng.Set("addr", ["192.168.0.53"])
    expect(fn(data)).toBe("192.168.0.53")
  })

  test("set with more than one", () => {
    const data = new zng.Set("addr", ["192.168.0.53", "192.168.0.54"])
    expect(fn(data)).toBe("192.168.0.53 192.168.0.54")
  })

  test("set with zero", () => {
    const data = new zng.Set("addr", [])
    expect(fn(data)).toBe("")
  })

  test("array", () => {
    const data = new zng.ZArray("bstring", ["FjV6Wl4bGCsS2H2AZk"])
    expect(fn(data)).toBe('"FjV6Wl4bGCsS2H2AZk"')
  })

  test("array of strings", () => {
    const data = new zng.ZArray("bstring", [
      "Mozilla,awesome",
      "Killer,Browser"
    ])

    expect(fn(data)).toBe('"Mozilla,awesome" "Killer,Browser"')
  })

  test("null", () => {
    const data = new zng.Primitive("string", null)
    expect(fn(data)).toBe("null")
  })

  test("ts", () => {
    const data = new zng.Primitive("time", "1428917490.931977")
    expect(fn(data)).toBe("1428917490.931977")
  })

  test("duration", () => {
    const data = new zng.Primitive("interval", "0.000031")
    expect(fn(data)).toBe("0.000031")
  })

  test("boolean true", () => {
    const data = new zng.Primitive("bool", "T")
    expect(fn(data)).toBe("true")
  })

  test("boolean false", () => {
    const data = new zng.Primitive("bool", "F")
    expect(fn(data)).toBe("false")
  })

  test("port", () => {
    const data = new zng.Primitive("port", "5353")
    expect(fn(data)).toBe("5353")
  })

  test("addr", () => {
    const data = new zng.Primitive("addr", "192.168.0.51")
    expect(fn(data)).toBe("192.168.0.51")
  })
})
