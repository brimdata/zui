import {build, ZastNode} from "./build"
import {SequentialOp} from "./types"

export class SequentialNode {
  public ops: ZastNode[]

  constructor(public op: SequentialOp) {
    this.ops = op.ops.map(build)
  }

  *nodes() {
    yield this
    this.ops
  }

  toZed() {
    return this.ops.map((o) => o.toZed()).join(" | ")
  }
}
