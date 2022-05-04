import {Primitive} from "./types"

export class PrimitiveNode {
  constructor(public op: Primitive) {}

  toZed() {
    if (this.op.type === "string") {
      return `"${this.op.text}"`
    } else {
      return this.op.text
    }
  }
}
