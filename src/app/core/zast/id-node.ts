import {Id} from "./types"

export class IdNode {
  constructor(public op: Id) {}

  toZed() {
    return this.op.name
  }
}
