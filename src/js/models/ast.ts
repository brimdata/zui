import {toFieldPath} from "../zed-script/toZedScript"

type ColumnName = string | string[]

export default function ast(tree: any) {
  return {
    valid() {
      return !tree.error
    },
    error() {
      return tree.error || null
    },
    groupByKeys(): ColumnName[] {
      const g = this.proc("Summarize")
      const keys = g ? g.keys : []
      return keys.map((k) => fieldExprToName(k.lhs || k.rhs))
    },
    proc(name: string) {
      return getOps(tree).find((p) => p.kind === name)
    },
    procs(name: string): any[] {
      return getOps(tree).filter((p) => p.kind === name)
    },
    getProcs() {
      return getOps(tree)
    },
    self() {
      return tree
    },
  }
}

export function fieldExprToName(expr) {
  let s = _fieldExprToName(expr)
  // const r = toFieldPath(s)
  return s
}

function _fieldExprToName(expr): string | string[] {
  switch (expr.kind) {
    case "BinaryExpr":
      if (expr.op == "." || expr.op == "[") {
        return []
          .concat(_fieldExprToName(expr.lhs), _fieldExprToName(expr.rhs))
          .filter((n) => n !== "this")
      }
      return "<not-a-field>"
    case "ID":
      return expr.name
    case "This":
      return "this"
    case "Primitive":
      return expr.text
    case "Call":
      var args = expr.args
        .map((e) => toFieldPath(_fieldExprToName(e)))
        .join(",")
      return `${expr.name}(${args})`
    default:
      return "<not-a-field>"
  }
}

function getOps(ast) {
  if (!ast || ast.error) return []
  const list = []
  collectOps(ast, list)
  return list
}

function collectOps(op, list) {
  if (Array.isArray(op)) {
    for (const o of op) collectOps(o, list)
    return
  }
  list.push(op)
  if (op.kind === PARALLEL_PROC) {
    for (const p of op.paths) collectOps(p, list)
  } else if (op.kind === OP_EXPR_PROC) {
    collectOps(op.expr, list)
  }
}

export const HEAD_PROC = "Head"
export const TAIL_PROC = "Tail"
export const SORT_PROC = "Sort"
export const FILTER_PROC = "Filter"
export const PRIMITIVE_PROC = "Primitive"
export const PARALLEL_PROC = "Parallel"
export const OP_EXPR_PROC = "OpExpr"
export const REGEXP_SEARCH_PROC = "RegexpSearch"
export const ANALYTIC_PROCS = ["Summarize"]
