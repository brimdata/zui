/* @flow */

import {LookyTalk} from "boom-js-client"

type Program = string

const TUPLE_PROCS = ["HeadProc", "SortProc"]
const COMPOUND_PROCS = ["ParallelProc", "SequentialProc"]

export const hasAnalytics = (string: Program) => {
  const [ast] = parse(string)
  for (let op of listProcs(ast)) if (!TUPLE_PROCS.includes(op)) return true
  return false
}

export const parse = (string: Program) => {
  let ast = null
  let error = null
  try {
    ast = LookyTalk.parse(string)
  } catch (e) {
    error = e
  }
  return [ast, error]
}

export const addHeadProc = (program: Program, count: number) => {
  const [ast] = parse(program)
  if (listProcs(ast).includes("HeadProc")) return program
  else return program + ` | head ${count}`
}

const listProcs = ast => {
  if (!ast || !ast.proc) return []
  return COMPOUND_PROCS.includes(ast.proc.op)
    ? ast.proc.procs.map(p => p.op)
    : [ast.proc.op]
}
