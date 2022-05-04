import {build, ZastNode} from "./build"
import {ZedOp} from "./types"

export class Zast {
  tree: ZastNode

  constructor(tree: ZedOp) {
    this.tree = build(tree)
  }

  *nodes() {
    for (let node of this.tree.nodes()) {
      yield node
    }
  }

  toZed() {
    return this.tree.toZed()
  }
}
