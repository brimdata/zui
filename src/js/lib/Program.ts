import ZQL from "zq/zql/zql.js"

import {HEAD_PROC, TAIL_PROC} from "../brim/ast"
import {first, same} from "./Array"
import {onlyWhitespace, trim} from "./Str"
import brim from "../brim"

export type Program = string

export const parse = (string: Program) => {
  let ast = null
  let error = null
  try {
    ast = ZQL.parse(string)
  } catch (e) {
    error = e
  }
  return [ast, error]
}

export const removeHeadProc = (program: Program) => {
  return program.replace(/\|\s*head\s+\d*/i, "")
}

export const addHeadProc = (program: Program, count: number) => {
  const [ast] = parse(program)
  if (brim.ast(ast).proc(HEAD_PROC)) return program
  else return program + ` | head ${count}`
}

export const getHeadCount = (program: Program) => {
  const [ast] = parse(program)
  const head = brim.ast(ast).proc(HEAD_PROC)
  return head ? head.count : 0
}

export const hasHeadOrTailProc = (program: Program) => {
  const [ast] = parse(program)
  const a = brim.ast(ast)
  return !!(a.proc(HEAD_PROC) || a.proc(TAIL_PROC))
}

export const hasGroupByProc = (program: Program) => {
  const [ast] = parse(program)
  if (!ast) return false
  return !!getGroupByProc(ast)
}

export const getGroupByProc = (ast: any) => {
  return brim.ast(ast).proc("Summarize")
}

function joinProcs(procs: string[]) {
  return "split ( => " + procs.join(" => ") + ")"
}

export function joinParts(filter: string, proc: string) {
  const f = fmtProgram(filter)
  return [f, proc].join(" | ")
}

export function splitParts(program: string) {
  const [_, ...procs] = program.split("|")
  const p = trim(procs.join("|"))

  const [filter] = program.split("|")
  const f = trim(filter)

  return [f, p]
}

export function parallelizeProcs(programs: string[]) {
  const filters = []
  const procs = []

  for (const program of programs) {
    const [filter, proc] = splitParts(program)
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

export function fmtProgram(string: string) {
  return onlyWhitespace(string) ? "*" : string
}
