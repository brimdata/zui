/* @flow */
import brim from "./"

describe("#sorts", () => {
  const getSorts = (program) =>
    brim
      .program(program)
      .ast()
      .sorts()

  test("no sort", () => {
    expect(getSorts("*")).toEqual({})
  })

  test("bare", () => {
    expect(getSorts("* | sort")).toEqual({})
  })

  test("bare reverse", () => {
    expect(getSorts("* | sort -r")).toEqual({})
  })

  test("field", () => {
    expect(getSorts("* | sort _path")).toEqual({
      _path: "asc"
    })
  })

  test("field reverse", () => {
    expect(getSorts("* | sort -r query")).toEqual({
      query: "desc"
    })
  })

  test("multiple", () => {
    expect(getSorts("* | sort query, duration")).toEqual({
      query: "asc",
      duration: "asc"
    })
  })

  test("multiple reverse", () => {
    expect(getSorts("* | sort -r query, duration")).toEqual({
      query: "desc",
      duration: "desc"
    })
  })
})

describe("#groupByKeys", () => {
  const getGroupByKeys = (string) =>
    brim
      .program(string)
      .ast()
      .groupByKeys()

  test("no group by", () => {
    expect(getGroupByKeys("_path=conn")).toEqual([])
  })

  test("one key", () => {
    expect(getGroupByKeys("_path=conn | count() by duration")).toEqual([
      "duration"
    ])
  })

  test("several keys", () => {
    expect(getGroupByKeys("_path=conn | count() by duration, uid")).toEqual([
      "duration",
      "uid"
    ])
  })

  test("nested records", () => {
    expect(getGroupByKeys("* | count() by id.orig_h")).toEqual(["id.orig_h"])
  })
})
