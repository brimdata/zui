/* @flow */

export const HEAD_PROC = "HeadProc"
export const TAIL_PROC = "TailProc"
export const SORT_PROC = "SortProc"
export const FILTER_PROC = "FilterProc"
export const PARALLEL_PROC = "ParallelProc"
export const SEQUENTIAL_PROC = "SequentialProc"
export const TUPLE_PROCS = [HEAD_PROC, TAIL_PROC, SORT_PROC, FILTER_PROC]
export const COMPOUND_PROCS = [PARALLEL_PROC, SEQUENTIAL_PROC]

export function getProcNames(ast: *) {
  if (!ast || !ast.proc) return []

  return extractNames(ast.proc)
}

function extractNames(proc) {
  let names = [proc.op]
  for (let proc of proc.procs || []) {
    names = [...names, ...extractNames(proc)]
  }
  return names
}

export function getProcs(ast: *) {
  if (!ast || !ast.proc) return []
  return COMPOUND_PROCS.includes(ast.proc.op) ? ast.proc.procs : [ast.proc]
}
