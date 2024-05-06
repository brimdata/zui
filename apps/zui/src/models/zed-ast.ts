import {toFieldPath} from "src/js/zed-script/toZedScript"
import {fieldExprToName} from "./zed-expr"

export class ZedAst {
  constructor(public tree: any, public error: Error | null) {}

  get poolName() {
    const from = this.from
    if (!from) return null
    const trunk = from.trunks.find((t) => t.source.kind === "Pool")
    if (!trunk) return null
    const name = trunk.source.spec.pool?.text
    if (!name) return null
    return name
  }

  get from() {
    return this.ops.find((o) => o.kind === "From")
  }

  get pools() {
    const trunks = this.from?.trunks || []
    return trunks.filter((t) => t.source.kind === "Pool").map((t) => t.source)
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
