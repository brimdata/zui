import Moment from "moment"
import ConnDuration from "./ConnDuration"

const connDuration = new ConnDuration({
  ts: Moment.utc("2017-01-01 05:00:00"),
  duration: 1.043845
})

const TIME_ONLY = "HH:mm:ss.SSS"

test("#startMoment", () => {
  expect(connDuration.startMoment().format(TIME_ONLY)).toBe("05:00:00.000")
})

test("#endMoment", () => {
  expect(connDuration.endMoment().format(TIME_ONLY)).toBe("05:00:01.043")

  expect(connDuration.startMoment().valueOf()).toBe(1483246800000)
  expect(connDuration.endMoment().valueOf()).toBe(1483246801043)
})

test("#endMoment when duration is null", () => {
  const ts = Moment.utc("2017-01-01 05:00:00")
  let nullDuration = new ConnDuration({ts, duration: null})

  expect(nullDuration.endMoment().valueOf()).toBe(ts.valueOf())
})
