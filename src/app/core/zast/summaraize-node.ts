import {SummarizeOp} from "./types"

export class SummarizeNode {
  constructor(public op: SummarizeOp) {}

  toZed() {
    console.log(this.op)
    return "<SUMMARIZE NODE>"
  }
}
