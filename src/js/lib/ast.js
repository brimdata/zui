/* @flow */

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

export function getProcNames(ast: *) {
  if (!ast) return []

  return extractNames(ast)
}

function extractNames(proc) {
  let names = [proc.op]
  for (let proc of proc.procs || []) {
    names = [...names, ...extractNames(proc)]
  }

  return names
}

export function getProcs(ast: *) {
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
