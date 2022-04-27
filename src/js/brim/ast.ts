import lib from "../lib"
import {ColumnName, printColumnName} from "../state/Columns/models/column"
import {toFieldPath} from "../zql/toZql"

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
    sorts() {
      return this.procs("Sort").reduce((sorts, proc) => {
        lib.array.wrap(proc.args).forEach((field) => {
          sorts[printColumnName(fieldExprToName(field))] = proc.order
        })
        return sorts
      }, {})
    },
  }
}

function fieldExprToName(expr) {
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
  list.push(op)
  if (COMPOUND_PROCS.includes(op.kind)) {
    for (const p of op.ops) collectOps(p, list)
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
export const SEQUENTIAL_PROC = "Sequential"
export const OP_EXPR_PROC = "OpExpr"
export const REGEXP_SEARCH_PROC = "RegexpSearch"
export const COMPOUND_PROCS = [PARALLEL_PROC, SEQUENTIAL_PROC]
export const ANALYTIC_PROCS = ["Summarize", "Call", "Cut"]
