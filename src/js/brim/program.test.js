/* @flow */

import brim from "./"

describe("excluding and including", () => {
  let field = brim.field("uid", "string", "123")

  test("excluding a field", () => {
    let program = brim
      .program("_path=weird")
      .exclude(field)
      .toString()

    expect(program).toEqual('_path=weird uid!="123"')
  })

  test("excluding a field with a pipe", () => {
    let program = brim
      .program("_path=weird | sort")
      .exclude(field)
      .toString()

    expect(program).toEqual('_path=weird uid!="123" | sort')
  })

  test("excluding a field with two pipes", () => {
    let program = brim
      .program("_path=weird | sort | filter 1")
      .exclude(field)
      .toString()

    expect(program).toEqual('_path=weird uid!="123" | sort | filter 1')
  })

  test("including a field with two pipes", () => {
    let program = brim
      .program("_path=weird | sort | filter 1")
      .include(field)
      .toString()

    expect(program).toEqual('_path=weird uid="123" | sort | filter 1')
  })
})

describe("drill down", () => {
  let result = brim
    .table()
    .col("id.orig_h", "addr")
    .col("proto", "enum")
    .col("query", "string")
    .col("count", "count")
    .row(["192.168.0.54", "udp", "WPAD", "24"])
    .toLogs()[0]

  test("combines keys in the group by proc", () => {
    let program = brim
      .program("_path=dns | count() by id.orig_h, proto, query | sort -r")
      .drillDown(result)
      .toString()

    expect(program).toBe(
      '_path=dns id.orig_h=192.168.0.54 proto=udp query="WPAD"'
    )
  })

  test("removes *", () => {
    const program = brim
      .program("* | count() by id.orig_h")
      .drillDown(result)
      .toString()

    expect(program).toBe("id.orig_h=192.168.0.54")
  })

  test("easy peasy", () => {
    let program = brim
      .program("names james | count() by proto")
      .drillDown(result)
      .toString()

    expect(program).toBe("names james proto=udp")
  })

  test("count by and filter the same", () => {
    let result = brim.log(
      ["123", "1"],
      [{type: "string", name: "md5"}, {type: "count", name: "count"}]
    )

    let program = brim
      .program("md5=123 | count() by md5 | sort -r | head 5")
      .drillDown(result)
      .toString()

    expect(program).toEqual('md5=123 md5="123"')
  })

  test("filter query", () => {
    let result = brim.log(
      ["9f51ef98c42df4430a978e4157c43dd5", "21"],
      [{name: "md5", type: "string"}, {name: "count", type: "count"}]
    )

    let program = brim
      .program(
        '_path=files filename!="-" | count() by md5,filename | count() by md5 | sort -r | filter count > 1'
      )
      .drillDown(result)
      .toString()

    expect(program).toEqual(
      '_path=files filename!="-" md5="9f51ef98c42df4430a978e4157c43dd5"'
    )
  })

  describe("null cases", () => {
    const nullPrograms = [
      "_path=conn",
      "_path=conn | sort duration",
      "_path=conn | avg()",
      "blah blah string",
      "un->pars=able"
    ]

    nullPrograms.forEach((program) => {
      test(`${program} throws an error`, () => {
        expect(() => brim.program(program).drillDown(brim.log([], []))).toThrow(
          "Missing GroupByProc in '" + program + "'"
        )
      })
    })
  })
})

describe("count by", () => {
  test("empty program", () => {
    let field = brim.field("_path", "string", "conn")
    let program = brim
      .program()
      .countBy(field)
      .toString()

    expect(program).toBe("* | count() by _path")
  })

  test("append a count to an existing query", () => {
    let field = brim.field("query", "string", "heyyo")
    let program = brim
      .program("dns")
      .countBy(field)
      .toString()

    expect(program).toBe("dns | count() by query")
  })
})
