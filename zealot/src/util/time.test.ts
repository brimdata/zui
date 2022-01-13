import {createTime} from "./time"
import {createSpan} from "./span"

test("Date constructor", () => {
  const t = createTime(new Date(1))

  expect(t.toNs()).toEqual(1_000_000n)
})

test("BigInt constructor", () => {
  const t = createTime(1_000_000n)

  expect(t.toNs()).toEqual(1_000_000n)
})

test("Ts constructor", () => {
  const t = createTime({sec: 1, ns: 1})

  expect(t.toNs()).toEqual(1_000_000_001n)
})

test("toTs", () => {
  const t = createTime(4_003_002_001n)

  expect(t.toTs()).toEqual({sec: 4, ns: 3_002_001})
})

test("toTs back toNs", () => {
  const t = createTime(4_003_002_001n)
  const t2 = createTime(t.toTs())
  expect(t.toNs()).toEqual(t2.toNs())
})

test("createSpan", () => {
  const from = new Date(0)
  const to = new Date(1)
  const span = createSpan(from, to)

  expect(span).toEqual({ts: {sec: 0, ns: 0}, dur: {sec: 0, ns: 1000000}})
})

test("FracSec constructor", () => {
  const t = createTime("1425612054.369843")
  expect(t.toTs()).toEqual({sec: 1425612054, ns: 369843000})
})
