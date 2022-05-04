import {build, ZastNode} from "./build"
import {OpExpr} from "./types"

export class OpExprNode {
  expr: ZastNode

  constructor(public op: OpExpr) {
    this.expr = build(op.expr)
  }

  toZed() {
    return this.expr.toZed()
  }
}
