import * as zealot from "@brimdata/zealot"
import {fieldExprToName} from "src/js/brim/ast"
import {ColumnName} from "src/js/state/Columns/models/column"

export class ZedAst {
  public tree: any

  constructor(public script: string) {
    this.tree = zealot.parseAst(script)
  }

  get poolName() {
    const from = this.from
    if (!from) return null
    const trunk = from.trunks.find((t) => t.source.kind === "Pool")
    if (!trunk) return null
    const name = trunk.source.spec.pool.text
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

  private _ops: any[]
  get ops() {
    if (this._ops) return this._ops
    if (!this.tree || this.tree.error) return []
    const list = []

    function collectOps(op, list) {
      list.push(op)
      if (COMPOUND_PROCS.includes(op.kind)) {
        for (const p of op.ops) collectOps(p, list)
      } else if (op.kind === OP_EXPR_PROC) {
        collectOps(op.expr, list)
      }
    }

    collectOps(this.tree, list)
    return (this._ops = list)
  }

  get sorts(): [ColumnName, "asc" | "desc"][] {
    const ops = this.ops.filter((o) => o.kind === "Sort") ?? []
    return ops.map((op) => {
      const name = fieldExprToName(op.args[0])
      const column = Array.isArray(name) ? name : [name]
      return [column, op.order]
    })
  }

  get isSummarized() {
    return !!this.ops.find((op) => op.kind === "Summarize")
  }
}

export const OP_EXPR_PROC = "OpExpr"
export const PARALLEL_PROC = "Parallel"
export const SEQUENTIAL_PROC = "Sequential"
export const COMPOUND_PROCS = [PARALLEL_PROC, SEQUENTIAL_PROC]
