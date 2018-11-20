import * as Array from "./Array"

test("#indexOfLastChange", () => {
  const logsTs = [
    new Date("2018-1-1 10:00"),
    new Date("2018-1-1 11:00"),
    new Date("2018-1-1 12:00"),
    new Date("2018-1-1 13:00")
  ]

  const index = Array.indexOfLastChange(logsTs)
  expect(index).toBe(2)
})

test("#indexOfLastChange with accessor", () => {
  const logsTs = [
    {ts: new Date("2018-1-1 10:00")},
    {ts: new Date("2018-1-1 11:00")},
    {ts: new Date("2018-1-1 13:00")},
    {ts: new Date("2018-1-1 13:00")}
  ]

  const index = Array.indexOfLastChange(logsTs, obj => obj.ts)
  expect(index).toBe(1)
})

test("#indexOfLastChange with empty array", () => {
  const index = Array.indexOfLastChange([], thing => thing.get("hi"))
  expect(index).toBe(-1)
})

test("#indexOfLastChange when all the same", () => {
  const index = Array.indexOfLastChange([1, 1, 1, 1])
  expect(index).toBe(-1)
})

test("#indexOfLastChange when all same with accessor", () => {
  const logsTs = [
    {ts: new Date("2018-1-1 10:00")},
    {ts: new Date("2018-1-1 10:00")},
    {ts: new Date("2018-1-1 10:00")},
    {ts: new Date("2018-1-1 10:00")}
  ]

  const index = Array.indexOfLastChange(logsTs, obj => obj.ts)
  expect(index).toBe(-1)
})
