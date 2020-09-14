import brim from "./"

test("null does not quote", () => {
  const f = brim.field({name: "service", type: "string", value: null})

  expect(f.queryableValue()).toEqual("null")
})

test("string does quote", () => {
  const f = brim.field({name: "service", type: "string", value: "d,n,s"})

  expect(f.queryableValue()).toEqual('"d,n,s"')
})

test("string escapes double quotes", () => {
  const f = brim.field({name: "service", type: "string", value: '"test"'})

  // "test", as a value of type 'string', should return "\"test\"" to escape the inner double quotes
  expect(f.queryableValue()).toEqual('"\\"test\\""')
})

test("string escapes backslash", () => {
  const f = brim.field({name: "sub", type: "string", value: "Networks,\\"})
  expect(f.queryableValue()).toBe('"Networks,\\\\"')
})

describe("#queryableValue", () => {
  const fn = (data: any) => brim.field(data).queryableValue()

  test("set", () => {
    const data = {
      name: "rx_hosts",
      type: "set[addr]",
      value: ["192.168.0.53"]
    }
    expect(fn(data)).toBe("192.168.0.53")
  })

  test("set with more than one", () => {
    const data = {
      name: "rx_hosts",
      type: "set[addr]",
      value: ["192.168.0.53", "192.168.0.54"]
    }
    expect(fn(data)).toBe("192.168.0.53 192.168.0.54")
  })

  test("set with zero", () => {
    const data = {
      name: "rx_hosts",
      type: "set[addr]",
      value: []
    }
    expect(fn(data)).toBe("")
  })

  test("array", () => {
    const data = {
      name: "resp_fuids",
      type: "array[bstring]",
      value: ["FjV6Wl4bGCsS2H2AZk"]
    }
    expect(fn(data)).toBe('"FjV6Wl4bGCsS2H2AZk"')
  })

  test("array of strings", () => {
    const data = {
      name: "user_agents",
      type: "array[bstring]",
      value: ["Mozilla,awesome", "Killer,Browser"]
    }
    expect(fn(data)).toBe('"Mozilla,awesome" "Killer,Browser"')
  })

  test("null", () => {
    const data = {
      name: "resp_fuids",
      type: "string",
      value: null
    }
    expect(fn(data)).toBe("null")
  })

  test("ts", () => {
    const data = {name: "ts", type: "time", value: "1428917490.931977"}
    expect(fn(data)).toBe("1428917490.931977")
  })

  test("duration", () => {
    const data = {name: "duration", type: "interval", value: "0.000031"}
    expect(fn(data)).toBe("0.000031")
  })

  test("boolean true", () => {
    const data = {name: "local_orig", type: "bool", value: "T"}
    expect(fn(data)).toBe("true")
  })

  test("boolean false", () => {
    const data = {name: "local_orig", type: "bool", value: "F"}
    expect(fn(data)).toBe("false")
  })

  test("port", () => {
    const data = {name: "id.resp_p", type: "port", value: "5353"}
    expect(fn(data)).toBe("5353")
  })

  test("addr", () => {
    const data = {name: "id.orig_h", type: "addr", value: "192.168.0.51"}
    expect(fn(data)).toBe("192.168.0.51")
  })
})
