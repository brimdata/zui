/* @flow */

import {HEAD_PROC, TAIL_PROC, TUPLE_PROCS, getProcNames, getProcs} from "./ast"
import {LookyTalk} from "../BoomClient"
import {first, same} from "./Array"
import {onlyWhitespace, trim} from "./Str"
import Log from "../models/Log"

export type Program = string

export const hasAnalytics = (string: Program) => {
  const [ast] = parse(string)
  for (let proc of getProcs(ast)) {
    if (!TUPLE_PROCS.includes(proc.op)) return true
  }
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
  if (getProcNames(ast).includes(HEAD_PROC)) return program
  else return program + ` | head ${count}`
}

export const getHeadCount = (program: Program) => {
  const [ast] = parse(program)
  const head = getProcs(ast).find(({op}) => op === HEAD_PROC)

  return head ? head.count : 0
}

export const hasHeadOrTailProc = (program: Program) => {
  const [ast] = parse(program)
  return !!getProcs(ast).find(({op}) => op === HEAD_PROC || op === TAIL_PROC)
}

export const hasGroupByProc = (program: Program) => {
  const [ast] = parse(program)
  if (!ast) return false
  return !!getGroupByProc(ast)
}

export const getGroupByProc = (ast: *) => {
  return getProcs(ast).find(p => p.op === "GroupByProc")
}

function joinProcs(procs: string[]) {
  return procs.join("; ")
}

export function joinParts(filter: string, proc: string) {
  let f = onlyWhitespace(filter) ? "*" : filter
  return [f, proc].join(" | ")
}

export function splitParts(program: string) {
  let [_, ...procs] = program.split("|")
  let p = trim(procs.join("|"))

  let [filter] = program.split("|")
  let f = trim(filter)

  return [f, p]
}

export function parallelizeProcs(programs: string[]) {
  let filters = []
  let procs = []

  for (let program of programs) {
    let [filter, proc] = splitParts(program)
    filters.push(filter)
    procs.push(proc)
  }

  if (!same(filters)) {
    throw new Error(
      `Filters must be the same in all programs: ${filters.join(", ")}`
    )
  }

  return joinParts(first(filters), joinProcs(procs))
}

export function deaggregate(program: string, log: Log) {
  const [ast] = parse(program)
  const groupByProc = getGroupByProc(ast)

  if (!groupByProc) return null

  function getKeyFromLog(key) {
    let val = log.get(key)
    if (val) return `${key}=${log.get(key)}`
    else return ""
  }

  const filters = groupByProc.keys.map(getKeyFromLog)
  let [filter] = splitParts(program)

  if (/\s*\*\s*/.test(filter)) filter = ""
  if (filters.includes(filter)) filter = ""

  return trim([filter, ...filters].map(trim).join(" "))
}
