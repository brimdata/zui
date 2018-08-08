import * as selectors from "./index"

const state = {}

test.skip("pads in buckets when there is not a value", () => {
  expect(selectors.getMainSearchCountByTime(state)).toEqual([
    {ts: new Date("2009-12-13T23:00:00.000Z"), count: 0},
    {ts: new Date("2009-12-14T00:00:00.000Z"), count: 0},
    {ts: new Date("2009-12-14T01:00:00.000Z"), count: 6},
    {ts: new Date("2009-12-14T02:00:00.000Z"), count: 0},
    {ts: new Date("2009-12-14T03:00:00.000Z"), count: 0},
    {ts: new Date("2009-12-14T04:00:00.000Z"), count: 1},
    {ts: new Date("2009-12-14T05:00:00.000Z"), count: 0},
    {ts: new Date("2009-12-14T06:00:00.000Z"), count: 0},
    {ts: new Date("2009-12-14T07:00:00.000Z"), count: 0},
    {ts: new Date("2009-12-14T08:00:00.000Z"), count: 0},
    {ts: new Date("2009-12-14T09:00:00.000Z"), count: 5}
  ])
})
