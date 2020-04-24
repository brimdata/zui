/* @flow */
import brim from "./"

test("null does not quote", () => {
  let f = brim.field({name: "service", type: "string", value: null})

  expect(f.queryableValue()).toEqual("null")
})

test("string does quote", () => {
  let f = brim.field({name: "service", type: "string", value: "d,n,s"})

  expect(f.queryableValue()).toEqual('"d,n,s"')
})

test("string escapes double quotes", () => {
  let f = brim.field({name: "service", type: "string", value: '"test"'})

  // '"test"', as a string, should return "\"test\"" to escape the inner double quotes
  expect(f.queryableValue()).toEqual('"\\"test\\""')
})

describe("#queryableValue", () => {
  const fn = (data: any) => brim.field(data).queryableValue()

  test("set", () => {
    let data = {
      name: "rx_hosts",
      type: "set[addr]",
      value: ["192.168.0.53"]
    }
    expect(fn(data)).toBe("192.168.0.53")
  })

  test("set with more than one", () => {
    let data = {
      name: "rx_hosts",
      type: "set[addr]",
      value: ["192.168.0.53", "192.168.0.54"]
    }
    expect(fn(data)).toBe("192.168.0.53 192.168.0.54")
  })

  test("set with zero", () => {
    let data = {
      name: "rx_hosts",
      type: "set[addr]",
      value: []
    }
    expect(fn(data)).toBe("")
  })

  test("array", () => {
    let data = {
      name: "resp_fuids",
      type: "array[bstring]",
      value: ["FjV6Wl4bGCsS2H2AZk"]
    }
    expect(fn(data)).toBe('"FjV6Wl4bGCsS2H2AZk"')
  })

  test("array of strings", () => {
    let data = {
      name: "user_agents",
      type: "array[bstring]",
      value: ["Mozilla,awesome", "Killer,Browser"]
    }
    expect(fn(data)).toBe('"Mozilla,awesome" "Killer,Browser"')
  })

  test("null", () => {
    let data = {
      name: "resp_fuids",
      type: "string",
      value: null
    }
    expect(fn(data)).toBe("null")
  })

  test("ts", () => {
    let data = {name: "ts", type: "time", value: "1428917490.931977"}
    expect(fn(data)).toBe("1428917490.931977")
  })

  test("duration", () => {
    let data = {name: "duration", type: "interval", value: "0.000031"}
    expect(fn(data)).toBe("0.000031")
  })

  test("boolean true", () => {
    let data = {name: "local_orig", type: "bool", value: "T"}
    expect(fn(data)).toBe("true")
  })

  test("boolean false", () => {
    let data = {name: "local_orig", type: "bool", value: "F"}
    expect(fn(data)).toBe("false")
  })

  test("port", () => {
    let data = {name: "id.resp_p", type: "port", value: "5353"}
    expect(fn(data)).toBe("5353")
  })

  test("addr", () => {
    let data = {name: "id.orig_h", type: "addr", value: "192.168.0.51"}
    expect(fn(data)).toBe("192.168.0.51")
  })
})
