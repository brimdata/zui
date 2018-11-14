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
