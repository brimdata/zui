import EventEmitter from "events"
import {zed} from ".."
import {Record} from "../zed"
import {Type} from "../zed/types/types"

export type TypeDefs = {[name: string]: Type}
export type Collector = (vals: {rows: zed.Value[]; shapes: TypeDefs}) => void

export class Channel extends EventEmitter {
  rows: Record[] = []
  types: TypeDefs = {}
  shapes: TypeDefs = {}
  done = false
  buffer = false

  get consumed() {
    if (this.done) return Promise.resolve()
    return new Promise((resolve, reject) => {
      this.on("end", resolve)
      this.on("error", reject)
    })
  }

  addRow(row: zed.Record) {
    this.rows.push(row)
    this.emit("row", row)
  }

  addShape(name: string) {
    const shape = this.types[name]
    this.shapes[name] = shape
    this.emit("shape", shape)
  }

  hasShape(name: string) {
    return name in this.shapes
  }

  markDone() {
    this.done = true
    this.emit("end")
  }

  collect(collector: Collector) {
    this.buffer = true
    this.on("row", () => {
      collector({rows: this.rows, shapes: this.shapes})
    })
    return this.consumed
  }
}
