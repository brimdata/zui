import {build, ZastNode} from "./build"
import {SortOp} from "./types"

export class SortNode {
  args: ZastNode[]

  constructor(public op: SortOp) {
    this.args = op.args.map(build)
  }

  toZed() {
    // TODO: nullsfirst syntax
    const order = this.op.order === "desc" ? "-r" : ""
    const args = this.args.map((a) => a.toZed())
    return ["sort", order].concat(args).join(" ")
  }
}
