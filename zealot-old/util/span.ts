import {TimeArg, createTime} from "./time"
import {Ts} from "../types"

export interface Span {
  ts: Ts
  dur: Ts
}

export function createSpan(from: TimeArg, to: TimeArg) {
  const f = createTime(from)
  const t = createTime(to)
  return {
    ts: f.toTs(),
    dur: createTime(t.toNs() - f.toNs()).toTs()
  }
}
