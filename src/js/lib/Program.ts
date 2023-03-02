import {first, same} from "./Array"
import {onlyWhitespace, trim} from "./Str"
import {parseAst} from "@brimdata/zealot"
import ast from "../models/ast"

export type Program = string

export const parse = (string: Program) => {
  let ast = null
  let error = null
  try {
    ast = parseAst(string)
  } catch (e) {
    error = e
  }
  return [ast, error]
}

export const hasGroupByProc = (program: Program) => {
  const [ast] = parse(program)
  if (!ast) return false
  return !!getGroupByProc(ast)
}

export const getGroupByProc = (astArg: any) => {
  return ast(astArg).proc("Summarize")
}

function joinProcs(procs: string[]) {
  return "fork ( => " + procs.join(" => ") + " )"
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
