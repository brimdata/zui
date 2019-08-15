/* @flow */

import brim from "./"

describe("excluding and including", () => {
  let field = brim.field("uid", "string", "123")

  test("excluding a field", () => {
    let program = brim
      .program("_path=weird")
      .exclude(field)
      .string()

    expect(program).toEqual('_path=weird uid!="123"')
  })

  test("excluding a field with a pipe", () => {
    let program = brim
      .program(
        'tx_hosts=2606:4700:30::681c:135e fuid!="F2nyqx46YRDAYe4c73" | sort'
      )
      .exclude(brim.field("source", "string", "HTTP"))
      .string()

    expect(program).toEqual(
      'tx_hosts=2606:4700:30::681c:135e fuid!="F2nyqx46YRDAYe4c73" source!="HTTP" | sort'
    )
  })

  test("excluding a field with two pipes", () => {
    let program = brim
      .program("_path=weird | sort | filter 1")
      .exclude(field)
      .string()

    expect(program).toEqual('_path=weird uid!="123" | sort | filter 1')
  })

  test("including a field with two pipes", () => {
    let program = brim
      .program("_path=weird | sort | filter 1")
      .include(field)
      .string()

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
      .string()

    expect(program).toBe(
      '_path=dns id.orig_h=192.168.0.54 proto=udp query="WPAD"'
    )
  })

  test("removes *", () => {
    const program = brim
      .program("* | count() by id.orig_h")
      .drillDown(result)
      .string()

    expect(program).toBe("id.orig_h=192.168.0.54")
  })

  test("easy peasy", () => {
    let program = brim
      .program("names james | count() by proto")
      .drillDown(result)
      .string()

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
      .string()

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
      .string()

    expect(program).toEqual(
      '_path=files filename!="-" md5="9f51ef98c42df4430a978e4157c43dd5"'
    )
  })
})

describe("count by", () => {
  test("empty program", () => {
    let field = brim.field("_path", "string", "conn")
    let program = brim
      .program()
      .countBy(field)
      .string()

    expect(program).toBe("| count() by _path")
  })

  test("append a count to an existing query", () => {
    let field = brim.field("query", "string", "heyyo")
    let program = brim
      .program("dns")
      .countBy(field)
      .string()

    expect(program).toBe("dns | count() by query")
  })
})
