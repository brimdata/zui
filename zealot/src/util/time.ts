import {isDate, isBigInt, isTs, isString, isFracSec} from "./utils"

export interface Ts {
  sec: number
  ns: number
}

export type TimeArg = Date | bigint | Ts | string

function fracSecToNs(string: string) {
  const [sec, frac] = string.split(".")
  const secNs = BigInt(parseInt(sec)) * BigInt(1e9)
  const fracNs = BigInt(parseInt(frac) * Math.pow(10, 9 - frac.length))
  return secNs + fracNs
}

function convertToNs(val: TimeArg): bigint {
  if (isDate(val)) return BigInt(val.getTime()) * BigInt(1e6)
  if (isBigInt(val)) return val
  if (isTs(val)) return BigInt(1e9) * BigInt(val.sec) + BigInt(val.ns)
  if (isFracSec(val)) return fracSecToNs(val)

  throw new Error(`Unknown time format: ${val}`)
}

export function createTime(val: TimeArg = new Date()) {
  const ns = convertToNs(val)

  return {
    toNs() {
      return ns
    },
    toTs() {
      const sec = ns / BigInt(1e9)
      const restNs = ns - sec * BigInt(1e9)
      return {
        sec: Number(sec),
        ns: Number(restNs)
      }
    }
  }
}
