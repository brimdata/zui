import {toFieldPath} from "src/js/zed-script/toZedScript"
import {fieldExprToName} from "./zed-expr"

export class ZedAst {
  constructor(public tree: any, public error: Error | null) {}

  get poolName() {
    const pool = this.poolOp
    if (!pool) return null
    return pool.spec?.pool?.text ?? null
  }

  get poolNames() {
    const from = this.fromOp
    if (!from) return []
    return from.trunks
      .map((trunk) => trunk?.source)
      .map((source) => source?.spec)
      .map((spec) => spec?.pool)
      .map((pool) => pool?.text)
      .filter((text) => !!text)
  }

  get fromOp() {
    return this.ops.find((op) => op.kind === "From")
  }

  get poolOp() {
    return this.ops.find((op) => op.kind === "Pool")
  }

  get groupByKeys() {
    const g = this.ops.find((op) => op.kind === "Summarize")
    const keys = g ? g.keys : []
    return keys.map((k) => fieldExprToName(k.lhs || k.rhs))
  }

  private _ops: any[]
  get ops() {
    if (this._ops) return this._ops
    if (!this.tree || this.tree.error) return []
    const list = []

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

    collectOps(this.tree, list)
    return (this._ops = list)
  }

  get sorts(): Record<string, "asc" | "desc"> {
    const ops = this.ops.filter((o) => o.kind === "Sort") ?? []
    let sorts = {}
    for (let op of ops) {
      if (!op.args) continue
      const name = fieldExprToName(op.args[0])
      const column = Array.isArray(name) ? name : [name]
      const fieldPath = toFieldPath(column)
      sorts[fieldPath] = op.order
    }
    return sorts
  }

  get isSummarized() {
    return !!this.ops.find((op) => op.kind === "Summarize")
  }
}

export const OP_EXPR_PROC = "OpExpr"
export const PARALLEL_PROC = "Parallel"
// are all these needed?
export const HEAD_PROC = "Head"
export const TAIL_PROC = "Tail"
export const SORT_PROC = "Sort"
export const FILTER_PROC = "Filter"
export const PRIMITIVE_PROC = "Primitive"
export const REGEXP_SEARCH_PROC = "RegexpSearch"
export const ANALYTIC_PROCS = ["Summarize"]
