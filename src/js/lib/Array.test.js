import {flattenJoin, indexOfLastChange} from "./Array"

test("#indexOfLastChange", () => {
  const logsTs = [
    new Date("2018-1-1 10:00"),
    new Date("2018-1-1 11:00"),
    new Date("2018-1-1 12:00"),
    new Date("2018-1-1 13:00")
  ]

  const index = indexOfLastChange(logsTs)
  expect(index).toBe(2)
})

test("#indexOfLastChange with accessor", () => {
  const logsTs = [
    {ts: new Date("2018-1-1 10:00")},
    {ts: new Date("2018-1-1 11:00")},
    {ts: new Date("2018-1-1 13:00")},
    {ts: new Date("2018-1-1 13:00")}
  ]

  const index = indexOfLastChange(logsTs, obj => obj.ts)
  expect(index).toBe(1)
})

test("#indexOfLastChange with empty array", () => {
  const index = indexOfLastChange([], thing => thing.get("hi"))
  expect(index).toBe(-1)
})

test("#indexOfLastChange when all the same", () => {
  const index = indexOfLastChange([1, 1, 1, 1])
  expect(index).toBe(-1)
})

test("#indexOfLastChange when all same with accessor", () => {
  const logsTs = [
    {ts: new Date("2018-1-1 10:00")},
    {ts: new Date("2018-1-1 10:00")},
    {ts: new Date("2018-1-1 10:00")},
    {ts: new Date("2018-1-1 10:00")}
  ]

  const index = indexOfLastChange(logsTs, obj => obj.ts)
  expect(index).toBe(-1)
})

describe("#flattenJoin", () => {
  test("three arrays", () => {
    const result = flattenJoin([["1"], ["2"], ["3"]], "|")
    expect(result.join("")).toEqual("1|2|3")
  })

  test("two arrays", () => {
    const result = flattenJoin([["1"], ["2"]], "|")
    expect(result.join("")).toEqual("1|2")
  })

  test("one array", () => {
    const result = flattenJoin([["1"]], "|")
    expect(result.join("")).toEqual("1")
  })

  test("one array with an empty array", () => {
    const result = flattenJoin([["1"], []], "|")
    expect(result.join("")).toEqual("1")
  })

  test("on array with many empty arrays", () => {
    const result = flattenJoin([[], ["2"], [], ["3"]], "|")
    expect(result.join("")).toEqual("2|3")
  })
})
