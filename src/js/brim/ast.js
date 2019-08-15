/* @flow */
export default function(ast: Object) {
  return {
    groupByKeys() {
      let g = this.proc("GroupByProc")
      return g ? g.keys : []
    },
    proc(name: string) {
      return getProcs(ast).find((p) => p.op === name)
    }
  }
}

function getProcs(ast) {
  if (!ast || !ast.proc) return []
  let list = []
  collectProcs(ast.proc, list)
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
