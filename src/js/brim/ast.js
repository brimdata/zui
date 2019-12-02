/* @flow */
import lib from "../lib"

export default function ast(tree: Object) {
  return {
    valid() {
      return !tree.error
    },
    error() {
      return tree.error || null
    },
    groupByKeys() {
      let g = this.proc("GroupByProc")
      let keys = g ? g.keys : []
      return keys.map<string>((k) => fieldExprToName(k))
    },
    proc(name: string) {
      return getProcs(tree).find((p) => p.op === name)
    },
    procs(name: string): *[] {
      return getProcs(tree).filter((p) => p.op === name)
    },
    getProcs() {
      return getProcs(tree)
    },
    self() {
      return tree
    },
    sorts() {
      return this.procs("SortProc").reduce((sorts, proc) => {
        lib.array.wrap(proc.fields).forEach((field) => {
          sorts[fieldExprToName(field)] = proc.sortdir === 1 ? "asc" : "desc"
        })
        return sorts
      }, {})
    }
  }
}

function fieldExprToName(expr) {
  switch (expr.op) {
    case "FieldRead":
      return expr.field
    case "FieldCall":
      return `${fieldExprToName(expr.field)}.${expr.param}`
    case "Index":
      return `${fieldExprToName(expr.field)}[${expr.param}]`
    default:
      // XXX
      return ""
  }
}

function getProcs(ast) {
  if (!ast) return []
  let list = []
  collectProcs(ast, list)
  return list
}

function collectProcs(proc, list) {
  if (COMPOUND_PROCS.includes(proc.op)) {
    for (let p of proc.procs) collectProcs(p, list)
  } else {
    list.push(proc)
  }
}

export const HEAD_PROC = "HeadProc"
export const TAIL_PROC = "TailProc"
export const SORT_PROC = "SortProc"
export const FILTER_PROC = "FilterProc"
export const PARALLEL_PROC = "ParallelProc"
export const SEQUENTIAL_PROC = "SequentialProc"
export const SOURCE_PROC = "SourceProc"
export const TUPLE_PROCS = [
  SOURCE_PROC,
  HEAD_PROC,
  TAIL_PROC,
  SORT_PROC,
  FILTER_PROC,
  SEQUENTIAL_PROC
]
export const COMPOUND_PROCS = [PARALLEL_PROC, SEQUENTIAL_PROC]
