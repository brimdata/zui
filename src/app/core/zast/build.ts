import {BinaryExprNode} from "./binary-expr-node"
import {IdNode} from "./id-node"
import {OpExprNode} from "./op-expr-node"
import {PrimitiveNode} from "./primitive-node"
import {SequentialNode} from "./sequential-node"
import {SortNode} from "./sort-node"
import {SummarizeNode} from "./summaraize-node"
import {ZedOp} from "./types"

export function build(op: ZedOp) {
  switch (op.kind) {
    case "Sequential":
      return new SequentialNode(op)
    case "OpExpr":
      return new OpExprNode(op)
    case "Summarize":
      return new SummarizeNode(op)
    case "Sort":
      return new SortNode(op)
    case "BinaryExpr":
      return new BinaryExprNode(op)
    case "ID":
      return new IdNode(op)
    case "Primitive":
      return new PrimitiveNode(op)
    default:
      console.log(op)
      // @ts-ignore
      throw new Error("Unknown Op: " + op.kind)
  }
}

export interface ZastNode {
  toZed(): string
  nodes(): Generator<ZastNode>
}
