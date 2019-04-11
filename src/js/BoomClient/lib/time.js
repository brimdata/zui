/* @flow */

const secToMs = (sec) => sec * 1000
const nsToMs = (ns) => ns / 1e6

type Ts = {
  sec: number,
  ns: number
}

export const tsToMs = ({sec, ns}: Ts) => {
  return Math.floor(secToMs(sec) + nsToMs(ns))
}

export const msToTs = (ms: number) => {
  const secFloat = ms / 1000
  const sec = Math.floor(secFloat)
  const ns = +(secFloat - sec).toFixed(3) * 1e9
  return {
    sec,
    ns
  }
}
