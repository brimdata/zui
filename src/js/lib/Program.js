/* @flow */

import {LookyTalk} from "boom-js-client"

type Program = string

const TUPLE_PROCS = ["HeadProc", "SortProc"]
const COMPOUND_PROCS = ["ParallelProc", "SequentialProc"]

export const hasAnalytics = (string: Program) => {
  const [ast] = parse(string)
  if (!ast || !ast.proc) return false

  const ops = COMPOUND_PROCS.includes(ast.proc.op)
    ? ast.proc.procs.map(p => p.op)
    : [ast.proc.op]

  for (let op of ops) {
    if (!TUPLE_PROCS.includes(op)) {
      return true
    }
  }
  return false
}

export const parse = (string: Program) => {
  let error = null
  let ast = null
  try {
    ast = LookyTalk.parse(string)
  } catch (e) {
    error = e
  }
  return [ast, error]
}
