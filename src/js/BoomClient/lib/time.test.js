/* @flow */
import {msToTs, tsToMs} from "./time"

test("#tsToMs", () => {
  const ts = {
    ns: 60770000,
    sec: 1542002418
  }

  const ms = tsToMs(ts)

  expect(ms).toBe(1542002418060)
})

test("#msToTs", () => {
  expect(msToTs(1542002418060)).toEqual({
    ns: 60000000,
    sec: 1542002418
  })
})

test("Converts back and forth", () => {
  const now = new Date()

  const ms = now.getTime()
  expect(tsToMs(msToTs(ms))).toBe(ms)
})

test("getting a duration", () => {
  const min = {
    sec: 1542002418,
    ns: 60770000
  }
  const max = {
    sec: 1542143467,
    ns: 180468001
  }

  const msDur = tsToMs(max) - tsToMs(min)

  expect(msToTs(msDur)).toEqual({
    ns: 120000000,
    sec: 141049
  })
})
