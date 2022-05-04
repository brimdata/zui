import {build, ZastNode} from "./build"
import {BinaryExpr} from "./types"

export class BinaryExprNode {
  lhs: ZastNode
  rhs: ZastNode

  constructor(public expr: BinaryExpr) {
    this.lhs = build(expr.lhs)
    this.rhs = build(expr.rhs)
  }

  toZed() {
    return [this.lhs.toZed(), this.expr.op, this.rhs.toZed()].join("")
  }
}
